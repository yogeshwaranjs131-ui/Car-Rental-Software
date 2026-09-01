const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking reference is required!']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required!']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required!']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required!'],
    enum: ['credit-card', 'debit-card', 'upi', 'net-banking', 'cash', 'wallet'],
    default: 'credit-card'
  },
  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required!'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;