/**
 * Car Validators using express-validator
 */

const { body, param } = require('express-validator');

// Validation rules for adding or updating a car
const validateCar = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Car name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Car name must be between 2 and 50 characters'),

  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand name is required'),

  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),

  body('year')
    .notEmpty()
    .withMessage('Manufacturing year is required')
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid manufacturing year'),

  body('pricePerDay')
    .notEmpty()
    .withMessage('Price per day is required')
    .isNumeric()
    .withMessage('Price per day must be a number')
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error('Price per day must be greater than zero');
      }
      return true;
    }),

  body('seatingCapacity')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Seating capacity must be between 1 and 20'),

  body('fuelType')
    .optional()
    .isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid'])
    .withMessage('Invalid fuel type'),

  body('transmission')
    .optional()
    .isIn(['Manual', 'Automatic'])
    .withMessage('Invalid transmission type')
];

// Validation rules for checking car ID parameter
const validateCarId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Car ID format')
];

module.exports = {
  validateCar,
  validateCarId
};