const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required!'],
    unique: true,
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  countryOfOrigin: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;