const express = require("express");
const { getLiveMatches, getMatchInfo } = require("../controllers/matchController");

const router = express.Router();

router.get("/", getLiveMatches);
router.get("/info", getMatchInfo);

// Add routes for commentaries, schedules, etc.

module.exports = router;
