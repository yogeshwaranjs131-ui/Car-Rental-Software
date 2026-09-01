const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Payment = require('../models/Payment');

// Create Booking Service
const createBookingService = async (userId, bookingData) => {
  const { car, startDate, endDate, totalPrice } = bookingData;

  // Verify car exists
  const carExists = await Car.findById(car);
  if (!carExists) {
    throw new Error('Car not found!');
  }

  // Check for conflicting bookings on the same car
  const conflictingBooking = await Booking.findOne({
    car,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  });

  if (conflictingBooking) {
    throw new Error('The car is already booked for the selected dates!');
  }

  // Create booking
  const booking = await Booking.create({
    user: userId,
    car,
    startDate,
    endDate,
    totalPrice,
    status: 'pending'
  });

  // Populate car and user details
  await booking.populate([
    { path: 'car', select: 'name brand pricePerDay image' },
    { path: 'user', select: 'name email phone' }
  ]);

  return booking;
};

// Get All Bookings Service (with filters)
const getAllBookingsService = async (queryFilters = {}) => {
  const { user, status, car } = queryFilters;
  let filter = {};

  if (user) filter.user = user;
  if (status) filter.status = status;
  if (car) filter.car = car;

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone')
    .populate({
      path: 'car',
      populate: [
        { path: 'brand', select: 'name logo' },
        { path: 'location', select: 'name city' }
      ]
    });

  return bookings;
};

// Get Single Booking by ID Service
const getBookingByIdService = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate('user', 'name email phone')
    .populate({
      path: 'car',
      populate: [
        { path: 'brand', select: 'name logo' },
        { path: 'location', select: 'name city' }
      ]
    });

  if (!booking) {
    throw new Error('Booking not found!');
  }

  return booking;
};

// Update Booking Status Service
const updateBookingStatusService = async (bookingId, status) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true, runValidators: true }
  )
    .populate('user', 'name email phone')
    .populate('car', 'name brand pricePerDay');

  if (!booking) {
    throw new Error('Booking not found!');
  }

  return booking;
};

// Cancel Booking Service
const cancelBookingService = async (bookingId, userId, userRole) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found!');
  }

  // Check if user is authorized to cancel (owner or admin)
  if (booking.user.toString() !== userId.toString() && userRole !== 'admin') {
    throw new Error('Not authorized to cancel this booking!');
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled!');
  }

  if (booking.status === 'completed') {
    throw new Error('Completed bookings cannot be cancelled!');
  }

  booking.status = 'cancelled';
  await booking.save();

  return booking;
};

// Delete Booking Service
const deleteBookingService = async (bookingId) => {
  const booking = await Booking.findByIdAndDelete(bookingId);
  if (!booking) {
    throw new Error('Booking not found!');
  }
  return booking;
};

module.exports = {
  createBookingService,
  getAllBookingsService,
  getBookingByIdService,
  updateBookingStatusService,
  cancelBookingService,
  deleteBookingService
};