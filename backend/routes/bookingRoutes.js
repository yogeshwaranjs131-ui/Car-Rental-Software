const express = require('express');

const {
    createBooking,
    getBookings,
    getBookingById,
    cancelBooking,
    deleteBookingPermanently, // புதிய கன்ட்ரோலர் ஃபங்ஷனை இறக்குமதி செய்யவும்
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
// GET BOOKING BY ID & DELETE BOOKING PERMANENTLY
// GET /api/bookings/:id
// DELETE /api/bookings/:id (பெர்மனன்ட் டெலிட் செய்ய)
// ============================================================

router
    .route('/:id')
    .get(getBookingById)
    .delete(deleteBookingPermanently); // 🗑️ பெர்மனன்ட் டெலிட் ரூட் சேர்க்கப்பட்டுள்ளது

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