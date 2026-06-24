// Routes for retrieving model metadata and per-model footprint factors.

const express = require("express");
const { getAllModels, getModelById } = require("../db/database");

const router = express.Router();

// GET /api/models — all available models incl. metadata and footprint factors.
router.get("/", (req, res) => {
  res.json({ models: getAllModels() });
});

// GET /api/models/:id — a specific model.
router.get("/:id", (req, res) => {
  const model = getModelById(req.params.id);
  if (!model) {
    return res.status(404).json({ error: "Model niet gevonden" });
  }
  res.json({ model });
});

module.exports = router;
