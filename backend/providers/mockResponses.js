// Deterministic mock responses for the provider stubs.
//
// Keeps the app fully runnable without API keys. Each provider produces a short,
// recognizable answer plus a token estimate, so the footprint calculation has
// real numbers to work with. Swap these out for live SDK calls later.

const { CHARS_PER_TOKEN } = require("../config/constants");

/** Rough token count from text length (~4 chars per token). */
function estimateTokens(text) {
  return Math.max(1, Math.ceil(text.length / CHARS_PER_TOKEN));
}

/**
 * Build a deterministic mock reply for a given model and prompt.
 * Output length scales a little with the prompt so different prompts differ.
 */
function buildMockResponse(model, prompt) {
  const text =
    `[MOCK · ${model.name}] Dit is een gesimuleerd antwoord op je prompt ` +
    `"${prompt.slice(0, 80)}". De echte ${model.provider}-integratie is nog ` +
    `niet aangesloten; deze tekst dient om de footprint-berekening te demonstreren.`;

  return {
    text,
    inputTokens: estimateTokens(prompt),
    outputTokens: estimateTokens(text),
  };
}

module.exports = { buildMockResponse, estimateTokens };
