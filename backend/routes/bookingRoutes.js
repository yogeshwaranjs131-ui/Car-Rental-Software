const express = require('express');

const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');

const router = express.Router();

// ============================================================
// GET ALL BOOKINGS
// POST CREATE BOOKING
// ============================================================

router
  .route('/')
  .get(getBookings)
  .post(createBooking);

// ============================================================
// GET BOOKING BY ID
// GET /api/bookings/:id
// ============================================================

router
  .route('/:id')
  .get(getBookingById);

// ============================================================
// CANCEL BOOKING
// PUT /api/bookings/:id/cancel
// ============================================================

router
  .route('/:id/cancel')
  .put(cancelBooking);

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;