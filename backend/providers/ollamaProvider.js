// Ollama (local open models) provider.
//
// Talks to a locally running Ollama instance over HTTP. This is fully
// cross-platform (Windows/macOS/Linux): Ollama exposes the same REST API on
// http://localhost:11434 regardless of OS, so no platform-specific code is
// needed here.
//
// Falls back to a deterministic mock when MOCK_PROVIDERS=true. When Ollama is
// not installed or not running, a clear error is thrown and caught upstream so
// the rest of the comparison keeps working.

const { buildMockResponse } = require("./mockResponses");

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 120000;

function useMock() {
  return process.env.MOCK_PROVIDERS === "true";
}

/**
 * @param {object} model    Model record (provider === 'ollama').
 * @param {string} prompt   User prompt.
 * @returns {Promise<{ text: string, inputTokens: number, outputTokens: number }>}
 */
async function generate(model, prompt) {
  if (useMock()) {
    return buildMockResponse(model, prompt);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: model.apiModelId, prompt, stream: false }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        `Ollama-timeout na ${TIMEOUT_MS / 1000}s voor ${model.apiModelId}`,
      );
    }
    throw new Error(
      `Ollama niet bereikbaar op ${OLLAMA_HOST} — is Ollama geïnstalleerd en gestart?`,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Ollama-fout (${res.status}) voor ${model.apiModelId}: ${body.slice(0, 200)}`,
    );
  }

  const data = await res.json();
  return {
    text: data.response ?? "",
    inputTokens: data.prompt_eval_count ?? 0,
    outputTokens: data.eval_count ?? 0,
  };
}

module.exports = { generate, OLLAMA_HOST };
