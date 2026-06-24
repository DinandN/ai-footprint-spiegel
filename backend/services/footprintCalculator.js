// Footprint calculator — the core of the business layer.
//
// Implements the EcoLogits-based estimation chain from chapter 5 of the
// Technical Design. Given a model and the input/output token counts of a single
// request, it returns the four metrics: energy (Wh), CO2 (g), water (mL) and
// cost (EUR).
//
// The method is deliberately model-agnostic: the only model-dependent inputs are
// the number of active parameters and (for cloud models) the token prices.

const {
  ALPHA,
  BETA,
  PUE_CLOUD,
  PUE_LOCAL,
  CI_CLOUD,
  CI_LOCAL_NL,
  WI_CLOUD,
  WI_LOCAL,
  ELECTRICITY_TARIFF_NL,
  USD_TO_EUR,
} = require("../config/constants");

/**
 * Energy use per output token in Wh.
 * e_token = ALPHA * P_active + BETA   (P_active in billions of parameters).
 */
function energyPerToken(pActiveBillions) {
  return ALPHA * pActiveBillions + BETA;
}

/**
 * Compute the footprint metrics for a single request to a single model.
 *
 * @param {object} args
 * @param {object} args.model           Model record (see db seed for shape).
 * @param {number} args.inputTokens     Number of input (prompt) tokens.
 * @param {number} args.outputTokens    Number of generated (output) tokens.
 * @returns {{
 *   energyWh: number, co2Grams: number, waterMl: number, costEur: number,
 *   inputTokens: number, outputTokens: number
 * }}
 */
function computeFootprint({ model, inputTokens, outputTokens }) {
  if (!model) {
    throw new Error("computeFootprint: model is required");
  }
  if (!Number.isFinite(outputTokens) || outputTokens < 0) {
    throw new Error("computeFootprint: outputTokens must be a non-negative number");
  }
  if (!Number.isFinite(inputTokens) || inputTokens < 0) {
    throw new Error("computeFootprint: inputTokens must be a non-negative number");
  }

  const isLocal = model.type === "local";

  // Step 1 — energy. E = T_out * (alpha * P_active + beta) * PUE  (Wh)
  const pue = isLocal ? PUE_LOCAL : PUE_CLOUD;
  const energyWh = outputTokens * energyPerToken(model.pActiveBillions) * pue;
  const energyKwh = energyWh / 1000;

  // Step 2 — CO2. CO2 = E * CI. Local machine runs on the Dutch grid.
  const carbonIntensity = isLocal ? CI_LOCAL_NL : CI_CLOUD; // kg/kWh
  const co2Grams = energyKwh * carbonIntensity * 1000;

  // Step 3 — water. W = E * WI. Local air-cooled machine uses no direct water.
  const waterIntensity = isLocal ? WI_LOCAL : WI_CLOUD; // L/kWh
  const waterMl = energyKwh * waterIntensity * 1000;

  // Step 4 — cost. Cloud: official token prices. Local: electricity used.
  let costEur;
  if (isLocal) {
    costEur = energyKwh * ELECTRICITY_TARIFF_NL;
  } else {
    const costUsd =
      (inputTokens / 1e6) * model.priceInputPerMTokens +
      (outputTokens / 1e6) * model.priceOutputPerMTokens;
    costEur = costUsd * USD_TO_EUR;
  }

  return {
    energyWh,
    co2Grams,
    waterMl,
    costEur,
    inputTokens,
    outputTokens,
  };
}

module.exports = { computeFootprint, energyPerToken };
