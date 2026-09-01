const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Car = require('../models/Car');

// 1. Generate Overall System Report
const getSystemReport = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalCars = await Car.countDocuments();

    const payments = await Payment.find();
    const totalRevenue = payments.reduce((acc, item) => acc + (item.amount || 0), 0);

    res.status(200).json({
      success: true,
      report: {
        totalBookings,
        totalPayments,
        totalCars,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getSystemReport
};