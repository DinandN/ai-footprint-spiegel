// Anthropic (Claude) provider.
//
// Currently returns a deterministic mock response so the app runs without keys.
// To go live: install @anthropic-ai/sdk, read ANTHROPIC_API_KEY from the
// environment, and replace the mock block with a real messages.create() call.

const { buildMockResponse } = require("./mockResponses");

/**
 * @param {object} model    Model record (provider === 'anthropic').
 * @param {string} prompt   User prompt.
 * @returns {Promise<{ text: string, inputTokens: number, outputTokens: number }>}
 */
async function generate(model, prompt) {
  // TODO(live): replace with a real Anthropic call, e.g.
  //   const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  //   const res = await client.messages.create({
  //     model: model.apiModelId,
  //     max_tokens: 1024,
  //     messages: [{ role: "user", content: prompt }],
  //   });
  //   return {
  //     text: res.content.map((c) => c.text ?? "").join(""),
  //     inputTokens: res.usage.input_tokens,
  //     outputTokens: res.usage.output_tokens,
  //   };
  return buildMockResponse(model, prompt);
}

module.exports = { generate };
