const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking reference is required!']
  },
  policyNumber: {
    type: String,
    required: [true, 'Policy number is required!'],
    unique: true,
    trim: true
  },
  provider: {
    type: String,
    required: [true, 'Insurance provider is required!'],
    trim: true
  },
  coverageType: {
    type: String,
    required: [true, 'Coverage type is required!'],
    enum: ['basic', 'comprehensive', 'premium', 'third-party'],
    default: 'comprehensive'
  },
  premiumAmount: {
    type: Number,
    required: [true, 'Premium amount is required!']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required!']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required!']
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'claimed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Insurance = mongoose.model('Insurance', insuranceSchema);

module.exports = Insurance;