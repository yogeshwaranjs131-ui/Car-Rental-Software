const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Contact = require('../models/contact');

// @route   GET /api/dashboard/stats
// @desc    Get admin dashboard statistics and summary counts
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    // Fetch counts and metrics in parallel for optimal performance
    const [
      totalUsers,
      totalCars,
      totalBookings,
      pendingBookings,
      totalContacts,
      payments
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Car.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Contact.countDocuments(),
      Payment.find({ status: 'completed' })
    ]);

    // Calculate total revenue from completed payments
    const totalRevenue = payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

    // Fetch recent bookings (last 5)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('car', 'name pricePerDay');

    // Fetch recent users (last 5)
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics fetched successfully!',
      data: {
        counts: {
          users: totalUsers,
          cars: totalCars,
          bookings: totalBookings,
          pendingBookings,
          contacts: totalContacts,
          revenue: totalRevenue
        },
        recentBookings,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;