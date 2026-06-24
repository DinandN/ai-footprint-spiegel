// Anthropic (Claude) provider.
//
// Makes a real call to the Anthropic Messages API and returns the response text
// together with the exact token counts from the API's usage field — these feed
// the footprint calculation.
//
// Falls back to a deterministic mock when MOCK_PROVIDERS=true or when no
// ANTHROPIC_API_KEY is configured, so the app keeps running without a key.

const { buildMockResponse } = require("./mockResponses");

const MAX_TOKENS = 1024;

function useMock() {
  return process.env.MOCK_PROVIDERS === "true" || !process.env.ANTHROPIC_API_KEY;
}

let client = null;
function getClient() {
  if (!client) {
    const Anthropic = require("@anthropic-ai/sdk");
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * @param {object} model    Model record (provider === 'anthropic').
 * @param {string} prompt   User prompt.
 * @returns {Promise<{ text: string, inputTokens: number, outputTokens: number }>}
 */
async function generate(model, prompt) {
  if (useMock()) {
    return buildMockResponse(model, prompt);
  }

  const res = await getClient().messages.create({
    model: model.apiModelId,
    max_tokens: MAX_TOKENS,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return {
    text,
    inputTokens: res.usage.input_tokens,
    outputTokens: res.usage.output_tokens,
  };
}

module.exports = { generate };
