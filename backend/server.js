// Entry point of the Express API (businesslaag).
//
// Mounts the routes from chapter 8 of the Technical Design and serves them on
// port 3001. API keys for the external providers are read server-side from .env
// and are never sent to the front-end.

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { initSchema, getAllModels } = require("./db/database");
const { seed } = require("./db/seed");

const modelsRoute = require("./routes/models");
const compareRoute = require("./routes/compare");
const footprintRoute = require("./routes/footprint");
const sessionRoute = require("./routes/session");
const examplesRoute = require("./routes/examples");

const PORT = process.env.PORT || 3001;
// Front-end origin allowed to call this API (kiosk runs on the same machine).
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const app = express();
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

// Ensure the database exists and is seeded on first start.
initSchema();
if (getAllModels().length === 0) {
  seed();
}

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/models", modelsRoute);
app.use("/api/compare", compareRoute);
app.use("/api/footprint", footprintRoute);
app.use("/api/session", sessionRoute);
app.use("/api/examples", examplesRoute);

// 404 for unknown API routes.
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint niet gevonden" });
});

// Central error handler — returns a readable message to the front-end.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("API error:", err);
  res.status(500).json({ error: "Er is een interne fout opgetreden." });
});

app.listen(PORT, () => {
  console.log(`AI Footprint Spiegel API draait op http://localhost:${PORT}`);
});

module.exports = app;
