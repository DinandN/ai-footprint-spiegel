// Validates the footprint calculator against Table 3 of the Technical Design
// (standardized reference request of 500 input / 500 output tokens).
//
// Uses the built-in node:test runner (no extra dependencies). Run with `npm test`.

const test = require("node:test");
const assert = require("node:assert/strict");

const { computeFootprint } = require("../services/footprintCalculator");
const { MODELS } = require("../db/modelData");
const { USD_TO_EUR } = require("../config/constants");

const REF = { inputTokens: 500, outputTokens: 500 };

// Expected energy / CO2 / water per model from Table 3.
const EXPECTED = {
  "gemini-2.5-flash": { energyWh: 4.22, co2Grams: 1.76, waterMl: 7.59 },
  "gemini-2.5-flash-lite": { energyWh: 1.77, co2Grams: 0.74, waterMl: 3.18 },
  "claude-opus-4-8": { energyWh: 10.59, co2Grams: 4.43, waterMl: 19.06 },
  "claude-sonnet-4-6": { energyWh: 4.22, co2Grams: 1.76, waterMl: 7.59 },
  "claude-haiku-4-5": { energyWh: 1.77, co2Grams: 0.74, waterMl: 3.18 },
  "llama-3.2-3b": { energyWh: 0.85, co2Grams: 0.23, waterMl: 0 },
  "qwen-2.5-3b": { energyWh: 0.85, co2Grams: 0.23, waterMl: 0 },
};

// Costs that match Table 3 exactly (Claude + Ollama rows, EUR per request).
const EXPECTED_COST = {
  "claude-opus-4-8": 0.0138,
  "claude-sonnet-4-6": 0.00828,
  "claude-haiku-4-5": 0.00276,
  "llama-3.2-3b": 0.00026,
  "qwen-2.5-3b": 0.00026,
};

const byId = Object.fromEntries(MODELS.map((m) => [m.id, m]));

test("energy, CO2 and water reproduce Table 3 for all models", () => {
  for (const [id, expected] of Object.entries(EXPECTED)) {
    const fp = computeFootprint({ model: byId[id], ...REF });
    assert.ok(Math.abs(fp.energyWh - expected.energyWh) < 0.02, `${id} energy`);
    assert.ok(Math.abs(fp.co2Grams - expected.co2Grams) < 0.02, `${id} CO2`);
    assert.ok(Math.abs(fp.waterMl - expected.waterMl) < 0.05, `${id} water`);
  }
});

test("cost reproduces Table 3 for Claude and Ollama models", () => {
  for (const [id, expected] of Object.entries(EXPECTED_COST)) {
    const fp = computeFootprint({ model: byId[id], ...REF });
    assert.ok(
      Math.abs(fp.costEur - expected) < 0.0001,
      `${id} cost: got ${fp.costEur}, expected ${expected}`,
    );
  }
});

test("Google cost follows the documented method (USD price x 0.92)", () => {
  // Note: Table 3's Gemini cost cells appear to use a different exchange rate
  // (~0.846). This implementation follows the documented method, so it matches
  // the formula below rather than those specific table cells.
  for (const id of ["gemini-2.5-flash", "gemini-2.5-flash-lite"]) {
    const m = byId[id];
    const expected =
      ((REF.inputTokens / 1e6) * m.priceInputPerMTokens +
        (REF.outputTokens / 1e6) * m.priceOutputPerMTokens) *
      USD_TO_EUR;
    const fp = computeFootprint({ model: m, ...REF });
    assert.ok(Math.abs(fp.costEur - expected) < 1e-9, `${id} cost method`);
  }
});

test("local models consume no direct water", () => {
  for (const id of ["llama-3.2-3b", "qwen-2.5-3b"]) {
    const fp = computeFootprint({ model: byId[id], ...REF });
    assert.equal(fp.waterMl, 0);
  }
});
