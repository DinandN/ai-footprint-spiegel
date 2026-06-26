// Unit tests for the compare orchestration (businesslaag) and the data layer.
//
// Runs fully offline: an in-memory database (DB_PATH=:memory:) and the
// deterministic mock providers (MOCK_PROVIDERS=true) — no API keys, no Ollama,
// no network. These env vars must be set before the modules are required.
process.env.DB_PATH = ":memory:";
process.env.MOCK_PROVIDERS = "true";

const { test } = require("node:test");
const assert = require("node:assert/strict");

const { db, initSchema, getExamplePrompts, addExamplePrompt } = require("../db/database");
const { compare } = require("../services/compareService");

initSchema();

// Two models straight into the in-memory DB (one cloud, one local), so the
// service has something to look up without depending on the full seed.
const insertModel = db.prepare(
  `INSERT OR REPLACE INTO models
     (id, name, provider, type, api_model_id, p_active_billions,
      p_active_source, price_input_per_m, price_output_per_m)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
);
insertModel.run("gemini-2.5-flash", "Gemini 2.5 Flash", "google", "cloud", "gemini-2.5-flash", 70, "estimate", 0.3, 2.5);
insertModel.run("llama-3.2-3b", "Llama 3.2 3B", "ollama", "local", "llama3.2:3b", 3, "known", null, null);

test("compare geeft per model een antwoord met footprint-metrics", async () => {
  const { results } = await compare("Een unieke vraag voor de test", [
    "gemini-2.5-flash",
    "llama-3.2-3b",
  ]);
  assert.equal(results.length, 2);
  for (const r of results) {
    assert.equal(r.ok, true);
    assert.equal(r.cached, false);
    assert.ok(r.response.length > 0);
    assert.ok(Number.isFinite(r.footprint.energyWh));
    assert.ok(r.footprint.outputTokens > 0);
  }
});

test("een tweede identieke vraag komt uit de cache", async () => {
  await compare("cache vraag uniek", ["gemini-2.5-flash"]);
  const { results } = await compare("cache vraag uniek", ["gemini-2.5-flash"]);
  assert.equal(results[0].cached, true);
});

test("een onbekend model faalt zonder de andere modellen te breken", async () => {
  const { results } = await compare("vraag met een fout model", [
    "gemini-2.5-flash",
    "bestaat-niet",
  ]);
  const ok = results.find((r) => r.modelId === "gemini-2.5-flash");
  const bad = results.find((r) => r.modelId === "bestaat-niet");
  assert.equal(ok.ok, true);
  assert.equal(bad.ok, false);
  assert.match(bad.error, /niet gevonden/i);
});

test("een verstuurde vraag belandt in de voorbeeld-pool en dedupliceert", async () => {
  const q = "Pool-groei testvraag";
  await compare(q, ["gemini-2.5-flash"]);
  assert.ok(getExamplePrompts().includes(q));

  const before = getExamplePrompts().length;
  await compare(q, ["gemini-2.5-flash"]); // exact dezelfde vraag → geen duplicaat
  assert.equal(getExamplePrompts().length, before);
});

test("addExamplePrompt negeert lege invoer", () => {
  const before = getExamplePrompts().length;
  addExamplePrompt("   ", "user");
  assert.equal(getExamplePrompts().length, before);
});
