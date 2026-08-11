const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required.'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required.'],
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required.'],
  },
  withDriver: {
    type: Boolean,
    default: false,
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required.'],
  },
  dropoffLocation: {
    type: String,
    required: [true, 'Drop-off location is required.'],
  },
  status: {
    type: String,
    // இங்கே பெரிய மற்றும் சிறிய எழுத்துகள் இரண்டையும் (أو கேபிடல்/ஸ்மால்) சேர்த்துக்கொள்ளலாம்:
    enum: ['pending', 'Pending', 'confirmed', 'Confirmed', 'cancelled', 'Cancelled', 'completed', 'Completed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);