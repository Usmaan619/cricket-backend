const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
    {
        matchId: { type: String, required: true },
        type: { type: String, enum: ["live", "upcoming","recent"], required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
