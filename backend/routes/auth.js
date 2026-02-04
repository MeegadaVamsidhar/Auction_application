const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const router = express.Router();

const Team = require('../models/Team');

const sendEmail = require('../utils/emailService');

// Register
router.post('/register', async (req, res) => {
    try {
        let { username, mobile, email, password, role, teamName } = req.body;

        // If no username provided, use mobile
        if (!username && mobile) username = mobile;
        if (!mobile && username) mobile = username; // Determine intent

        if (!mobile) return res.status(400).json({ error: 'Mobile number is required.' });

        // Basic validation
        if (role === 'captain' && !teamName) {
            return res.status(400).json({ error: 'Team Name is required for Captain registration.' });
        }

        // Check if team name exists if role is captain
        if (role === 'captain') {
            const existingTeam = await Team.findOne({ name: teamName });
            if (existingTeam) {
                return res.status(400).json({ error: 'Team name already exists. Please choose another.' });
            }
        }

        const isApproved = role !== 'admin'; // Admins need approval

        // Check duplicate mobile/email in BOTH collections
        const [existingAdmin, existingUser] = await Promise.all([
            Admin.findOne({ $or: [{ mobile }, { email: email || 'nevermatch' }] }),
            User.findOne({ $or: [{ mobile }, { email: email || 'nevermatch' }] })
        ]);

        if (existingAdmin || existingUser) {
            const hit = existingAdmin || existingUser;
            if (hit.mobile === mobile) return res.status(400).json({ error: 'Mobile number already registered.' });
            if (hit.email && hit.email === email) return res.status(400).json({ error: 'Email already registered.' });
        }

        let user;
        if (role === 'admin') {
            user = new Admin({ username, mobile, email, password, role, isApproved });
        } else {
            user = new User({ username, mobile, email, password, role, isApproved });
        }
        await user.save();

        if (role === 'admin') {
            try {
                // Generate approval token
                const approvalToken = jwt.sign(
                    { id: user._id, action: 'approve_admin' },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                // Determine base URLs
                const protocol = req.protocol;
                const host = req.get('host');
                const backendUrl = `${protocol}://${host}`;
                const frontendUrl = req.get('origin') || `${protocol}://${host.replace(':5000', ':5173')}`;

                const approvalLink = `${backendUrl}/api/admin/approve-via-email?token=${approvalToken}`;

                // 1. Notify System Admin (for approval)
                await sendEmail(
                    process.env.EMAIL_USER || 'admin@auction.com',
                    'New Admin Registration Action Required',
                    `<h3>New Admin Registration</h3>
                     <p>A new user has registered as an Admin and requires approval.</p>
                     <p><strong>Username:</strong> ${username}</p>
                     <p><strong>Mobile:</strong> ${mobile}</p>
                     ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
                     <br/>
                     <a href="${approvalLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Approve Now</a>
                     <br/><br/>
                     <p>Or login to the <a href="${frontendUrl}/admin-login">dashboard</a> to approve manually.</p>`
                );

                // 2. Notify the Registering Admin (confirmation)
                if (email) {
                    await sendEmail(
                        email,
                        'Admin Registration Pending Approval',
                        `<h3>Registration Received</h3>
                         <p>Hello ${username},</p>
                         <p>Your registration as an Admin has been received and is currently pending approval by the system administrator.</p>
                         <p>You will receive another email once your account has been approved.</p>`
                    );
                }
            } catch (emailError) {
                console.error("Failed to send admin notification emails:", emailError);
            }
        }

        if (role === 'captain') {
            const team = new Team({
                name: teamName,
                initialPurse: 100, // Representing 100 CR
                remainingPurse: 100,
                captain: user._id
            });
            await team.save();

            // Link team back to user
            user.team = team._id;
            await user.save();
        }

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'User already exists.' });
        }
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, mobile, password } = req.body;
        const identifier = mobile || username;

        if (!identifier) return res.status(400).json({ error: 'Mobile Number or Username required' });

        // Search in Admins first
        let user = await Admin.findOne({
            $or: [
                { mobile: identifier },
                { username: identifier }
            ]
        });

        // Search in Users if not found in Admins
        if (!user) {
            user = await User.findOne({
                $or: [
                    { mobile: identifier },
                    { username: identifier }
                ]
            });
        }

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isApproved) {
            return res.status(403).json({ error: 'Account not approved yet. Please check your email or contact support.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, mobile: user.mobile, role: user.role, team: user.team } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create team for existing captain (if they don't have one)
router.post('/create-team', async (req, res) => {
    try {
        const { userId, teamName } = req.body;

        if (!userId || !teamName) {
            return res.status(400).json({ error: 'User ID and Team Name are required.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.role !== 'captain') {
            return res.status(400).json({ error: 'Only captains can create teams.' });
        }

        if (user.team) {
            return res.status(400).json({ error: 'You already have a team registered.' });
        }

        // Check if team name exists
        const existingTeam = await Team.findOne({ name: teamName });
        if (existingTeam) {
            return res.status(400).json({ error: 'Team name already exists. Please choose another.' });
        }

        const team = new Team({
            name: teamName,
            initialPurse: 100,
            remainingPurse: 100,
            captain: user._id
        });
        await team.save();

        user.team = team._id;
        await user.save();

        res.status(201).json({ message: 'Team created successfully!', team });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Check captain status (team existence and approval)
router.get('/captain-status/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('team');

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.role !== 'captain') {
            return res.status(400).json({ error: 'Not a captain account.' });
        }

        if (!user.team) {
            return res.json({
                hasTeam: false,
                message: 'No team registered yet.'
            });
        }

        res.json({
            hasTeam: true,
            team: user.team,
            status: user.team.status,
            message: user.team.status === 'pending'
                ? 'Team registration pending admin approval.'
                : user.team.status === 'approved'
                    ? 'Team approved! You can access the dashboard.'
                    : 'Team registration was rejected.'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
