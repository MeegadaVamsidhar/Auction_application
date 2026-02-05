const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const router = express.Router();

const Team = require("../models/Team");

const sendEmail = require("../utils/emailService");

// Register
router.post("/register", async (req, res) => {
  try {
    let { username, mobile, email, password, role, teamName } = req.body;

    // If no username provided, use mobile
    if (!username && mobile) username = mobile;
    if (!mobile && username) mobile = username; // Determine intent

    if (!mobile)
      return res.status(400).json({ error: "Mobile number is required." });

    // Basic validation
    if (role === "captain" && !teamName) {
      return res
        .status(400)
        .json({ error: "Team Name is required for Captain registration." });
    }

    // Check if team name exists if role is captain
    if (role === "captain") {
      const existingTeam = await Team.findOne({ name: teamName });
      if (existingTeam) {
        return res
          .status(400)
          .json({ error: "Team name already exists. Please choose another." });
      }
    }

    const isApproved = role !== "admin"; // Admins need approval

    // Check duplicate mobile/email in BOTH collections
    const [existingAdmin, existingUser] = await Promise.all([
      Admin.findOne({ $or: [{ mobile }, { email: email || "nevermatch" }] }),
      User.findOne({ $or: [{ mobile }, { email: email || "nevermatch" }] }),
    ]);

    if (existingAdmin || existingUser) {
      const hit = existingAdmin || existingUser;
      if (hit.mobile === mobile)
        return res
          .status(400)
          .json({ error: "Mobile number already registered." });
      if (hit.email && hit.email === email)
        return res.status(400).json({ error: "Email already registered." });
    }

    let user;
    if (role === "admin") {
      user = new Admin({ username, mobile, email, password, role, isApproved });
    } else {
      user = new User({ username, mobile, email, password, role, isApproved });
    }
    await user.save();

    let emailSent = false;
    let emailError = null;

    if (role === "admin") {
      try {
        const systemAdminEmail = process.env.EMAIL_USER
          ? process.env.EMAIL_USER.trim()
          : null;

        if (!systemAdminEmail) {
          console.error("ERROR: EMAIL_USER is not defined.");
        }

        if (!process.env.JWT_SECRET) {
          throw new Error("Server configuration error: JWT_SECRET is missing.");
        }

        const approvalToken = jwt.sign(
          { id: user._id, action: "approve_admin" },
          process.env.JWT_SECRET,
          { expiresIn: "7d" },
        );

        const host = req.get("host");
        const isLocal =
          host.includes("localhost") || host.includes("127.0.0.1");
        const protocol = isLocal ? "http" : "https";

        const backendUrl = `${protocol}://${host}`;
        const frontendUrl =
          req.get("origin") ||
          (isLocal
            ? "http://localhost:5173"
            : `${protocol}://${host.replace("api.", "")}`);
        const approvalLink = `${backendUrl}/api/admin/approve-via-email?token=${approvalToken}`;

        if (systemAdminEmail) {
          await sendEmail(
            systemAdminEmail,
            `🚨 ACTION REQUIRED: New Admin Approval Requested (${username})`,
            `<h3>New Admin Registration Pending</h3>
                         <p>A new user has requested Admin access.</p>
                         <p><strong>Username:</strong> ${username}</p>
                         <p><strong>Mobile:</strong> ${mobile}</p>
                         ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
                         <br/>
                         <a href="${approvalLink}" style="background-color: #e63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Approve User Registration</a>
                         <br/><br/>
                         <p>Or manually approve via the <a href="${frontendUrl}/admin-login">Admin Dashboard</a>.</p>`,
          );
          emailSent = true;
        }

        // 2. Notify the Registering Admin (Confirmation Receipt) - This part was removed as per instruction
        // The instruction only modified the first email sending logic and the final response.
        // If the intent was to remove the second email, it should be explicitly stated.
        // For now, I'm keeping the second email sending logic as it was not explicitly removed by the instruction.
        if (email && email.trim() !== systemAdminEmail) {
          await sendEmail(
            email.trim(),
            "Admin Registration Received - Pending Approval",
            `<h3>Hello ${username},</h3>
                         <p>Your registration as an Admin has been received and is currently <strong>pending approval</strong>.</p>
                         <p>The system administrator has been notified. You will receive an email once your access is granted.</p>
                         <p>Best regards,<br/>Auction Team</p>`,
          );
        }
      } catch (err) {
        console.error(
          "CRITICAL: Failed to send admin registration emails:",
          err.message,
        );
        emailError = err.message;
      }
    }

    if (role === "captain") {
      const team = new Team({
        name: teamName,
        initialPurse: 8000, // Representing 80 CR (8000 Lakhs)
        remainingPurse: 8000,
        captain: user._id,
      });
      await team.save();

      // Link team back to user
      user.team = team._id;
      await user.save();
    }

    const successMessage =
      role === "admin"
        ? emailSent
          ? "Admin account created! Please check your email for approval."
          : `Admin account saved, but notification failed: ${emailError || "Unknown Error"}. Please contact support or approve manually.`
        : "Registration successful!";

    res.status(201).json({ message: successMessage, emailSent });
  } catch (err) {
    console.error("Registration Error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "account";
      return res
        .status(400)
        .json({
          error: `This ${field} is already registered. Please login or use different details.`,
        });
    }
    res
      .status(400)
      .json({
        error:
          err.message || "An unexpected error occurred during registration.",
      });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, mobile, password } = req.body;
    const identifier = mobile || username;

    if (!identifier)
      return res
        .status(400)
        .json({ error: "Mobile Number or Username required" });

    // Search in Admins first
    let user = await Admin.findOne({
      $or: [{ mobile: identifier }, { username: identifier }],
    });

    // Search in Users if not found in Admins
    if (!user) {
      user = await User.findOne({
        $or: [{ mobile: identifier }, { username: identifier }],
      });
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isApproved) {
      return res
        .status(403)
        .json({
          error:
            "Account not approved yet. Please check your email or contact support.",
        });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        mobile: user.mobile,
        role: user.role,
        team: user.team,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create team for existing captain (if they don't have one)
router.post("/create-team", async (req, res) => {
  try {
    const { userId, teamName } = req.body;

    if (!userId || !teamName) {
      return res
        .status(400)
        .json({ error: "User ID and Team Name are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "captain") {
      return res.status(400).json({ error: "Only captains can create teams." });
    }

    if (user.team) {
      return res
        .status(400)
        .json({ error: "You already have a team registered." });
    }

    // Check if team name exists
    const existingTeam = await Team.findOne({ name: teamName });
    if (existingTeam) {
      return res
        .status(400)
        .json({ error: "Team name already exists. Please choose another." });
    }

    const team = new Team({
      name: teamName,
      initialPurse: 8000, // Representing 80 CR (8000 Lakhs)
      remainingPurse: 8000,
      captain: user._id,
    });
    await team.save();

    user.team = team._id;
    await user.save();

    res.status(201).json({ message: "Team created successfully!", team });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Check captain status (team existence and approval)
router.get("/captain-status/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("team");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "captain") {
      return res.status(400).json({ error: "Not a captain account." });
    }

    if (!user.team) {
      return res.json({
        hasTeam: false,
        message: "No team registered yet.",
      });
    }

    res.json({
      hasTeam: true,
      team: user.team,
      status: user.team.status,
      message:
        user.team.status === "pending"
          ? "Team registration pending admin approval."
          : user.team.status === "approved"
            ? "Team approved! You can access the dashboard."
            : "Team registration was rejected.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
