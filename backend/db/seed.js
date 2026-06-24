// Seed script: creates the schema and fills the models table from modelData.js.
// Run with `npm run seed`. Idempotent — re-running upserts the same rows.

const { db, initSchema } = require("./database");
const { MODELS } = require("./modelData");

function seed() {
  initSchema();

  const upsert = db.prepare(
    `INSERT INTO models
       (id, name, provider, type, api_model_id, p_active_billions,
        p_active_source, price_input_per_m, price_output_per_m)
     VALUES
       (@id, @name, @provider, @type, @apiModelId, @pActiveBillions,
        @pActiveSource, @priceInputPerMTokens, @priceOutputPerMTokens)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       provider = excluded.provider,
       type = excluded.type,
       api_model_id = excluded.api_model_id,
       p_active_billions = excluded.p_active_billions,
       p_active_source = excluded.p_active_source,
       price_input_per_m = excluded.price_input_per_m,
       price_output_per_m = excluded.price_output_per_m`,
  );

  const seedAll = db.transaction((models) => {
    for (const model of models) upsert.run(model);
  });

  seedAll(MODELS);
  console.log(`Seeded ${MODELS.length} models into the database.`);
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
