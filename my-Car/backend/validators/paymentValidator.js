/**
 * Payment Validators using express-validator
 */

const { body, param } = require('express-validator');

// Validation rules for creating a payment order or initiating payment
const validatePayment = [
  body('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .withMessage('Invalid Booking ID format'),

  body('amount')
    .notEmpty()
    .withMessage('Payment amount is required')
    .isNumeric()
    .withMessage('Amount must be a valid number')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Payment amount must be greater than zero');
      }
      return true;
    }),

  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash', 'Stripe', 'Razorpay'])
    .withMessage('Invalid payment method')
];

// Validation rules for verifying a payment (e.g., Razorpay/Stripe webhook or verification)
const validatePaymentVerification = [
  body('razorpayOrderId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Razorpay Order ID is required'),

  body('razorpayPaymentId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Razorpay Payment ID is required'),

  body('razorpaySignature')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Razorpay Signature is required'),

  body('transactionId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Transaction ID is required')
];

// Validation rules for payment ID parameter
const validatePaymentId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Payment ID format')
];

module.exports = {
  validatePayment,
  validatePaymentVerification,
  validatePaymentId
};