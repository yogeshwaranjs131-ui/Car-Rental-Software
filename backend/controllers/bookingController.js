const Booking = require('../models/Booking');
const User = require('../models/User');
const Car = require('../models/Car');
const nodemailer = require('nodemailer');
const axios = require('axios');

exports.createBooking = async (req, res) => {
  console.log("🔥 HIT CREATE BOOKING API! Body data:", req.body);

  try {
    const { car, startDate, endDate, totalAmount, withDriver, pickupLocation, dropoffLocation, user: bodyUserId } = req.body;
    
    const userId = req.user?.id || bodyUserId;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required for booking.' });
    }

    // 1. Create booking in database
    const booking = await Booking.create({
      user: userId,
      car,
      startDate,
      endDate,
      totalAmount,
      withDriver,
      pickupLocation,
      dropoffLocation,
    });

    console.log("✅ Booking saved to database successfully! ID:", booking._id);

    // 2. Fetch user and car info for notifications
    const userInfo = await User.findById(userId);
    const carInfo = await Car.findById(car);

    const userName = userInfo ? userInfo.name : 'Customer';
    const userEmail = userInfo ? userInfo.email : null;
    const userPhone = userInfo ? userInfo.phone : null;
    const carName = carInfo ? carInfo.name : 'Car';

    // 🚗 Cloudinary Round Logo URL (r_max ensures circle shape)
    const logoImageUrl = "https://res.cloudinary.com/dfbkat3cb/image/upload/w_100,h_100,c_fill,r_max/v1786468571/logo_i6gox8.jpg";

    // 3. Send HTML Email notification with Round Logo
    if (userEmail) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
          port: process.env.SMTP_PORT || process.env.EMAIL_PORT,
          auth: {
            user: process.env.SMTP_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER,
            pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS,
          },
        });

        const htmlTemplate = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <div style="text-align: center; background-color: #2563eb; color: #ffffff; padding: 20px; border-radius: 6px 6px 0 0;">
              
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 10px auto;">
                <tr>
                  <td align="center" style="border-radius: 50%; overflow: hidden; width: 75px; height: 75px; background: #ffffff; border: 3px solid #ffffff;">
                    <img src="${logoImageUrl}" alt="Car Rental Logo" width="75" height="75" style="display: block; width: 75px; height: 75px; object-fit: cover; border-radius: 50%; border: 0;" />
                  </td>
                </tr>
              </table>

              <h2 style="margin: 0; font-size: 22px;">🚗 Car Rental Booking Confirmed!</h2>
            </div>
            
            <div style="padding: 20px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #333333;">Hello <b>${userName}</b>,</p>
              <p style="font-size: 15px; color: #555555;">Thank you for choosing us! Your car rental booking has been successfully confirmed.</p>
              
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 8px 0; color: #333333;"><b>Booking ID:</b> ${booking._id}</p>
                <p style="margin: 8px 0; color: #333333;"><b>Car Name:</b> ${carName}</p>
                <p style="margin: 8px 0; color: #333333;"><b>Pickup Date:</b> ${startDate}</p>
                <p style="margin: 8px 0; color: #333333;"><b>Dropoff Date:</b> ${endDate}</p>
                <p style="margin: 8px 0; color: #333333;"><b>Pickup Location:</b> ${pickupLocation || 'N/A'}</p>
                <p style="margin: 8px 0; color: #333333;"><b>Dropoff Location:</b> ${dropoffLocation || 'N/A'}</p>
                <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 10px 0;">
                <p style="margin: 8px 0; font-size: 16px; color: #16a34a;"><b>Total Amount: Rs. ${totalAmount}</b></p>
              </div>
              
              <p style="font-size: 14px; color: #666666;">If you have any questions, feel free to contact our support team.</p>
              <p style="font-size: 15px; color: #333333; margin-top: 20px;">Best Regards,<br><b>Car Rental Team</b></p>
            </div>
            <div style="text-align: center; padding: 10px; font-size: 12px; color: #999999; border-top: 1px solid #e0e0e0;">
              &copy; 2026 Car Rental Software. All rights reserved.
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Car Rental Support" <${process.env.SMTP_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER}>`,
          to: userEmail,
          subject: '🚗 Car Booking Confirmed! - Car Rental Software',
          html: htmlTemplate,
        });
        
        console.log("✅ [Email Notification Sent Successfully] with Round Logo to:", userEmail);
      } catch (emailErr) {
        console.error("❌ [Email Sending Failed]:", emailErr.message);
      }
    } else {
      console.log("⚠️ User email not found, skipping email notification.");
    }

    // 4. Send SMS notification using Fast2SMS
    if (userPhone && process.env.FAST2SMS_API_KEY) {
      try {
        const cleanPhoneNumber = userPhone.replace(/^\+91/, '').trim();
        const smsMessage = `Dear ${userName}, your Car Rental booking for ${carName} (ID: ${booking._id}) is confirmed! Total: Rs.${totalAmount}. Thanks!`;

        await axios.post('https://www.fast2sms.com/dev/bulkV2', {
          route: 'q',
          message: smsMessage,
          language: 'english',
          flash: 0,
          numbers: cleanPhoneNumber,
        }, {
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          }
        });
        console.log("✅ [SMS Sent Successfully] to:", cleanPhoneNumber);
      } catch (smsErr) {
        console.error("❌ [SMS Sending Failed]:", smsErr.response?.data || smsErr.message);
      }
    } else {
      console.log("⚠️ User phone or Fast2SMS API key missing, skipping SMS.");
    }

    // 5. Send WhatsApp notification with Round Logo Image
    const whatsappInstanceId = process.env.WHATSAPP_INSTANCE_ID || process.env.ULTRAMSG_INSTANCE_ID;
    const whatsappToken = process.env.WHATSAPP_TOKEN || process.env.ULTRAMSG_TOKEN;

    if (userPhone && whatsappInstanceId && whatsappToken) {
      try {
        const cleanWhatsAppNumber = userPhone.startsWith('+') ? userPhone.replace('+', '') : `91${userPhone.replace(/^\+91/, '').trim()}`;
        
        const whatsappCaption = 
`🚗 *CAR RENTAL BOOKING CONFIRMED!* 🚗

Hello *${userName}*,
Thank you for choosing us! Your booking has been successfully confirmed.

📋 *Booking Details:*
• *Booking ID:* ${booking._id}
• *Car Name:* ${carName}
• *Pickup Date:* ${startDate}
• *Dropoff Date:* ${endDate}
• *Pickup Location:* ${pickupLocation || 'N/A'}
• *Dropoff Location:* ${dropoffLocation || 'N/A'}

💰 *Total Amount: Rs. ${totalAmount}*

If you have any questions, feel free to contact our support team.

Best Regards,
*Car Rental Team*`;

        const url = `https://api.ultramsg.com/${whatsappInstanceId}/messages/image`;

        const response = await axios.post(url, {
          token: whatsappToken,
          to: cleanWhatsAppNumber,
          image: logoImageUrl,
          caption: whatsappCaption
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && (response.data.sent || response.data.id)) {
          console.log("✅ [WhatsApp Image Sent Successfully] with Round Logo to:", cleanWhatsAppNumber);
        } else {
          console.error("❌ [UltraMsg Response Error]:", response.data);
        }

      } catch (waErr) {
        console.error("❌ [WhatsApp Sending Failed]:", waErr.response?.data || waErr.message);
      }
    } else {
      console.log("⚠️ WhatsApp credentials or phone number missing, skipping WhatsApp.");
    }

    res.status(201).json({
      success: true,
      message: 'Booking initiated successfully! Notifications triggered.',
      bookingId: booking._id,
      amount: booking.totalAmount
    });

  } catch (error) {
    console.error("❌ Booking Controller Error:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('car')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Get Booking By ID Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking
    });
  } catch (error) {
    console.error("Cancel Booking Error Details:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};