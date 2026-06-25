// SQLite connection and query helpers.
//
// SQLite is serverless: it reads and writes directly to a local file, so no
// separate database process is needed (Technical Design, datalaag).

const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "footprint.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/** Create tables if they do not exist yet. */
function initSchema() {
  const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
  db.exec(schema);
}

/** Map a database row (snake_case) to the camelCase shape used in the app. */
function rowToModel(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    type: row.type,
    apiModelId: row.api_model_id,
    pActiveBillions: row.p_active_billions,
    pActiveSource: row.p_active_source,
    priceInputPerMTokens: row.price_input_per_m,
    priceOutputPerMTokens: row.price_output_per_m,
  };
}

function getAllModels() {
  const rows = db.prepare("SELECT * FROM models ORDER BY provider, name").all();
  return rows.map(rowToModel);
}

function getModelById(id) {
  const row = db.prepare("SELECT * FROM models WHERE id = ?").get(id);
  return rowToModel(row);
}

function getCachedResponse(modelId, promptHash) {
  const row = db
    .prepare(
      "SELECT * FROM response_cache WHERE model_id = ? AND prompt_hash = ?",
    )
    .get(modelId, promptHash);
  if (!row) return null;
  return {
    text: row.response_text,
    inputTokens: row.input_tokens,
    outputTokens: row.output_tokens,
  };
}

function saveCachedResponse(modelId, promptHash, response) {
  db.prepare(
    `INSERT OR REPLACE INTO response_cache
       (model_id, prompt_hash, response_text, input_tokens, output_tokens)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(
    modelId,
    promptHash,
    response.text,
    response.inputTokens,
    response.outputTokens,
  );
}

function clearCache() {
  db.prepare("DELETE FROM response_cache").run();
}

/** All example prompts (seed + user-submitted), oldest first. */
function getExamplePrompts() {
  return db
    .prepare("SELECT prompt FROM example_prompts ORDER BY id")
    .all()
    .map((row) => row.prompt);
}

/**
 * Add a prompt to the "Verras me" pool. Ignores blanks and duplicates, so the
 * pool grows by one entry per distinct question.
 * @param {string} prompt
 * @param {"seed"|"user"} [source]
 */
function addExamplePrompt(prompt, source = "user") {
  const text = (prompt || "").trim();
  if (!text) return;
  db.prepare(
    "INSERT OR IGNORE INTO example_prompts (prompt, source) VALUES (?, ?)",
  ).run(text, source);
}

module.exports = {
  db,
  initSchema,
  getAllModels,
  getModelById,
  getCachedResponse,
  saveCachedResponse,
  clearCache,
  getExamplePrompts,
  addExamplePrompt,
};
