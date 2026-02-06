const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

async function updateAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const defaultMobile = process.env.ADMIN_MOBILE || '0000000000';
        const admin = await Admin.findOne({ username: 'admin' });
        if (admin) {
            admin.mobile = defaultMobile;
            admin.isApproved = true;
            await admin.save();
            console.log('Admin updated with mobile:', defaultMobile);
        } else {
            console.log('Admin NOT found');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

updateAdmin();
