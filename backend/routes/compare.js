// POST /api/compare — send a prompt to the selected models and return the
// responses with their computed footprint metrics.

const express = require("express");
const { compare } = require("../services/compareService");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { prompt, modelIds } = req.body || {};

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Veld 'prompt' is verplicht." });
    }
    if (!Array.isArray(modelIds) || modelIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Veld 'modelIds' moet een niet-lege lijst zijn." });
    }

    const result = await compare(prompt.trim(), modelIds);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
