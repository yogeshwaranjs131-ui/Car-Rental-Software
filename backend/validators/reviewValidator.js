/**
 * Review Validators using express-validator
 */

const { body, param } = require('express-validator');

// Validation rules for adding or updating a review
const validateReview = [
  body('carId')
    .notEmpty()
    .withMessage('Car ID is required')
    .isMongoId()
    .withMessage('Invalid Car ID format'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// Validation rules for checking review ID parameter
const validateReviewId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Review ID format')
];

module.exports = {
  validateReview,
  validateReviewId
};