// Ollama (local open models) provider.
//
// Currently returns a deterministic mock response so the app runs without a
// running Ollama instance. To go live: ensure Ollama is running locally and
// replace the mock block with a real call to its HTTP API (default
// http://localhost:11434). No internet connection or API key is required.

const { buildMockResponse } = require("./mockResponses");

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";

/**
 * @param {object} model    Model record (provider === 'ollama').
 * @param {string} prompt   User prompt.
 * @returns {Promise<{ text: string, inputTokens: number, outputTokens: number }>}
 */
async function generate(model, prompt) {
  // TODO(live): replace with a real local call, e.g.
  //   const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ model: model.apiModelId, prompt, stream: false }),
  //   });
  //   const data = await res.json();
  //   return {
  //     text: data.response,
  //     inputTokens: data.prompt_eval_count,
  //     outputTokens: data.eval_count,
  //   };
  return buildMockResponse(model, prompt);
}

module.exports = { generate, OLLAMA_HOST };
