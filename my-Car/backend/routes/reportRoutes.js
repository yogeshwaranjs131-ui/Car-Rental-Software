const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Car = require('../models/Car');

// @route   GET /api/reports/summary
// @desc    Get detailed business reports and financial summaries
// @access  Private/Admin
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter if provided
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Fetch payments based on date range for revenue calculation
    const payments = await Payment.find({
      status: 'completed',
      ...dateFilter
    });

    const totalRevenue = payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

    // Get booking status breakdown
    const totalBookings = await Booking.countDocuments(dateFilter);
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed', ...dateFilter });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled', ...dateFilter });
    const pendingBookings = await Booking.countDocuments({ status: 'pending', ...dateFilter });

    // Get total active users and cars count
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCars = await Car.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Report summary generated successfully!',
      data: {
        financials: {
          totalRevenue,
          totalCompletedTransactions: payments.length
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          pending: pendingBookings
        },
        platform: {
          totalUsers,
          totalCars
        }
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

// @route   GET /api/reports/revenue-analytics
// @desc    Get revenue metrics grouped by payment methods
// @access  Private/Admin
router.get('/revenue-analytics', async (req, res) => {
  try {
    const revenueByMethod = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Revenue analytics fetched successfully!',
      data: revenueByMethod
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