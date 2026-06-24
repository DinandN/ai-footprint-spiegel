// Pulls the local Ollama models defined in the project (cross-platform).
// Reads the model list from backend/db/modelData.js so it stays in sync.
//
// Run with:  node scripts/pullModels.mjs   (or: npm run pull-models)
// Requires Ollama to be installed and its service running.

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { MODELS } = require("../backend/db/modelData.js");

const tags = MODELS.filter((m) => m.provider === "ollama").map((m) => m.apiModelId);

if (tags.length === 0) {
  console.log("Geen Ollama-modellen gedefinieerd in modelData.js.");
  process.exit(0);
}

console.log(`Ollama-modellen ophalen: ${tags.join(", ")}`);

for (const tag of tags) {
  console.log(`\n>> ollama pull ${tag}`);
  // shell:true so it works in both cmd.exe (Windows) and sh (macOS/Linux).
  const res = spawnSync(`ollama pull ${tag}`, { stdio: "inherit", shell: true });
  if (res.status !== 0) {
    console.error(
      `\n!! Pull van '${tag}' mislukt. Draait de Ollama-service? ` +
        `(start 'ollama serve' of open de Ollama-app)`,
    );
    process.exit(1);
  }
}

console.log("\n✅ Alle Ollama-modellen opgehaald.");
