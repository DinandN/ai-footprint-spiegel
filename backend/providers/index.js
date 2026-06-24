// Provider dispatch: routes a model to the correct provider implementation.

const anthropicProvider = require("./anthropicProvider");
const googleProvider = require("./googleProvider");
const ollamaProvider = require("./ollamaProvider");

const PROVIDERS = {
  anthropic: anthropicProvider,
  google: googleProvider,
  ollama: ollamaProvider,
};

/**
 * Send a prompt to the provider that owns the given model.
 * @returns {Promise<{ text: string, inputTokens: number, outputTokens: number }>}
 */
async function generate(model, prompt) {
  const provider = PROVIDERS[model.provider];
  if (!provider) {
    throw new Error(`Unknown provider: ${model.provider}`);
  }
  return provider.generate(model, prompt);
}

module.exports = { generate, PROVIDERS };
