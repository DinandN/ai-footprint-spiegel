// Seed script: creates the schema and fills the models table from modelData.js.
// Run with `npm run seed`. Idempotent — re-running upserts the same rows.

const fs = require("fs");
const path = require("path");
const { db, initSchema, saveCachedResponse, addExamplePrompt } = require("./database");
const { MODELS } = require("./modelData");
const { EXAMPLE_QUESTIONS } = require("./exampleQuestions");

const EXAMPLE_CACHE_PATH = path.join(__dirname, "exampleCache.json");

// Load the captured example answers (db/exampleCache.json, produced by
// `npm run prefill`) into the response cache, so a fresh database already serves
// the kiosk's example prompts without any API call. No-op when the file is
// absent. INSERT OR REPLACE keeps it idempotent.
function loadExampleCache(validIds) {
  if (!fs.existsSync(EXAMPLE_CACHE_PATH)) return;
  const rows = JSON.parse(fs.readFileSync(EXAMPLE_CACHE_PATH, "utf8"));
  const load = db.transaction((items) => {
    let loaded = 0;
    for (const r of items) {
      if (!validIds.has(r.modelId)) continue;
      saveCachedResponse(r.modelId, r.promptHash, {
        text: r.text,
        inputTokens: r.inputTokens,
        outputTokens: r.outputTokens,
      });
      loaded += 1;
    }
    return loaded;
  });
  const loaded = load(rows);
  console.log(`Loaded ${loaded} cached example responses.`);
}

function seed() {
  initSchema();

  const upsert = db.prepare(
    `INSERT INTO models
       (id, name, provider, type, api_model_id, p_active_billions,
        p_active_source, price_input_per_m, price_output_per_m)
     VALUES
       (@id, @name, @provider, @type, @apiModelId, @pActiveBillions,
        @pActiveSource, @priceInputPerMTokens, @priceOutputPerMTokens)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       provider = excluded.provider,
       type = excluded.type,
       api_model_id = excluded.api_model_id,
       p_active_billions = excluded.p_active_billions,
       p_active_source = excluded.p_active_source,
       price_input_per_m = excluded.price_input_per_m,
       price_output_per_m = excluded.price_output_per_m`,
  );

  const seedAll = db.transaction((models) => {
    for (const model of models) upsert.run(model);

    // Make the seed authoritative: remove any models (and their cached
    // responses) that are no longer in modelData.js.
    const ids = models.map((m) => m.id);
    const placeholders = ids.map(() => "?").join(",");
    db.prepare(
      `DELETE FROM response_cache WHERE model_id NOT IN (${placeholders})`,
    ).run(...ids);
    db.prepare(`DELETE FROM models WHERE id NOT IN (${placeholders})`).run(...ids);
  });

  seedAll(MODELS);
  console.log(`Seeded ${MODELS.length} models into the database.`);

  // Seed the "Verras me" pool with the built-in examples. User-submitted prompts
  // are kept (INSERT OR IGNORE), so the pool only grows.
  for (const prompt of EXAMPLE_QUESTIONS) addExamplePrompt(prompt, "seed");

  loadExampleCache(new Set(MODELS.map((m) => m.id)));
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
