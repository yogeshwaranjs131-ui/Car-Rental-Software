const express = require('express');
const router = express.Router();
const {
    createCoupon,
    validateCoupon,
    getAllCoupons,
    deleteCoupon
} = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware'); // Protect routes if needed
const adminMiddleware = require('../middleware/adminMiddleware'); // Admin access for create/delete


// @route   GET /api/coupons
// @desc    Get all coupons
// @access  Admin
router.get('/', authMiddleware, adminMiddleware, getAllCoupons);

// @route   POST /api/coupons
// @desc    Create a new coupon
// @access  Admin
router.post('/', authMiddleware, adminMiddleware, createCoupon);

// @route   POST /api/coupons/apply
// @desc    Validate and apply a coupon code
// @access  Private
router.post('/apply', authMiddleware, validateCoupon);

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon
// @access  Admin
router.delete('/:couponId', authMiddleware, adminMiddleware, deleteCoupon);

module.exports = router;