const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const bcrypt = require("bcryptjs");
const { calculateBasePrice } = require("../utils/playerUtils");

// @route   POST /api/players/register
// @desc    Register a new player for the auction
// @access  Public
router.post("/register", async (req, res) => {
  try {
    console.log("Incoming Registration Request:", req.body);
    const {
      name,
      mobile,
      password,
      dept,
      year,
      role,
      battingStyle,
      bowlingStyle,
      contact,
      stats,
      previousTeams,
    } = req.body;

    // Validation
    if (!name || !mobile || !year || !role) {
      return res
        .status(400)
        .json({
          error:
            "Please fill all required fields: Name, Mobile, Year, Role",
        });
    }

    // Check if player already exists with same mobile
    const existingPlayer = await Player.findOne({ mobile });
    if (existingPlayer) {
      return res
        .status(400)
        .json({
          error: "A player with this mobile number is already registered",
        });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Normalize Role
    let normalizedRole = role;
    const roleUpper = role.toUpperCase().replace(/\s+|-/g, "");

    if (roleUpper === "ALLROUNDER") normalizedRole = "All-rounder";
    else if (roleUpper === "BATSMAN") normalizedRole = "Batsman";
    else if (roleUpper === "BOWLER") normalizedRole = "Bowler";
    else if (roleUpper === "WICKETKEEPER") normalizedRole = "Wicket-keeper";

    // Ensure role matches enum EXACTLY
    const validRoles = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];
    if (!validRoles.includes(normalizedRole)) {
      return res
        .status(400)
        .json({
          error: `Invalid role selected (${role}). Must be one of: ${validRoles.join(", ")}`,
        });
    }

    // Base price calculation
    const basePrice = calculateBasePrice(year);

    const newPlayer = new Player({
      name,
      mobile,
      password: hashedPassword,
      dept: dept || "N/A",
      year,
      basePrice,
      previousTeams,
      role: normalizedRole,
      battingStyle: battingStyle || "Right-hand",
      bowlingStyle: bowlingStyle || "N/A",
      contact: contact || mobile,
      stats: {
        matches: parseInt(stats?.matches) || 0,
        runs: parseInt(stats?.runs) || 0,
        wickets: parseInt(stats?.wickets) || 0,
        average: 0,
      },
      status: "pending",
    });

    await newPlayer.save();
    console.log("Player Registered Successfully:", name);

    // Check if a captain exists with the same mobile number
    const User = require("../models/User");
    const Team = require("../models/Team");

    const captainUser = await User.findOne({
      mobile: mobile,
      role: "captain",
    });

    if (captainUser && captainUser.team) {
      // Captain exists with this mobile - auto-assign player to their team
      const team = await Team.findById(captainUser.team);

      if (team) {
        // Update player with captain's name and assign to team
        newPlayer.name = captainUser.username;
        newPlayer.team = team._id;
        newPlayer.status = "sold";
        newPlayer.soldPrice = 0; // Captain doesn't cost the team
        await newPlayer.save();

        // Add player to team roster (no purse deduction for captain)
        if (!team.players.includes(newPlayer._id)) {
          team.players.push(newPlayer._id);
          await team.save();
        }

        console.log(`Player auto-assigned to team ${team.name} as captain`);

        return res.status(201).json({
          message: "Registration Successful! You have been automatically assigned to your team as captain.",
          player: { id: newPlayer._id, name: newPlayer.name, team: team.name },
        });
      }
    }

    res
      .status(201)
      .json({
        message: "Registration Successful! Waiting for Admin Approval.",
        player: { id: newPlayer._id, name: newPlayer.name },
      });
  } catch (err) {
    console.error("Critical Registration Error:", err);
    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
      return res.status(400).json({ error: "Mobile number already exists." });
    }
    res
      .status(500)
      .json({
        error: err.message || "Internal Server Error during registration",
      });
  }
});

// @route   POST /api/players/login
// @desc    Player Login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { mobile } = req.body;
    const player = await Player.findOne({ mobile });
    if (!player) return res.status(404).json({ error: "Player not found" });

    // Password check removed as per user request
    res.json({ message: "Login successful", player });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// @route   GET /api/players
// @desc    Get all players for the gallery
// @access  Public
router.get("/", async (req, res) => {
  try {
    const players = await Player.find({ status: { $ne: "rejected" } })
      .select("-password")
      .populate("team", "name");
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching players" });
  }
});

// @route   GET /status/mobile/:mobile
// @desc    Get player status by mobile number
// @access  Public
router.get("/status/mobile/:mobile", async (req, res) => {
  try {
    const player = await Player.findOne({ mobile: req.params.mobile }).populate(
      "team",
      "name",
    );
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: "Server error check by mobile" });
  }
});

module.exports = router;
