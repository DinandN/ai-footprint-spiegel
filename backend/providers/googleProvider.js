// Google (Gemini) provider.
//
// Makes a real call to the Gemini Developer API (Google AI Studio key) and
// returns the response text plus the exact token counts from usageMetadata.
//
// Falls back to a deterministic mock when MOCK_PROVIDERS=true or when no
// GOOGLE_API_KEY is configured, so the app keeps running without a key.

const { buildMockResponse } = require("./mockResponses");

function useMock() {
  return process.env.MOCK_PROVIDERS === "true" || !process.env.GOOGLE_API_KEY;
}

let client = null;
function getClient() {
  if (!client) {
    const { GoogleGenAI } = require("@google/genai");
    client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  }
  return client;
}

/**
 * @param {object} model    Model record (provider === 'google').
 * @param {string} prompt   User prompt.
 * @returns {Promise<{ text: string, inputTokens: number, outputTokens: number }>}
 */
async function generate(model, prompt) {
  if (useMock()) {
    return buildMockResponse(model, prompt);
  }

  const res = await getClient().models.generateContent({
    model: model.apiModelId,
    contents: prompt,
  });

  const usage = res.usageMetadata || {};
  return {
    text: res.text ?? "",
    inputTokens: usage.promptTokenCount ?? 0,
    outputTokens: usage.candidatesTokenCount ?? 0,
  };
}

module.exports = { generate };
