const express = require('express');
const router = express.Router();
const {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', authMiddleware, getWishlist);

// @route   POST /api/wishlist
// @desc    Add a car to the wishlist
// @access  Private
router.post('/', authMiddleware, addToWishlist);

// @route   DELETE /api/wishlist/:id
// @desc    Remove a car from the wishlist
// @access  Private
router.delete('/:id', authMiddleware, removeFromWishlist);

module.exports = router;