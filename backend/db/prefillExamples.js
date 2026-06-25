// Prefill script: answers every example question with every model once and
// captures the results, so the kiosk serves the example prompts instantly from
// the cache (no live API call, no wait, no cost at runtime).
//
// It does two things:
//   1. writes the responses into the local response_cache (this machine), and
//   2. saves them to db/exampleCache.json, which is committed and re-loaded by
//      `npm run seed` — so a fresh database already contains the examples.
//
// Run with `npm run prefill` (needs the provider keys in .env and, for the local
// models, a running Ollama). Makes real API calls; re-running overwrites.

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { initSchema, getAllModels, saveCachedResponse } = require("./database");
const { seed } = require("./seed");
const { EXAMPLE_QUESTIONS } = require("./exampleQuestions");
const providers = require("../providers");
const { hashPrompt } = require("../services/compareService");

const OUT_PATH = path.join(__dirname, "exampleCache.json");
const MAX_TRIES = 3;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Retry transient provider errors (e.g. a 503 "high demand") a few times.
async function generateWithRetry(model, prompt) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_TRIES; attempt += 1) {
    try {
      return await providers.generate(model, prompt);
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_TRIES) await sleep(attempt * 4000);
    }
  }
  throw lastErr;
}

async function main() {
  initSchema();
  if (getAllModels().length === 0) seed();
  const models = getAllModels();

  const rows = [];
  for (const prompt of EXAMPLE_QUESTIONS) {
    const promptHash = hashPrompt(prompt);
    for (const model of models) {
      process.stdout.write(`• ${model.id.padEnd(22)} "${prompt.slice(0, 38)}…" `);
      try {
        const response = await generateWithRetry(model, prompt);
        saveCachedResponse(model.id, promptHash, response);
        rows.push({
          modelId: model.id,
          prompt,
          promptHash,
          text: response.text,
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens,
        });
        console.log(`ok (${response.outputTokens} tokens)`);
      } catch (err) {
        console.log(`FOUT: ${err.message}`);
      }
    }
  }

  fs.writeFileSync(OUT_PATH, `${JSON.stringify(rows, null, 2)}\n`);
  console.log(
    `\nKlaar: ${rows.length}/${EXAMPLE_QUESTIONS.length * models.length} antwoorden gecached → ${path.relative(process.cwd(), OUT_PATH)}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
