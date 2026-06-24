// Central source of truth for all footprint conversion factors and model inputs.
// All values come directly from the Technical Design (chapter 5, Tables 1 & 2).
// Keeping them here means a change in scientific insight only touches one file.

// --- EcoLogits energy coefficients (Wh per output token, P_active in billions) ---
// e_token = ALPHA * P_active + BETA   (Rince et al., 2025; fitted on ML.ENERGY)
const ALPHA = 8.91e-5;
const BETA = 1.43e-3;

// --- Table 2: fixed conversion factors -----------------------------------------
const PUE_CLOUD = 1.1; // Power Usage Effectiveness, datacenter (Rince et al., 2025)
const PUE_LOCAL = 1.0; // No datacenter cooling for the local Ollama machine

const CI_CLOUD = 0.418; // kg CO2e/kWh, global electricity average (Rince et al., 2025)
const CI_LOCAL_NL = 0.27; // kg CO2/kWh, Dutch grid (CO2emissiefactoren.nl, 2025)

const WI_CLOUD = 1.8; // L/kWh, common datacenter water intensity (Li et al., 2023)
const WI_LOCAL = 0; // Local air-cooled machine consumes no direct cooling water

const ELECTRICITY_TARIFF_NL = 0.3; // EUR/kWh, indicative Dutch household tariff
const USD_TO_EUR = 0.92; // Exchange rate used for cost conversion ($1 = €0.92)

// Standardized reference request used for validation against Table 3.
const REFERENCE_REQUEST = { inputTokens: 500, outputTokens: 500 };

// Rough token estimate for the mock providers: ~4 characters per token.
const CHARS_PER_TOKEN = 4;

module.exports = {
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
  REFERENCE_REQUEST,
  CHARS_PER_TOKEN,
};
