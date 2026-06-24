// One-shot, cross-platform project setup (Windows / macOS / Linux).
//
// - installs dependencies for root, backend and frontend
// - creates .env files from .env.example where missing
// - pulls the local Ollama models if Ollama is installed (otherwise prints how
//   to install it for the current OS)
//
// Run with:  node scripts/setup.mjs   (or: npm run setup)

import { spawnSync } from "node:child_process";
import { existsSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IS_WIN = process.platform === "win32";

function sh(command, cwd = ROOT) {
  // shell:true makes the same command string work in cmd.exe and sh.
  return spawnSync(command, { stdio: "inherit", shell: true, cwd }).status === 0;
}

function commandExists(name) {
  const probe = IS_WIN ? `where ${name}` : `command -v ${name}`;
  return spawnSync(probe, { shell: true, stdio: "ignore" }).status === 0;
}

function ensureEnv(dir) {
  const example = join(ROOT, dir, ".env.example");
  const env = join(ROOT, dir, ".env");
  if (existsSync(example) && !existsSync(env)) {
    copyFileSync(example, env);
    console.log(`  • ${dir}/.env aangemaakt vanuit .env.example`);
  }
}

console.log("=== AI Footprint Spiegel — setup ===\n");

const [major] = process.versions.node.split(".").map(Number);
console.log(`Node ${process.versions.node} (${process.platform}/${process.arch})`);
if (major < 18) {
  console.error("!! Node 18+ vereist. Installeer een recente LTS (v20 of v22).");
  process.exit(1);
}

console.log("\n1/4  .env-bestanden");
ensureEnv("backend");
ensureEnv("frontend");

console.log("\n2/4  dependencies installeren (root, backend, frontend)");
if (!sh("npm install")) process.exit(1);
if (!sh("npm install", join(ROOT, "backend"))) process.exit(1);
if (!sh("npm install", join(ROOT, "frontend"))) process.exit(1);

console.log("\n3/4  database seeden");
sh("npm run seed", join(ROOT, "backend"));

console.log("\n4/4  Ollama-modellen");
if (commandExists("ollama")) {
  sh(`node "${join(ROOT, "scripts", "pullModels.mjs")}"`);
} else {
  console.log("  Ollama niet gevonden. Installeer het eenmalig:");
  if (IS_WIN) {
    console.log("    winget install Ollama.Ollama");
    console.log("    (of download: https://ollama.com/download/windows)");
  } else {
    console.log("    brew install ollama");
    console.log("    (of download: https://ollama.com/download/mac)");
  }
  console.log("  Draai daarna opnieuw: npm run setup   (of: npm run pull-models)");
}

console.log("\n=== Klaar ===");
console.log("Vul evt. API-keys in backend/.env, zorg dat Ollama draait, en start:");
console.log("  npm run dev");
console.log("Front-end: http://localhost:3000   API: http://localhost:3001");
