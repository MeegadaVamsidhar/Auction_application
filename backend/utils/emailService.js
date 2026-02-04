const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    // Check for credentials using the new variable names or fallback
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = process.env.SMTP_PORT || 587;
    const secure = process.env.SMTP_SECURE === 'true'; // false for 587, true for 465
    const from = process.env.SMTP_FROM || user;

    if (!user || !pass) {
        throw new Error('Email credentials missing in environment variables (SMTP_USER/SMTP_PASS)');
    }

    const transporter = nodemailer.createTransport({
        host: host.trim(),
        port: parseInt(port),
        secure: secure,
        auth: {
            user: user.trim(),
            pass: pass.trim()
        },
        tls: {
            // Do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    try {
        const mailOptions = {
            from: `"Auction Admin" <${from.trim()}>`,
            to: to.trim(),
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
