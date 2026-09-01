const Payment = require('../models/Payment');
const Booking = require('../models/Booking'); 
const User = require('../models/User');       
const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');
// 👇 நோட்டிபிகேஷன் சர்வீஸை இங்கே இம்போர்ட் செய்யவும் (உங்கள் ஃபோல்டர் பாத் படி மாற்றிக்கொள்ளவும்)
const { sendPaymentSuccessNotifications } = require('../services/notificationService');

/**
 * @desc    Create a Razorpay Order
 * @route   POST /api/v1/payments/create-order
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, message: 'Booking ID and amount are required' });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_order_${bookingId}`
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
    }

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

/**
 * @desc    Verify a Razorpay Payment
 * @route   POST /api/v1/payments/verify-payment
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, userId, amount } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // --- Payment is authentic, proceed with database updates ---

      // 1. Update Booking Status to 'confirmed' & populate user and car details
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'confirmed' },
        { new: true }
      )
      .populate('user', 'name email phone')
      .populate('car', 'name brand pricePerDay');

      if (!updatedBooking) {
        return res.status(404).json({ success: false, message: 'Booking not found!' });
      }

      // 2. Create a new Payment record
      const newPayment = new Payment({
        booking: bookingId,
        user: userId,
        amount: amount / 100, // Convert from paise back to rupees
        paymentMethod: 'upi', 
        transactionId: razorpay_payment_id,
        status: 'completed'
      });
      await newPayment.save();

      // 🚀 3. SEND ALL NOTIFICATIONS (Email, SMS & WhatsApp) TO THE CUSTOMER
      try {
        console.log("⚡ Triggering notifications for payment success...");
        await sendPaymentSuccessNotifications(updatedBooking.user, updatedBooking, newPayment);
      } catch (notifError) {
        console.error("❌ Notification Error in payment verification:", notifError.message);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Payment verified, booking confirmed and notifications sent successfully!', 
        booking: updatedBooking 
      });
      
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature, payment verification failed' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, payments });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found!' });
    }

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getAllPayments,
  getPaymentById
};