const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// Get overall dashboard overview metrics
const getDashboardOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCars,
        totalBookings,
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getDashboardOverview
};