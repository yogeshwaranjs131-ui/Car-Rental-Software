const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

module.exports = transporter;
