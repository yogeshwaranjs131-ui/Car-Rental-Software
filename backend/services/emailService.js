const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send Email Generic Service
const sendEmailService = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"Car Rental System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email notification.');
  }
};

// Send Booking Confirmation Email
const sendBookingConfirmationEmail = async (user, booking, car) => {
  const subject = 'Booking Confirmation - Car Rental System';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2b6cb0;">Booking Confirmed!</h2>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Thank you for booking with us. Your rental details are as follows:</p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <ul>
        <li><strong>Car:</strong> ${car.name} (${car.brand})</li>
        <li><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</li>
        <li><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</li>
        <li><strong>Total Price:</strong> ₹${booking.totalPrice}</li>
      </ul>
      <p>We hope you have a wonderful driving experience!</p>
      <p>Best regards,<br/><strong>Car Rental Team</strong></p>
    </div>
  `;

  await sendEmailService({
    to: user.email,
    subject,
    html,
    text: `Your booking for ${car.name} has been confirmed. Total price: ₹${booking.totalPrice}`
  });
};

module.exports = {
  sendEmailService,
  sendBookingConfirmationEmail
};