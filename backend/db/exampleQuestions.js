// The kiosk's example prompts (the "Verras me" suggestions).
//
// IMPORTANT: these strings must match frontend/pages/challenger.vue (EXAMPLES)
// exactly — the response cache is keyed by sha256(prompt), so any difference
// means a cache miss and a fresh (slow, paid) API call. Keep both in sync.

const EXAMPLE_QUESTIONS = [
  "Leg quantumcomputing uit in één alinea voor een middelbare scholier.",
  "Schrijf een kort gedicht over de zee bij zonsondergang.",
  "Wat zijn drie praktische tips om thuis energie te besparen?",
  "Geef een recept voor een snelle vegetarische maaltijd.",
  "Vat de Franse Revolutie samen in vijf zinnen.",
];

module.exports = { EXAMPLE_QUESTIONS };
