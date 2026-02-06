const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await Admin.findOne({ username: 'admin' });
        if (admin) {
            console.log('Admin found:', {
                username: admin.username,
                mobile: admin.mobile,
                isApproved: admin.isApproved,
                role: admin.role
            });
        } else {
            console.log('Admin NOT found');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdmin();
