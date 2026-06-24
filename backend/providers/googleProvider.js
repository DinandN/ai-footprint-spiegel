// Google (Gemini) provider.
//
// Currently returns a deterministic mock response so the app runs without keys.
// To go live: install @google/genai, read GOOGLE_API_KEY from the environment,
// and replace the mock block with a real generateContent() call.

const { buildMockResponse } = require("./mockResponses");

/**
 * @param {object} model    Model record (provider === 'google').
 * @param {string} prompt   User prompt.
 * @returns {Promise<{ text: string, inputTokens: number, outputTokens: number }>}
 */
async function generate(model, prompt) {
  // TODO(live): replace with a real Gemini call, e.g.
  //   const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  //   const res = await ai.models.generateContent({
  //     model: model.apiModelId,
  //     contents: prompt,
  //   });
  //   return {
  //     text: res.text,
  //     inputTokens: res.usageMetadata.promptTokenCount,
  //     outputTokens: res.usageMetadata.candidatesTokenCount,
  //   };
  return buildMockResponse(model, prompt);
}

module.exports = { generate };
