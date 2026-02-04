const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials missing in environment variables');
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER.trim(),
            pass: process.env.EMAIL_PASS.trim()
        }
    });

    try {
        const mailOptions = {
            from: `"Auction Admin System" <${process.env.EMAIL_USER.trim()}>`,
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
