const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Car = require('../models/Car');
const axios = require('axios'); // Keep axios if used elsewhere
const transporter = require('../config/mail'); // Changed from email to mail

// ============================================================
// CONFIGURATION
// ============================================================

const GST_RATE = 18;

const logoImageUrl =
  'https://res.cloudinary.com/dfbkat3cb/image/upload/w_150,h_150,c_fill,r_max/v1786468571/logo_i6gox8.jpg';

// ============================================================
// HELPERS
// ============================================================

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
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return false;
};

// ============================================================
// CREATE BOOKING
// ============================================================

exports.createBooking = async (req, res) => {
  console.log('======================================');
  console.log('🔥 CREATE BOOKING API HIT');
  console.log('Body:', req.body);
  console.log('======================================');

  try {
    const {
      car,
      startDate,
      endDate,
      totalAmount,
      withDriver,
      pickupLocation,
      dropoffLocation,
      user: bodyUserId,
    } = req.body;

    // ========================================================
    // USER ID
    // ========================================================

    const userId =
      req.user?.id ||
      req.user?._id ||
      bodyUserId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required for booking.',
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID.',
      });
    }

    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (!car) {
      return res.status(400).json({
        success: false,
        error: 'Car is required.',
      });
    }

    if (!isValidObjectId(car)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid car ID.',
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error:
          'Start date and end date are required.',
      });
    }

    if (!pickupLocation) {
      return res.status(400).json({
        success: false,
        error:
          'Pickup location is required.',
      });
    }

    if (!dropoffLocation) {
      return res.status(400).json({
        success: false,
        error:
          'Dropoff location is required.',
      });
    }

    if (
      totalAmount === undefined ||
      totalAmount === null ||
      totalAmount === ''
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Total amount is required.',
      });
    }

    // ========================================================
    // DATE VALIDATION
    // ========================================================

    const pickupDate = new Date(startDate);
    const dropoffDate = new Date(endDate);

    if (
      Number.isNaN(pickupDate.getTime()) ||
      Number.isNaN(dropoffDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking dates.',
      });
    }

    if (dropoffDate < pickupDate) {
      return res.status(400).json({
        success: false,
        error:
          'Dropoff date cannot be before pickup date.',
      });
    }

    // ========================================================
    // AMOUNT VALIDATION
    // ========================================================

    const rentalAmount = Number(totalAmount);

    if (
      !Number.isFinite(rentalAmount) ||
      rentalAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid total amount.',
      });
    }

    // ========================================================
    // GST CALCULATION
    // ========================================================

    const gstAmount = Number(
      (
        (rentalAmount * GST_RATE) /
        100
      ).toFixed(2)
    );

    const grandTotal = Number(
      (
        rentalAmount +
        gstAmount
      ).toFixed(2)
    );

    console.log('======================================');
    console.log('💰 PAYMENT CALCULATION');
    console.log(
      'Rental Amount:',
      rentalAmount
    );
    console.log(
      `GST (${GST_RATE}%):`,
      gstAmount
    );
    console.log(
      'Grand Total:',
      grandTotal
    );
    console.log('======================================');

    // ========================================================
    // GET USER
    // ========================================================

    const userInfo =
      await User.findById(userId);

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    // ========================================================
    // GET CAR
    // ========================================================

    const carInfo =
      await Car.findById(car);

    if (!carInfo) {
      return res.status(404).json({
        success: false,
        error: 'Car not found.',
      });
    }

    // ========================================================
    // CHECK CAR AVAILABILITY
    // ========================================================

    const overlappingBooking =
      await Booking.findOne({
        car,

        status: {
          $in: [
            'pending',
            'confirmed',
          ],
        },

        startDate: {
          $lt: dropoffDate,
        },

        endDate: {
          $gt: pickupDate,
        },
      });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        error:
          'This car is already booked for the selected dates.',
      });
    }

    // ========================================================
    // DRIVER
    // ========================================================

    const driverRequired =
      parseBoolean(withDriver);

    // ========================================================
    // CLEAN LOCATIONS
    // ========================================================

    const cleanPickupLocation =
      String(pickupLocation).trim();

    const cleanDropoffLocation =
      String(dropoffLocation).trim();

    if (!cleanPickupLocation) {
      return res.status(400).json({
        success: false,
        error:
          'Pickup location cannot be empty.',
      });
    }

    if (!cleanDropoffLocation) {
      return res.status(400).json({
        success: false,
        error:
          'Dropoff location cannot be empty.',
      });
    }

    // ========================================================
    // CREATE BOOKING
    // ========================================================

    const booking =
      await Booking.create({
        user: userId,

        car,

        startDate: pickupDate,

        endDate: dropoffDate,

        withDriver:
          driverRequired,

        pickupLocation:
          cleanPickupLocation,

        dropoffLocation:
          cleanDropoffLocation,

        baseAmount:
          rentalAmount,

        gstPercentage:
          GST_RATE,

        gstAmount:
          gstAmount,

        totalAmount:
          grandTotal,

        paymentStatus:
          'pending',

        paymentMethod:
          'razorpay',

        status:
          'pending',

        confirmationSent:
          false,

        emailSent:
          false,

        smsSent:
          false,

        whatsappSent:
          false,
      });

    console.log(
      '✅ BOOKING CREATED:',
      booking._id.toString()
    );

    // ========================================================
    // USER DETAILS
    // ========================================================

    const userName =
      userInfo.name ||
      'Customer';

    const userEmail =
      userInfo.email ||
      null;

    const userPhone =
      userInfo.phone ||
      null;

    // ========================================================
    // CAR DETAILS
    // ========================================================

    const carName =
      carInfo.name ||
      carInfo.carName ||
      'Car';

    const driverText =
      driverRequired
        ? 'Yes'
        : 'No';

    // ========================================================
    // EMAIL
    // ========================================================

    let emailSent = false;

    if (userEmail) {
      try {
        console.log(
          '📧 Preparing email...'
        );

        // ----------------------------------------------------
        // EMAIL HTML
        // ----------------------------------------------------

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
                    
                    <!-- Header -->
                    <tr>
                      <td align="center" style="background-color: #2c3e50; padding: 30px 20px;">
                        <img src="${logoImageUrl}" alt="Car Rental Logo" width="80" height="80" style="display: block; border-radius: 50%; border: 3px solid #ffffff;">
                        <h1 style="margin: 15px 0 0; color: #ffffff; font-size: 26px; font-weight: bold;">Booking Confirmed!</h1>
                        <p style="margin: 5px 0 0; color: #bdc3c7; font-size: 15px;">Your journey is just around the corner.</p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 35px 30px;">
                        <p style="font-size: 18px; color: #2c3e50; margin: 0 0 20px;">Hello <strong>${userName}</strong>,</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #555; margin: 0 0 25px;">
                          Thank you for choosing our service! We're excited to confirm your car rental booking. Below are the details of your reservation.
                        </p>

                        <!-- View Booking Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="padding: 10px 0 30px;">
                              <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}" target="_blank" style="background-color: #3498db; color: #ffffff; padding: 14px 25px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
                                View Your Booking
                              </a>
                            </td>
                          </tr>
                        </table>

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
                              <p style="margin: 5px 0 0; color: #2c3e50; font-size: 16px; font-weight: bold;">${carName}</p>
                            </td>
                          </tr>
                        </table>

                        <!-- Date & Location Details -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 25px;">
                          <tr>
                            <td width="50%" valign="top" style="padding-right: 10px;">
                              <h3 style="font-size: 16px; color: #34495e; margin: 0 0 10px;">Pickup</h3>
                              <p style="margin: 0; font-size: 15px; color: #555;">${pickupDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              <p style="margin: 5px 0 0; font-size: 14px; color: #7f8c8d;">${cleanPickupLocation}</p>
                            </td>
                            <td width="50%" valign="top" style="padding-left: 10px; border-left: 2px solid #ecf0f1;">
                              <h3 style="font-size: 16px; color: #34495e; margin: 0 0 10px;">Drop-off</h3>
                              <p style="margin: 0; font-size: 15px; color: #555;">${dropoffDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              <p style="margin: 5px 0 0; font-size: 14px; color: #7f8c8d;">${cleanDropoffLocation}</p>
                            </td>
                          </tr>
                        </table>

                        <!-- Payment Summary -->
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

                        <!-- Status -->
                        <div style="margin-top: 30px; padding: 15px; background-color: #fdf8e1; border: 1px solid #fce8a3; border-radius: 8px; text-align: center;">
                          <p style="margin: 0; font-size: 15px; color: #8a6d3b;">Payment Status: <strong style="color: #c09853;">Pending</strong></p>
                        </div>

                        <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #7f8c8d; text-align: center;">
                          If you have any questions, feel free to contact our support team. We're here to help 24/7.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td align="center" style="background-color: #ecf0f1; padding: 25px 20px;">
                        <p style="margin: 0; color: #7f8c8d; font-size: 13px;">© ${new Date().getFullYear()} Car Rental Software. All Rights Reserved.</p>
                        <p style="margin: 5px 0 0; color: #95a5a6; font-size: 12px;">
                          123 Rental Street, Car City, India
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
`;

        // ----------------------------------------------------
        // SEND EMAIL
        // ----------------------------------------------------

        await transporter.sendMail({
          from:
            `"Car Rental Support" <${process.env.SMTP_SENDER_EMAIL}>`,

          to:
            userEmail,

          subject:
            '🚗 Car Rental Booking Confirmation',

          html:
            htmlTemplate,
        });

        emailSent = true;

        console.log(
          '✅ EMAIL SENT:',
          userEmail
        );

      } catch (emailError) {
        console.error(
          '❌ EMAIL FAILED:',
          emailError
        );
      }

    } else {

      console.log(
        '⚠️ User email not available.'
      );

    }

    // ========================================================
    // SMS - FAST2SMS
    // ========================================================

    let smsSent = false;

    if (
      userPhone &&
      process.env.FAST2SMS_API_KEY
    ) {

      try {

        const cleanPhoneNumber =
          String(userPhone)
            .replace(/\D/g, '')
            .slice(-10);

        if (
          cleanPhoneNumber.length === 10
        ) {

          const smsMessage =
            `Dear ${userName}, your Car Rental booking ` +
            `has been created. Booking ID: ${booking._id}. ` +
            `Total: Rs.${grandTotal}. Thank you!`;

          await axios.post(
            'https://www.fast2sms.com/dev/bulkV2',

            {
              route: 'q',

              message:
                smsMessage,

              language:
                'english',

              flash:
                0,

              numbers:
                cleanPhoneNumber,
            },

            {
              headers: {
                authorization:
                  process.env.FAST2SMS_API_KEY,

                'Content-Type':
                  'application/json',
              },
            }
          );

          smsSent = true;

          console.log(
            '✅ SMS SENT:',
            cleanPhoneNumber
          );

        } else {

          console.log(
            '⚠️ Invalid phone number for SMS.'
          );

        }

      } catch (smsError) {

        console.error(
          '❌ SMS FAILED:',
          smsError.response?.data ||
          smsError.message
        );

      }

    } else {

      console.log(
        '⚠️ FAST2SMS API key or phone number missing.'
      );

    }

    // ========================================================
    // WHATSAPP - ULTRAMSG
    // ========================================================

    let whatsappSent = false;

    const whatsappInstanceId =
      process.env.WHATSAPP_INSTANCE_ID ||
      process.env.ULTRAMSG_INSTANCE_ID;

    const whatsappToken =
      process.env.WHATSAPP_TOKEN ||
      process.env.ULTRAMSG_TOKEN;

    if (
      userPhone &&
      whatsappInstanceId &&
      whatsappToken
    ) {

      try {

        let whatsappNumber =
          String(userPhone)
            .replace(/\D/g, '');

        // Indian 10 digit number
        if (
          whatsappNumber.length === 10
        ) {
          whatsappNumber =
            `91${whatsappNumber}`;
        }

        // Already has India country code
        if (
          whatsappNumber.length === 12 &&
          whatsappNumber.startsWith('91')
        ) {
          // Keep as it is
        }

        if (
          whatsappNumber.length < 12
        ) {

          console.log(
            '⚠️ Invalid WhatsApp number.'
          );

        } else {

          const whatsappMessage = `
🚗 *CAR RENTAL BOOKING*

Hello *${userName}* 👋

Your booking has been created successfully.

📋 *BOOKING DETAILS*

• Booking ID: ${booking._id}
• Car: ${carName}
• Pickup Date: ${pickupDate.toLocaleDateString('en-IN')}
• Dropoff Date: ${dropoffDate.toLocaleDateString('en-IN')}
• Pickup: ${cleanPickupLocation}
• Dropoff: ${cleanDropoffLocation}
• Driver: ${driverText}

💰 *PAYMENT SUMMARY*

• Rental Amount: ${formatCurrency(rentalAmount)}
• GST (${GST_RATE}%): ${formatCurrency(gstAmount)}
• *Grand Total: ${formatCurrency(grandTotal)}*

💳 Payment Status: Pending

Thank you for choosing Car Rental Software.

Best Regards,
*Car Rental Team*
`.trim();

          const whatsappUrl =
            `https://api.ultramsg.com/${whatsappInstanceId}/messages/chat`;

          const response =
            await axios.post(
              whatsappUrl,

              {
                token:
                  whatsappToken,

                to:
                  whatsappNumber,

                body:
                  whatsappMessage,
              },

              {
                headers: {
                  'Content-Type':
                    'application/json',
                },
              }
            );

          if (
            response.data &&
            (
              response.data.sent ||
              response.data.id
            )
          ) {

            whatsappSent = true;

            console.log(
              '✅ WHATSAPP SENT:',
              whatsappNumber
            );

          } else {

            console.error(
              '❌ WHATSAPP RESPONSE:',
              response.data
            );

          }
        }

      } catch (whatsappError) {

        console.error(
          '❌ WHATSAPP FAILED:',
          whatsappError.response?.data ||
          whatsappError.message
        );

      }

    } else {

      console.log(
        '⚠️ WhatsApp credentials or phone number missing.'
      );

    }

    // ========================================================
    // UPDATE NOTIFICATION STATUS
    // ========================================================

    booking.emailSent =
      emailSent;

    booking.smsSent =
      smsSent;

    booking.whatsappSent =
      whatsappSent;

    booking.confirmationSent =
      emailSent ||
      smsSent ||
      whatsappSent;

    await booking.save();

    // ========================================================
    // FINAL RESPONSE
    // ========================================================

    return res.status(201).json({

      success:
        true,

      message:
        'Booking created successfully.',

      bookingId:
        booking._id,

      payment: {

        rentalAmount:
          rentalAmount,

        gstRate:
          GST_RATE,

        gstAmount:
          gstAmount,

        grandTotal:
          grandTotal,

        paymentStatus:
          booking.paymentStatus,

      },

      notifications: {

        emailSent:
          emailSent,

        smsSent:
          smsSent,

        whatsappSent:
          whatsappSent,

      },

      data:
        booking,

    });

  } catch (error) {

    console.error(
      '❌ CREATE BOOKING ERROR:',
      error.message
    );

    return res.status(500).json({

      success:
        false,

      error:
        error.message,

    });

  }
};

// ============================================================
// GET ALL BOOKINGS
// ============================================================

exports.getBookings = async (
  req,
  res
) => {

  try {

    const bookings =
      await Booking.find()

        .populate('car')

        .populate(
          'user',
          'name email phone'
        )

        .sort({
          createdAt: -1,
        });

    return res.status(200).json({

      success:
        true,

      count:
        bookings.length,

      data:
        bookings,

    });

  } catch (error) {

    console.error(
      '❌ GET BOOKINGS ERROR:',
      error
    );

    return res.status(500).json({

      success:
        false,

      error:
        error.message,

    });

  }
};

// ============================================================
// GET BOOKING BY ID
// ============================================================

exports.getBookingById = async (
  req,
  res
) => {

  try {

    const bookingId =
      req.params.id;

    if (
      !isValidObjectId(
        bookingId
      )
    ) {

      return res.status(400).json({

        success:
          false,

        error:
          'Invalid booking ID.',

      });

    }

    const booking =
      await Booking.findById(
        bookingId
      )

        .populate('car')

        .populate(
          'user',
          'name email phone'
        );

    if (!booking) {

      return res.status(404).json({

        success:
          false,

        error:
          'Booking not found.',

      });

    }

    return res.status(200).json({

      success:
        true,

      data:
        booking,

    });

  } catch (error) {

    console.error(
      '❌ GET BOOKING BY ID ERROR:',
      error
    );

    return res.status(500).json({

      success:
        false,

      error:
        error.message,

    });

  }
};

// ============================================================
// CANCEL BOOKING
// ============================================================

exports.cancelBooking = async (
  req,
  res
) => {

  try {

    const bookingId =
      req.params.id;

    // ========================================================
    // ID VALIDATION
    // ========================================================

    if (
      !isValidObjectId(
        bookingId
      )
    ) {

      return res.status(400).json({

        success:
          false,

        error:
          'Invalid booking ID.',

      });

    }

    // ========================================================
    // FIND BOOKING
    // ========================================================

    const booking =
      await Booking.findById(
        bookingId
      );

    if (!booking) {

      return res.status(404).json({

        success:
          false,

        error:
          'Booking not found.',

      });

    }

    // ========================================================
    // ALREADY CANCELLED
    // ========================================================

    if (
      booking.status ===
      'cancelled'
    ) {

      return res.status(400).json({

        success:
          false,

        error:
          'Booking is already cancelled.',

      });

    }

    // ========================================================
    // COMPLETED BOOKING
    // ========================================================

    if (
      booking.status ===
      'completed'
    ) {

      return res.status(400).json({

        success:
          false,

        error:
          'Completed booking cannot be cancelled.',

      });

    }

    // ========================================================
    // CANCEL
    // ========================================================

    booking.status =
      'cancelled';

    await booking.save();

    console.log(
      '✅ BOOKING CANCELLED:',
      booking._id
    );

    return res.status(200).json({

      success:
        true,

      message:
        'Booking cancelled successfully.',

      data:
        booking,

    });

  } catch (error) {

    console.error(
      '❌ CANCEL BOOKING ERROR:',
      error
    );

    return res.status(500).json({

      success:
        false,

      error:
        error.message,

    });

  }
};