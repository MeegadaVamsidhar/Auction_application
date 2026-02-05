const Admin = require('../models/Admin');

const seedAdmin = async () => {
    try {
        const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
        const defaultMobile = process.env.ADMIN_MOBILE || '0000000000';
        const existingAdmin = await Admin.findOne({
            $or: [{ mobile: defaultMobile }, { username: defaultUsername }]
        });

        if (!existingAdmin) {
            const admin = new Admin({
                username: process.env.ADMIN_USERNAME || 'admin',
                mobile: defaultMobile,
                email: 'reddymeegada22@gmail.com',
                password: process.env.ADMIN_PASSWORD || 'admin123',
                role: 'admin',
                isApproved: true
            });
            await admin.save();
            console.log('✅ Default Admin Created');
        } else {
            // Update email and ensure it's approved if it exists
            let needsUpdate = false;
            if (existingAdmin.email !== 'reddymeegada22@gmail.com') {
                existingAdmin.email = 'reddymeegada22@gmail.com';
                needsUpdate = true;
            }
            if (!existingAdmin.isApproved) {
                existingAdmin.isApproved = true;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await existingAdmin.save();
                console.log('✅ Default Admin updated and access verified.');
            }
        }
    } catch (err) {
        console.error('❌ Error seeding default admin:', err.message);
    }
};

module.exports = seedAdmin;
