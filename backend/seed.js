require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const adminExists = await Admin.findOne({ mobile: '0000000000' });
        if (!adminExists) {
            const admin = new Admin({
                username: 'admin',
                mobile: '0000000000',
                password: 'admin123',
                role: 'admin',
                isApproved: true
            });
            await admin.save();
            console.log('Admin user created in admins collection: admin / admin123 (Mobile: 0000000000)');
        } else {
            console.log('Admin already exists in admins collection');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
