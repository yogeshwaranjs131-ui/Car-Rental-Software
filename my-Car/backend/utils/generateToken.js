const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for user authentication
 * @param {String|Object} userId - The user's ID or object containing ID
 * @returns {String} - Signed JWT token
 */
const generateToken = (userId) => {
  // Ensure we extract the string ID if an object/Mongoose document is passed
  const id = userId._id ? userId._id.toString() : userId.toString();

  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = generateToken;