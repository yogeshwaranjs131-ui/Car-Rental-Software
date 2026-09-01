/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (e.g., 200, 201)
 * @param {String} message - Success message
 * @param {Object|Array} data - Payload data to send
 */
const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (e.g., 400, 401, 404, 500)
 * @param {String} message - Error message
 * @param {Object|Array} errors - Detailed errors (optional)
 */
const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
  sendError
};