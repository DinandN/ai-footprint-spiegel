// GET /api/footprint/:modelId — the footprint factors of a specific model plus
// a reference computation (standardized 500/500-token request, Table 3 of the TO).

const express = require("express");
const { getModelById } = require("../db/database");
const { computeFootprint } = require("../services/footprintCalculator");
const { REFERENCE_REQUEST } = require("../config/constants");

const router = express.Router();

router.get("/:modelId", (req, res) => {
  const model = getModelById(req.params.modelId);
  if (!model) {
    return res.status(404).json({ error: "Model niet gevonden" });
  }

  const reference = computeFootprint({
    model,
    inputTokens: REFERENCE_REQUEST.inputTokens,
    outputTokens: REFERENCE_REQUEST.outputTokens,
  });

  res.json({
    model: {
      id: model.id,
      name: model.name,
      provider: model.provider,
      type: model.type,
      pActiveBillions: model.pActiveBillions,
      priceInputPerMTokens: model.priceInputPerMTokens,
      priceOutputPerMTokens: model.priceOutputPerMTokens,
    },
    referenceRequest: REFERENCE_REQUEST,
    footprint: reference,
  });
});

module.exports = router;
