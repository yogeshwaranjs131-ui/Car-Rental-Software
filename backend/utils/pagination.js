/**
 * Pagination Utility Function
 * @param {Number} page - Current page number from query params
 * @param {Number} limit - Number of items per page
 * @param {Number} total - Total count of documents in database
 * @returns {Object} - Pagination metadata and mongoose query options (skip & limit)
 */
const getPagination = (page = 1, limit = 10, total = 0) => {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const itemsPerPage = Math.max(parseInt(limit, 10) || 10, 1);
  
  const skip = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(total / itemsPerPage) || 1;

  return {
    skip,
    limit: itemsPerPage,
    pagination: {
      currentPage,
      itemsPerPage,
      totalItems: total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    }
  };
};

module.exports = getPagination;