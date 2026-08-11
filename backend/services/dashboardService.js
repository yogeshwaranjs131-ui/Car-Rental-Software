const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Admin Dashboard Analytics Service
const getAdminDashboardStatsService = async () => {
  try {
    // Total Counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Calculate Total Revenue from completed payments
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

    // Booking Status Breakdown
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Recent Bookings (Last 5)
    const recentBookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('car', 'name brand pricePerDay');

    // Recent Users (Last 5)
    const recentUsers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      counts: {
        users: totalUsers,
        cars: totalCars,
        bookings: totalBookings,
        revenue: totalRevenue
      },
      bookingStatus: {
        confirmed: confirmedBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings
      },
      recent: {
        bookings: recentBookings,
        users: recentUsers
      }
    };
  } catch (error) {
    throw new Error(`Error fetching dashboard stats: ${error.message}`);
  }
};

module.exports = {
  getAdminDashboardStatsService
};