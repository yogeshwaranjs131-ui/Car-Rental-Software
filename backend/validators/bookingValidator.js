/**
 * Booking Validators using express-validator
 */

const { body, param } = require('express-validator');

// Validation rules for creating a new booking
const validateCreateBooking = [
  body('carId')
    .notEmpty()
    .withMessage('Car ID is required')
    .isMongoId()
    .withMessage('Invalid Car ID format'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (endDate < startDate) {
        throw new Error('End date must be greater than or equal to start date');
      }
      return true;
    }),

  body('pickupLocation')
    .trim()
    .notEmpty()
    .withMessage('Pickup location is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Pickup location must be between 3 and 100 characters')
];

// Validation rules for updating booking status
const validateBookingStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Booking ID format'),

  body('status')
    .notEmpty()
    .withMessage('Booking status is required')
    .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Invalid booking status value')
];

module.exports = {
  validateCreateBooking,
  validateBookingStatus
};