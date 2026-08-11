const express = require('express');
const { 
  createBooking, 
  getBookings, 
  getBookingById, 
  cancelBooking // 1. cancelBooking-ஐ இங்கே இறக்குமதி செய்யவும்
} = require('../controllers/bookingController.js');

const router = express.Router();

// Route to get all bookings (GET /api/bookings) & create booking (POST /api/bookings)
router.route('/')
  .get(getBookings)
  .post(createBooking);

// Route to get a specific booking by ID (GET /api/bookings/:id)
router.route('/:id')
  .get(getBookingById);

// 2. Cancel a booking route (PUT /api/bookings/:id/cancel) - இதை கண்டிப்பாக சேர்க்கவும்!
router.route('/:id/cancel')
  .put(cancelBooking);

module.exports = router;