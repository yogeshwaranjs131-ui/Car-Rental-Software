const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Car = require('../models/Car');
const axios = require('axios');

const GST_RATE = 18;
const logoImageUrl = 'https://res.cloudinary.com/dfbkat3cb/image/upload/w_150,h_150,c_fill,r_max/v1786468571/logo_i6gox8.jpg';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://car-rental-software.onrender.com';

const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
};

exports.createBooking = async (req, res) => {
  console.log('======================================');
  console.log('🔥 CREATE BOOKING API HIT');
  console.log('Body:', req.body);
  console.log('======================================');

  try {
    const { car, startDate, endDate, totalAmount, withDriver, pickupLocation, dropoffLocation, user: bodyUserId } = req.body;
    const userId = req.user?.id || req.user?._id || bodyUserId;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ success: false, error: 'Valid user ID is required.' });
    }
    if (!car || !isValidObjectId(car)) {
      return res.status(400).json({ success: false, error: 'Valid car ID is required.' });
    }
    if (!startDate || !endDate || !pickupLocation || !dropoffLocation || totalAmount === undefined) {
      return res.status(400).json({ success: false, error: 'All required fields must be filled.' });
    }

    const pickupDate = new Date(startDate);
    const dropoffDate = new Date(endDate);

    if (Number.isNaN(pickupDate.getTime()) || Number.isNaN(dropoffDate.getTime()) || dropoffDate < pickupDate) {
      return res.status(400).json({ success: false, error: 'Invalid booking dates.' });
    }

    const rentalAmount = Number(totalAmount);
    const gstAmount = Number(((rentalAmount * GST_RATE) / 100).toFixed(2));
    const grandTotal = Number((rentalAmount + gstAmount).toFixed(2));

    const userInfo = await User.findById(userId);
    const carInfo = await Car.findById(car);

    if (!userInfo || !carInfo) {
      return res.status(404).json({ success: false, error: 'User or Car not found.' });
    }

    const booking = await Booking.create({
      user: userId,
      car,
      startDate: pickupDate,
      endDate: dropoffDate,
      withDriver: parseBoolean(withDriver),
      pickupLocation: String(pickupLocation).trim(),
      dropoffLocation: String(dropoffLocation).trim(),
      baseAmount: rentalAmount,
      gstPercentage: GST_RATE,
      gstAmount,
      totalAmount: grandTotal,
      paymentStatus: 'pending',
      paymentMethod: 'razorpay',
      status: 'pending',
      confirmationSent: false,
      emailSent: false,
      smsSent: false,
      whatsappSent: false,
    });

    console.log('✅ BOOKING CREATED:', booking._id.toString());

    let emailSent = false;
    if (userInfo.email) {
      try {
        const invoiceLink = `${FRONTEND_URL}/payments?bookingId=${booking._id}`;

        const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Car Rental Booking Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; color: #333;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7f6;">
              <tr>
                <td align="center" style="padding: 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    
                    <!-- Header with Clickable Full Logo -->
                    <tr>
                      <td align="center" style="background-color: #2563eb; padding: 30px 20px;">
                        <a href="${invoiceLink}" target="_blank" style="text-decoration: none;">
                          <div style="width: 90px; height: 90px; margin: 0 auto 15px auto; background: #ffffff; border-radius: 50%; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: inline-block;">
                            <img src="${logoImageUrl}" alt="Car Rental Logo" width="82" height="82" style="display: block; border-radius: 50%; object-fit: cover;">
                          </div>
                        </a>
                        <h1 style="margin: 10px 0 0; color: #ffffff; font-size: 26px; font-weight: bold;">Car Rental Booking Confirmed!</h1>
                        <p style="margin: 5px 0 0; color: #e2e8f0; font-size: 15px;">Your journey is just around the corner.</p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 35px 30px;">
                        <p style="font-size: 18px; color: #2c3e50; margin: 0 0 20px;">Hello <strong>${userInfo.name || 'Customer'}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 0 0 25px;">
                          Thank you for choosing our service! We're excited to confirm your car rental booking. Click below to view your full tax invoice and trip details.
                        </p>

                        <!-- Booking Summary -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ecf0f1; border-radius: 8px; padding: 20px;">
                          <tr>
                            <td style="padding-bottom: 15px; border-bottom: 1px solid #dde4e6;">
                              <p style="margin: 0; color: #7f8c8d; font-size: 14px;">Booking ID</p>
                              <p style="margin: 5px 0 0; color: #2c3e50; font-size: 16px; font-weight: bold; word-break: break-all;">${booking._id}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-top: 15px;">
                              <p style="margin: 0; color: #7f8c8d; font-size: 14px;">Car</p>
                              <p style="margin: 5px 0 0; color: #2c3e50; font-size: 16px; font-weight: bold;">${carInfo.name || carInfo.carName || 'Car'}</p>
                            </td>
                          </tr>
                        </table>

                        <!-- Payment Summary with 18% GST -->
                        <h2 style="font-size: 20px; color: #34495e; margin: 35px 0 15px; border-top: 1px solid #ecf0f1; padding-top: 25px;">Payment Summary</h2>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: #555;">Rental Amount</td>
                            <td align="right" style="padding: 8px 0; font-size: 15px; color: #555;">${formatCurrency(rentalAmount)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 15px; color: #555;">GST (${GST_RATE}%)</td>
                            <td align="right" style="padding: 8px 0; font-size: 15px; color: #555;">${formatCurrency(gstAmount)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 15px 0 0; border-top: 2px solid #ecf0f1; font-size: 18px; font-weight: bold; color: #2c3e50;">Grand Total</td>
                            <td align="right" style="padding: 15px 0 0; border-top: 2px solid #ecf0f1; font-size: 20px; font-weight: bold; color: #27ae60;">${formatCurrency(grandTotal)}</td>
                          </tr>
                        </table>

                        <!-- Action Button to View Invoice -->
                        <div style="text-align: center; margin-top: 35px;">
                          <a href="${invoiceLink}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 10px rgba(37,99,235,0.3);">
                            View Complete Tax Invoice & Details
                          </a>
                        </div>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td align="center" style="background-color: #ecf0f1; padding: 25px 20px;">
                        <p style="margin: 0; color: #7f8c8d; font-size: 13px;">© ${new Date().getFullYear()} Car Rental Software. All Rights Reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        // Brevo HTTP API மூலம் புதிய பிசினஸ் மெயில் மூலமாக ஈமெயில் அனுப்புதல்
        await axios.post('https://api.brevo.com/v3/smtp/email', {
          sender: { 
            name: "Car Rental Support", 
            email: process.env.SMTP_SENDER_EMAIL || "info.carrentalapp@gmail.com" 
          },
          to: [{ email: userInfo.email }],
          subject: '🚗 Car Rental Booking Confirmation & Tax Breakdown',
          htmlContent: htmlTemplate
        }, {
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
            'accept': 'application/json'
          }
        });

        emailSent = true;
        console.log('✅ EMAIL SENT VIA BREVO API:', userInfo.email);
      } catch (err) {
        console.error('❌ EMAIL FAILED:', err.response?.data || err.message);
      }
    }

    booking.emailSent = emailSent;
    booking.confirmationSent = emailSent;
    await booking.save();

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      bookingId: booking._id,
      data: booking,
    });
  } catch (error) {
    console.error('❌ CREATE BOOKING ERROR:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('car').populate('user', 'name email phone').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car').populate('user', 'name email phone');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    if (!isValidObjectId(bookingId)) {
      return res.status(400).json({ success: false, error: 'Invalid booking ID.' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, error: 'Booking is already cancelled.' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ success: false, error: 'Completed booking cannot be cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    console.log('✅ BOOKING CANCELLED:', booking._id);
    return res.status(200).json({ success: true, message: 'Booking cancelled successfully.', data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteBookingPermanently = async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    if (!isValidObjectId(bookingId)) {
      return res.status(400).json({ success: false, error: 'Invalid booking ID.' });
    }

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    
    if (!deletedBooking) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    console.log(`🗑️ BOOKING PERMANENTLY DELETED: ${bookingId}`);
    return res.status(200).json({ 
      success: true, 
      message: 'Booking deleted permanently from database.' 
    });
  } catch (error) {
    console.error('❌ DELETE BOOKING ERROR:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};