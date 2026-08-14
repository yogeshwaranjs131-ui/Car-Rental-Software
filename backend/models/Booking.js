const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER
    // =====================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required.'],
    },

    // =====================================================
    // CAR
    // =====================================================

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car is required.'],
    },

    // =====================================================
    // BOOKING DATES
    // =====================================================

    startDate: {
      type: Date,
      required: [true, 'Start date is required.'],
    },

    endDate: {
      type: Date,
      required: [true, 'End date is required.'],
    },

    // =====================================================
    // DRIVER
    // =====================================================

    withDriver: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // LOCATIONS
    // =====================================================

    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required.'],
      trim: true,
    },

    dropoffLocation: {
      type: String,
      required: [true, 'Drop-off location is required.'],
      trim: true,
    },

    // =====================================================
    // AMOUNT
    // =====================================================

    // Original rental amount before GST
    baseAmount: {
      type: Number,
      required: [true, 'Base amount is required.'],
      default: 0,
      min: [0, 'Base amount cannot be negative.'],
    },

    // GST percentage
    gstPercentage: {
      type: Number,
      required: true,
      default: 18,
      min: [0, 'GST percentage cannot be negative.'],
    },

    // GST amount
    gstAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'GST amount cannot be negative.'],
    },

    // Final amount including GST
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required.'],
      min: [0, 'Total amount cannot be negative.'],
    },

    // =====================================================
    // PAYMENT
    // =====================================================

    paymentStatus: {
      type: String,
      enum: [
        'pending',
        'paid',
        'failed',
        'refunded',
      ],
      default: 'pending',
    },

    paymentMethod: {
      type: String,
      enum: [
        'razorpay',
        'stripe',
        'cash',
        'upi',
        'card',
        'other',
      ],
      default: 'razorpay',
    },

    paymentId: {
      type: String,
      default: null,
      trim: true,
    },

    orderId: {
      type: String,
      default: null,
      trim: true,
    },

    // =====================================================
    // BOOKING STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'cancelled',
        'completed',
      ],
      default: 'pending',
    },

    // =====================================================
    // NOTIFICATION STATUS
    // =====================================================

    confirmationSent: {
      type: Boolean,
      default: false,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    smsSent: {
      type: Boolean,
      default: false,
    },

    whatsappSent: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // NOTES
    // =====================================================

    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// DATE VALIDATION
// =====================================================

bookingSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate) {
    if (this.endDate < this.startDate) {
      return next(
        new Error('End date cannot be before start date.')
      );
    }
  }

  next();
});

// =====================================================
// GST CALCULATION
// =====================================================
// Controller-ல் baseAmount, gstPercentage, gstAmount,
// totalAmount already calculate செய்யப்பட்டாலும்,
// Model save செய்யும்போது consistency maintain செய்யும்.
// =====================================================

bookingSchema.pre('save', function (next) {
  if (
    this.isModified('baseAmount') ||
    this.isModified('gstPercentage') ||
    this.isNew
  ) {
    const baseAmount = Number(this.baseAmount) || 0;
    const gstPercentage = Number(this.gstPercentage) || 0;

    this.gstAmount = Number(
      ((baseAmount * gstPercentage) / 100).toFixed(2)
    );

    this.totalAmount = Number(
      (baseAmount + this.gstAmount).toFixed(2)
    );
  }

  next();
});

// =====================================================
// EXPORT MODEL
// =====================================================

module.exports = mongoose.model(
  'Booking',
  bookingSchema
);