/**
 * User Validators using express-validator
 */

const { body, param } = require('express-validator');

// Validation rules for updating user profile
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

// Validation rules for updating user password
const validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Validation rules for user ID parameter
const validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid User ID format')
];

module.exports = {
  validateUpdateProfile,
  validateUpdatePassword,
  validateUserId
};