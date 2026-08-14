const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',

  port: Number(process.env.SMTP_PORT) || 587,

  secure:
    String(process.env.SMTP_SECURE).toLowerCase() === 'true',

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

module.exports = transporter;