const express = require("express");
const jwt = require("jsonwebtoken");
const Player = require("../models/Player");
const Team = require("../models/Team");
const multer = require("multer");
const xlsx = require("xlsx");
const User = require("../models/User");
const Admin = require("../models/Admin");
const sendEmail = require("../utils/emailService");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle Email Approval Link
router.get("/approve-via-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Invalid request");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.action !== "approve_admin")
      return res.status(400).send("Invalid token type");

    const user = await Admin.findByIdAndUpdate(
      decoded.id,
      { isApproved: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Send confirmation email to the user
    try {
      await sendEmail(
        user.email,
        "Account Approved",
        `<h3>Account Approved</h3>
                 <p>Hello ${user.username},</p>
                 <p>Your admin account has been approved. You can now login to the application.</p>`,
      );
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
    }

    // Return a nice HTML success page
    res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #4CAF50;">Success!</h1>
                <p>User <strong>${user.username}</strong> has been successfully approved.</p>
                <p>A confirmation email has been sent to them.</p>
            </div>
        `);
  } catch (err) {
    res
      .status(400)
      .send(
        `<h3 style="color: red; text-align: center; margin-top: 50px;">Approval Link Expired or Invalid: ${err.message}</h3>`,
      );
  }
});

// Get list of pending admin approvals
router.get("/pending-admins", async (req, res) => {
  try {
    const users = await Admin.find({ isApproved: false });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all admins (Approved and Pending)
router.get("/all-admins", async (req, res) => {
  try {
    const users = await Admin.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all players (Admin view)
router.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve/Reject player
router.patch("/players/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update player base price
router.patch("/players/:id/base-price", async (req, res) => {
  try {
    const { basePrice } = req.body;
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { basePrice },
      { new: true },
    );
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve Admin User
router.patch("/approve-admin/:id", async (req, res) => {
  try {
    // Force approval
    const isApproved = true;
    const user = await Admin.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      await sendEmail(
        user.email,
        "Account Approved",
        `<h3>Account Approved</h3>
                    <p>Hello ${user.username},</p>
                    <p>Your admin account has been approved. You can now login to the application.</p>`,
      );
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve/Reject team
router.patch("/teams/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });

    team.status = status;
    await team.save();

    if (status === "approved" && team.captain) {
      // 1. Approve the Captain (User)
      const captain = await User.findByIdAndUpdate(
        team.captain,
        { isApproved: true },
        { new: true },
      );

      if (captain) {
        // 2. Link as Player if exists in Player list
        const playerMatch = await Player.findOne({ mobile: captain.mobile });
        if (playerMatch) {
          playerMatch.status = "approved";
          playerMatch.team = team._id;
          await playerMatch.save();

          // Add to team players if not already there
          if (!team.players.includes(playerMatch._id)) {
            team.players.push(playerMatch._id);
            // Optionally deduct base price?
            // team.remainingPurse -= playerMatch.basePrice;
            await team.save();
          }
        }
      }
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create team
router.post("/teams", async (req, res) => {
  try {
    const { name, initialPurse, captainId } = req.body;
    const team = new Team({
      name,
      initialPurse,
      remainingPurse: initialPurse,
      captain: captainId,
    });
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk upload players through Excel
router.post("/upload-players", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an Excel file." });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const playersData = xlsx.utils.sheet_to_json(sheet);

    const players = [];
    const errors = [];

    for (const data of playersData) {
      try {
        // Map Excel columns to Player model fields
        // Expected columns: Name, Mobile, Year, PreviousTeams, Role, Dept
        const player = {
          name: data.Name || data.name,
          mobile: data.Mobile
            ? data.Mobile.toString()
            : data.mobile
              ? data.mobile.toString()
              : null,
          year: data.Year || data.year,
          previousTeams:
            data.PreviousTeams ||
            data.previousTeams ||
            data["Previous teams played for"],
          role: data.Role || data.role,
          dept: data.Dept || data.dept || "N/A",
          status: "pending", // Now requires admin approval
        };

        if (!player.name || !player.mobile) {
          errors.push({ data, error: "Missing Name or Mobile" });
          continue;
        }

        // Normalize Role to match Enum
        const roleUpper = player.role
          ? player.role.toString().toUpperCase().trim()
          : "";

        if (
          roleUpper.includes("BATSMAN") &&
          !roleUpper.includes("ALLROUNDER")
        ) {
          player.role = "BATSMAN";
        } else if (roleUpper === "BOWLING" || roleUpper === "BOWLER") {
          player.role = "BOWLING";
        } else if (
          roleUpper.includes("BOWLING ALLROUNDER") ||
          roleUpper.includes("BOWLING ALL ROUNDER")
        ) {
          player.role = "BOWLING ALLROUNDER";
        } else if (
          roleUpper.includes("BATTING ALLROUNDER") ||
          roleUpper.includes("BATTING ALL ROUNDER")
        ) {
          player.role = "BATTING ALLROUNDER";
        } else {
          player.role = "BATSMAN"; // Default
        }

        players.push(player);
      } catch (err) {
        errors.push({ data, error: err.message });
      }
    }

    if (players.length > 0) {
      // Use insertMany with ordered: false to skip duplicates and continue
      await Player.insertMany(players, { ordered: false });
    }

    res.status(201).json({
      message: `Successfully uploaded ${players.length} players.`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Player self-registration
router.post("/players/register", async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all teams
router.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("captain", "username")
      .populate("players");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get team by Captain ID (Fallback)
router.get("/teams/captain/:captainId", async (req, res) => {
  try {
    const team = await Team.findOne({ captain: req.params.captainId }).populate(
      "players",
    );
    if (!team)
      return res.status(404).json({ error: "No team linked to this captain" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single team by ID
router.get("/teams/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("players");
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update player details
router.put("/players/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete player
router.delete("/players/:id", async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: "Player deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update team details
router.put("/teams/:id", async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete team
router.delete("/teams/:id", async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Player List Link
router.get("/settings/player-list-link", async (req, res) => {
  try {
    const Settings = require("../models/Settings");
    const setting = await Settings.findOne({ key: "player_list_link" });
    res.json({ link: setting ? setting.value : "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Player List Link & Sync from Google Sheets
router.post("/settings/player-list-link", async (req, res) => {
  try {
    const { link } = req.body;
    const axios = require("axios");
    const Settings = require("../models/Settings");

    const setting = await Settings.findOneAndUpdate(
      { key: "player_list_link" },
      { value: link },
      { new: true, upsert: true },
    );

    // SYNC LOGIC
    if (link && link.includes("docs.google.com/spreadsheets")) {
      try {
        let csvUrl = link;
        if (link.includes("/edit")) {
          csvUrl = link.split("/edit")[0] + "/export?format=csv";
        } else if (!link.endsWith("/export?format=csv")) {
          csvUrl = link.replace(/\/$/, "") + "/export?format=csv";
        }

        console.log("Syncing from:", csvUrl);
        const response = await axios.get(csvUrl, {
          responseType: "arraybuffer",
        });
        const workbook = xlsx.read(response.data, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const playersData = xlsx.utils.sheet_to_json(sheet);

        const players = [];
        for (const data of playersData) {
          // Normalize the keys by trimming them to handle trailing spaces
          const normalizedData = {};
          Object.keys(data).forEach((key) => {
            normalizedData[key.trim()] = data[key];
          });

          const name =
            normalizedData["FULL NAME"] ||
            normalizedData["Name"] ||
            normalizedData["name"] ||
            normalizedData["Name of the Player"];

          const mobileRaw =
            normalizedData["Mobile Number"] ||
            normalizedData["Phone Number"] ||
            normalizedData["mobile"] ||
            normalizedData["Mobile"] ||
            normalizedData["phone number"] ||
            normalizedData["Contact"] ||
            normalizedData["WhatsApp Number"];

          const mobile = mobileRaw ? mobileRaw.toString().replace(/\s+/g, "") : null;

          const player = {
            name: name ? name.toString().trim() : null,
            mobile: mobile,
            year: (
              normalizedData["YEAR"] ||
              normalizedData["Year"] ||
              normalizedData["year"] ||
              normalizedData["Class"] ||
              normalizedData["Study Year"] ||
              "N/A"
            )
              .toString()
              .trim(),
            previousTeams: (
              normalizedData["PREVIOUS TEAM ( If any)"] ||
              normalizedData["Previous teams played for"] ||
              normalizedData["Previous Experience"] ||
              "None"
            )
              .toString()
              .trim(),
            role:
              normalizedData["ROLE"] ||
              normalizedData["Role"] ||
              normalizedData["role"] ||
              normalizedData["Playing Role"] ||
              "BATSMAN",
            dept: (
              normalizedData["DEPT"] ||
              normalizedData["Dept"] ||
              normalizedData["dept"] ||
              normalizedData["Department"] ||
              normalizedData["Branch"] ||
              "N/A"
            )
              .toString()
              .trim(),
            status: "pending",
          };

          if (player.name && player.mobile) {
            // Normalize Role to match Enum
            const roleUpper = player.role
              ? player.role.toString().toUpperCase().trim()
              : "";

            if (roleUpper.includes("BATSMAN") && !roleUpper.includes("ALLROUNDER")) {
              player.role = "BATSMAN";
            } else if (roleUpper.includes("BOWLING") && !roleUpper.includes("ALLROUNDER")) {
              player.role = "BOWLING";
            } else if (roleUpper.includes("BOWLING") && roleUpper.includes("ALLROUNDER")) {
              player.role = "BOWLING ALLROUNDER";
            } else if (roleUpper.includes("BATTING") && roleUpper.includes("ALLROUNDER")) {
              player.role = "BATTING ALLROUNDER";
            } else {
              // Fallback
              player.role = "BATSMAN";
            }

            players.push(player);
          }
        }

        if (players.length > 0) {
          const stats = { added: 0, updated: 0 };

          for (const pData of players) {
            const { status, ...updateData } = pData;

            // Check if this player is an approved captain
            const captainUser = await User.findOne({
              mobile: pData.mobile,
              role: "captain",
              isApproved: true,
            });

            const result = await Player.findOneAndUpdate(
              { mobile: pData.mobile },
              {
                $set: updateData,
                $setOnInsert: {
                  status: captainUser ? "approved" : "pending",
                  team: captainUser ? captainUser.team : null,
                },
              },
              { upsert: true, new: true, rawResult: true },
            );

            // If it's a captain, make sure they are linked to their team
            if (captainUser && result.value) {
              const team = await Team.findById(captainUser.team);
              if (team && !team.players.includes(result.value._id)) {
                team.players.push(result.value._id);
                await team.save();
              }
            }

            if (result.lastErrorObject.updatedExisting) {
              stats.updated++;
            } else {
              stats.added++;
            }
          }

          return res.json({
            message: `Sync Complete: Added ${stats.added} new players, Updated ${stats.updated} existing players.`,
            link: setting.value,
          });
        } else {
          return res.json({
            message:
              playersData.length > 0
                ? "Sheet link saved, but no valid players were identified. Please ensure your sheet has 'Name' and 'Mobile' columns."
                : "Sheet link saved, but the sheet appears to be empty.",
            link: setting.value,
          });
        }
      } catch (syncErr) {
        console.error("Sync Error:", syncErr.message);
        return res.json({
          message: "Link saved but sync failed (check permissions).",
          error: syncErr.message,
          link: setting.value,
        });
      }
    }

    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
