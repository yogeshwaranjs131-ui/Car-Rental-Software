const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Car = require('../models/Car');
const User = require('../models/User');

// Generate Financial Report Service
const generateFinancialReportService = async (startDate, endDate) => {
  let dateFilter = {};
  
  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const payments = await Payment.find({ status: 'completed', ...dateFilter })
    .populate('user', 'name email')
    .populate({
      path: 'booking',
      select: 'startDate endDate totalPrice',
      populate: { path: 'car', select: 'name brand' }
    });

  const totalRevenue = payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

  return {
    reportType: 'Financial Report',
    totalTransactions: payments.length,
    totalRevenue,
    dateRange: {
      startDate: startDate || 'All Time',
      endDate: endDate || 'Present'
    },
    data: payments
  };
};

// Generate Booking Activity Report Service
const generateBookingReportService = async (startDate, endDate) => {
  let dateFilter = {};

  if (startDate && endDate) {
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const bookings = await Booking.find(dateFilter)
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone')
    .populate({
      path: 'car',
      select: 'name brand pricePerDay location',
      populate: { path: 'location', select: 'name city' }
    });

  const statusCounts = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  return {
    reportType: 'Booking Activity Report',
    summary: statusCounts,
    dateRange: {
      startDate: startDate || 'All Time',
      endDate: endDate || 'Present'
    },
    data: bookings
  };
};

// Generate Car Fleet Status Report Service
const generateFleetReportService = async () => {
  const cars = await Car.find({})
    .populate('brand', 'name logo')
    .populate('category', 'name image')
    .populate('location', 'name city');

  const totalCars = cars.length;

  return {
    reportType: 'Car Fleet Status Report',
    totalCars,
    data: cars
  };
};

module.exports = {
  generateFinancialReportService,
  generateBookingReportService,
  generateFleetReportService
};