const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter using your email service credentials
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false, // Port 587-க்கு false இருக்க வேண்டும்
        auth: {
            user: process.env.EMAIL_USERNAME || 'yogeshwaranjs131@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'coxt stpc elld cthx', // 
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: `"Car Rental Service" <${process.env.EMAIL_USERNAME || 'yogeshwaranjs131@gmail.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // 3. Send the email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', options.email, '| Message ID:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        // We don't throw an error here to not block the booking process
        // but in a production app, you might want to queue it for a retry.
    }
};

module.exports = sendEmail;