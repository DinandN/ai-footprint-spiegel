-- SQLite schema for the AI Footprint Spiegel (Technical Design, datalaag).

-- Available models with their metadata and per-model footprint factors.
CREATE TABLE IF NOT EXISTS models (
    id                      TEXT PRIMARY KEY,        -- slug, e.g. 'claude-opus-4-8'
    name                    TEXT NOT NULL,
    provider                TEXT NOT NULL,           -- google | anthropic | ollama
    type                    TEXT NOT NULL,           -- cloud | local
    api_model_id            TEXT NOT NULL,           -- id passed to the provider
    p_active_billions       REAL NOT NULL,           -- active parameters (billions)
    p_active_source         TEXT NOT NULL,           -- estimate | known
    price_input_per_m       REAL,                    -- USD / 1M tokens (null = local)
    price_output_per_m      REAL                     -- USD / 1M tokens (null = local)
);

-- Optional cache of previous comparisons, to avoid duplicate API calls and the
-- associated energy use (Technical Design, datalaag). Keyed by model + prompt.
CREATE TABLE IF NOT EXISTS response_cache (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id        TEXT NOT NULL,
    prompt_hash     TEXT NOT NULL,
    response_text   TEXT NOT NULL,
    input_tokens    INTEGER NOT NULL,
    output_tokens   INTEGER NOT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (model_id) REFERENCES models (id),
    UNIQUE (model_id, prompt_hash)
);

CREATE INDEX IF NOT EXISTS idx_models_provider ON models (provider);
