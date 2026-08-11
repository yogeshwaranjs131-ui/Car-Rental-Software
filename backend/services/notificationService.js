const nodemailer = require('nodemailer');
const axios = require('axios');

// 1. Nodemailer Transporter Setup (For Email)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 2. Payment Success & Notification Function (Email + WhatsApp Image)
const sendPaymentSuccessNotifications = async (user, booking, payment) => {
  const userName = user?.name || 'Customer';
  const userEmail = user?.email;
  const userPhone = user?.phone;
  const paymentId = payment?._id || payment?.razorpay_payment_id || 'SUCCESS';
  const amountPaid = payment?.amount || booking?.totalPrice || 0;
  const bookingId = booking?._id;

  // 🚗 Cloudinary Logo Image URL
  const logoImageUrl = "https://res.cloudinary.com/dfbkat3cb/image/upload/v1786468571/logo_i6gox8.jpg";

  console.log(`\n========================================`);
  console.log(`🚀 [NOTIFICATION TRIGGERED] Sending Email & WhatsApp Image!`);
  console.log(`👤 Customer: ${userName}`);
  console.log(`📧 Email: ${userEmail || 'Not Provided'}`);
  console.log(`📱 Phone: ${userPhone || 'Not Provided'}`);
  console.log(`💰 Amount: ₹${amountPaid}`);
  console.log(`========================================\n`);

  // -------------------------------------------------------------
  // A. 📧 EMAIL NOTIFICATION WITH LOGO (Nodemailer)
  // -------------------------------------------------------------
  if (userEmail) {
    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f9fafb;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoImageUrl}" alt="Car Rental Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px;" />
            <h2 style="color: #2b6cb0; margin: 0;">Car Rental Software</h2>
          </div>
          
          <h3 style="color: #2b6cb0; text-align: center;">Payment Successful! 🎉🚗</h3>
          <p>Dear <strong>${userName}</strong>,</p>
          <p>We have successfully received your payment. Your car booking is now fully confirmed!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <h4 style="color: #4a5568;">Payment & Booking Details:</h4>
          <ul style="list-style: none; padding: 0; line-height: 1.8;">
            <li><strong>Payment ID:</strong> ${paymentId}</li>
            <li><strong>Booking ID:</strong> ${bookingId}</li>
            <li><strong>Amount Paid:</strong> ₹${amountPaid}</li>
            <li><strong>Status:</strong> Success ✅</li>
          </ul>
          <p style="margin-top: 20px;">Thank you for choosing our Car Rental service. Have a safe journey!</p>
          <p>Best regards,<br/><strong>Car Rental Team</strong></p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Car Rental Support" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Payment Successful & Booking Confirmed! #${bookingId}`,
        text: `Hello ${userName}, your payment of ₹${amountPaid} was successful! Booking ID: ${bookingId}`,
        html: htmlContent
      });
      console.log("✅ [Email Sent Successfully] Customer received the email.");
    } catch (emailErr) {
      console.error("❌ [Email Error]:", emailErr.message);
    }
  } else {
    console.log("⚠️ [Email Skipped] Customer email not found.");
  }

  // -------------------------------------------------------------
  // B. 💬 WHATSAPP NOTIFICATION WITH DIRECT IMAGE (UltraMsg Image API)
  // -------------------------------------------------------------
  if (userPhone && process.env.ULTRAMSG_INSTANCE_ID && process.env.ULTRAMSG_TOKEN) {
    try {
      let cleanPhone = userPhone.replace(/^\+/, '').trim();
      if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        cleanPhone = `91${cleanPhone}`;
      }

      const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
      const token = process.env.ULTRAMSG_TOKEN;
      
      // ✅ UltraMsg Image API Endpoint (இதுதான் படத்தை நேரடியாக வாட்ஸ்அப்புக்கு அனுப்பும்)
      const url = `https://api.ultramsg.com/${instanceId}/messages/image`;

      const whatsappCaption = `🎉 *Payment Successful!*\n\nHi ${userName},\nYour payment of *₹${amountPaid}* has been successfully received!\n\n🆔 Booking ID: ${bookingId}\n💳 Payment ID: ${paymentId}\n✅ Status: Confirmed\n\nThank you for choosing Car Rental! 🚗💨`;

      const response = await axios.post(url, {
        token: token,
        to: cleanPhone,
        image: logoImageUrl,
        caption: whatsappCaption
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && (response.data.sent || response.data.id)) {
        console.log(`✅ [WhatsApp Image Sent Successfully] Logo image & message sent to ${cleanPhone}.`);
      } else {
        console.error("❌ [UltraMsg Response Error]:", response.data);
      }

    } catch (waErr) {
      console.error("❌ [WhatsApp Error]:", waErr.response?.data || waErr.message);
    }
  } else {
    console.log("⚠️ [WhatsApp Skipped] Phone number or UltraMsg credentials missing.");
  }
};

module.exports = {
  sendPaymentSuccessNotifications
};