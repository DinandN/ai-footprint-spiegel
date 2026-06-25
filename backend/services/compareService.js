// Compare service — orchestrates a single comparison run.
//
// For each selected model it (optionally) checks the cache, asks the provider
// for a response, and computes the footprint metrics. Models run in parallel and
// a failure in one model does not break the others (Technical Design, businesslaag).

const crypto = require("crypto");
const providers = require("../providers");
const { computeFootprint } = require("./footprintCalculator");
const {
  getModelById,
  getCachedResponse,
  saveCachedResponse,
  addExamplePrompt,
} = require("../db/database");

function hashPrompt(prompt) {
  return crypto.createHash("sha256").update(prompt).digest("hex");
}

/** Fetch a response for one model (cache-first), then compute its footprint. */
async function compareOne(modelId, prompt, promptHash) {
  const model = getModelById(modelId);
  if (!model) {
    return { modelId, ok: false, error: "Model niet gevonden" };
  }

  try {
    let response = getCachedResponse(modelId, promptHash);
    let cached = Boolean(response);

    if (!response) {
      response = await providers.generate(model, prompt);
      saveCachedResponse(modelId, promptHash, response);
    }

    const footprint = computeFootprint({
      model,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
    });

    return {
      modelId,
      ok: true,
      cached,
      model: {
        id: model.id,
        name: model.name,
        provider: model.provider,
        type: model.type,
      },
      response: response.text,
      footprint,
    };
  } catch (err) {
    // A provider timeout or error must not break the comparison with the rest.
    return {
      modelId,
      ok: false,
      model: { id: model.id, name: model.name },
      error: err.message || "Onbekende fout bij het ophalen van het antwoord",
    };
  }
}

/**
 * Run a comparison for a prompt across the selected model ids.
 * @param {string} prompt
 * @param {string[]} modelIds
 */
async function compare(prompt, modelIds) {
  const promptHash = hashPrompt(prompt);

  // Grow the "Verras me" pool: every submitted prompt becomes a suggestion.
  // Best-effort — a pool write must never break the comparison itself.
  try {
    addExamplePrompt(prompt, "user");
  } catch {
    // ignore: the pool is non-critical
  }

  const results = await Promise.all(
    modelIds.map((id) => compareOne(id, prompt, promptHash)),
  );
  return { prompt, results };
}

module.exports = { compare, hashPrompt };
