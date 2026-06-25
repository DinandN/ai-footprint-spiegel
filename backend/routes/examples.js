// GET /api/examples — the "Verras me" prompt pool (built-in examples plus every
// prompt users have submitted). The front-end picks one at random.

const express = require("express");
const { getExamplePrompts } = require("../db/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ examples: getExamplePrompts() });
});

module.exports = router;
