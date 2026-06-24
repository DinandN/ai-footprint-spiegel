// Seed data for the eight compared models (Technical Design, Table 1).
//
// `id`            internal slug, also the REST path parameter (/api/models/:id)
// `apiModelId`    identifier passed to the provider SDK / Ollama
// `pActiveBillions`  active parameters in billions (estimate for cloud models)
// `priceInput/Output` official price per 1M tokens in USD (null for local models)

const MODELS = [
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    type: "cloud",
    apiModelId: "gemini-2.5-pro",
    pActiveBillions: 200,
    pActiveSource: "estimate",
    priceInputPerMTokens: 1.25,
    priceOutputPerMTokens: 10.0,
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    type: "cloud",
    apiModelId: "gemini-2.5-flash",
    pActiveBillions: 70,
    pActiveSource: "estimate",
    priceInputPerMTokens: 0.3,
    priceOutputPerMTokens: 2.5,
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "google",
    type: "cloud",
    apiModelId: "gemini-2.5-flash-lite",
    pActiveBillions: 20,
    pActiveSource: "estimate",
    priceInputPerMTokens: 0.1,
    priceOutputPerMTokens: 0.4,
  },
  {
    id: "claude-opus-4-8",
    name: "Claude Opus 4.8",
    provider: "anthropic",
    type: "cloud",
    apiModelId: "claude-opus-4-8",
    pActiveBillions: 200,
    pActiveSource: "estimate",
    priceInputPerMTokens: 5.0,
    priceOutputPerMTokens: 25.0,
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
    type: "cloud",
    apiModelId: "claude-sonnet-4-6",
    pActiveBillions: 70,
    pActiveSource: "estimate",
    priceInputPerMTokens: 3.0,
    priceOutputPerMTokens: 15.0,
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    type: "cloud",
    apiModelId: "claude-haiku-4-5",
    pActiveBillions: 20,
    pActiveSource: "estimate",
    priceInputPerMTokens: 1.0,
    priceOutputPerMTokens: 5.0,
  },
  {
    id: "llama-3.2-3b",
    name: "Llama 3.2 3B",
    provider: "ollama",
    type: "local",
    apiModelId: "llama3.2:3b",
    pActiveBillions: 3,
    pActiveSource: "known",
    priceInputPerMTokens: null,
    priceOutputPerMTokens: null,
  },
  {
    id: "qwen-2.5-3b",
    name: "Qwen 2.5 3B",
    provider: "ollama",
    type: "local",
    apiModelId: "qwen2.5:3b",
    pActiveBillions: 3,
    pActiveSource: "known",
    priceInputPerMTokens: null,
    priceOutputPerMTokens: null,
  },
];

module.exports = { MODELS };
