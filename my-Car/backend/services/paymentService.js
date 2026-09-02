const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Create Payment Service
const createPaymentService = async (userId, paymentData) => {
  const { booking, amount, paymentMethod, transactionId } = paymentData;

  // Verify booking exists
  const bookingExists = await Booking.findById(booking);
  if (!bookingExists) {
    throw new Error('Booking not found!');
  }

  // Check if payment already exists for this booking
  const existingPayment = await Payment.findOne({ booking });
  if (existingPayment && existingPayment.status === 'completed') {
    throw new Error('Payment for this booking has already been completed!');
  }

  const payment = await Payment.create({
    booking,
    user: userId,
    amount,
    paymentMethod,
    transactionId: transactionId || `TXN-${Date.now()}`,
    status: 'completed'
  });

  // Update booking status to confirmed upon successful payment
  bookingExists.status = 'confirmed';
  await bookingExists.save();

  await payment.populate([
    { path: 'booking', select: 'startDate endDate totalPrice status' },
    { path: 'user', select: 'name email phone' }
  ]);

  return payment;
};

// Get All Payments Service (Admin or User specific)
const getAllPaymentsService = async (queryFilters = {}) => {
  const { user, status } = queryFilters;
  let filter = {};

  if (user) filter.user = user;
  if (status) filter.status = status;

  const payments = await Payment.find(filter)
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate({
      path: 'booking',
      select: 'startDate endDate totalPrice status',
      populate: { path: 'car', select: 'name brand' }
    });

  return payments;
};

// Get Single Payment by ID Service
const getPaymentByIdService = async (paymentId) => {
  const payment = await Payment.findById(paymentId)
    .populate('user', 'name email')
    .populate({
      path: 'booking',
      select: 'startDate endDate totalPrice status',
      populate: { path: 'car', select: 'name brand image' }
    });

  if (!payment) {
    throw new Error('Payment not found!');
  }

  return payment;
};

module.exports = {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService
};