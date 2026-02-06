const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Team = require("../models/Team");

router.get("/", async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments({}); // Count ALL players
    const soldPlayers = await Player.countDocuments({ status: "sold" });
    const unsoldPlayers = await Player.countDocuments({
      status: { $in: ["unsold", "pending"] },
    }); // Include pending as potentially unsold

    const teams = await Team.find({ status: "approved" }).select(
      "name players",
    );
    const teamStats = teams.map((team) => ({
      id: team._id,
      name: team.name,
      playerCount: team.players.length,
    }));

    res.json({
      totalPlayers,
      soldPlayers,
      unsoldPlayers,
      teamStats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
