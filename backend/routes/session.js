// POST /api/session/reset — reset the kiosk session and wipe temporary data.
//
// For this artefact "temporary data" is the response cache from the previous
// user's interaction. Clearing it on reset ensures the kiosk returns to a clean
// start screen (Technical Design, front-end auto session-reset).

const express = require("express");
const { clearCache } = require("../db/database");

const router = express.Router();

router.post("/reset", (req, res) => {
  clearCache();
  res.json({ ok: true, message: "Sessie gereset en tijdelijke gegevens gewist." });
});

module.exports = router;
