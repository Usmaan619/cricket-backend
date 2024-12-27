const matchService = require("../services/matchService");

exports.getLiveMatches = async (req, res) => {
    try {
        const matches = await matchService.fetchLiveMatches();
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getMatchInfo = async (req, res) => {
    const { matchId } = req.query;
    if (!matchId) {
        return res.status(400).json({ message: "Match ID is required" });
    }

    try {
        const matchInfo = await matchService.fetchMatchInfoById(matchId);
        res.status(200).json(matchInfo);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Add similar methods for other endpoints
