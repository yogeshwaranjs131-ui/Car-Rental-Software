const User = require('../models/User');
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// 1. Get Dashboard Statistics
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Calculate total revenue
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCars,
        totalBookings,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Get All Users List
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Delete a User
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser
};