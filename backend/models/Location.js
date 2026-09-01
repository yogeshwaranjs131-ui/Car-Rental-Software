const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required!'],
    unique: true,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required!'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required!'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required!'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required!'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;