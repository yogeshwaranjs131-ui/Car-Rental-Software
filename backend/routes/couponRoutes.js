const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');
const validateMiddleware = require('../middleware/validateMiddleware');
const { body } = require('express-validator');

// Coupon Validation Rules
const couponValidation = [
  body('code').trim().notEmpty().withMessage('Coupon code is required!'),
  body('discountPercentage').isNumeric().withMessage('Discount percentage must be a number!'),
  body('expiryDate').isISO8601().toDate().withMessage('Valid expiry date is required!')
];

// @route   GET /api/coupons
// @desc    Get all coupons
// @access  Public/Admin
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/coupons
// @desc    Create a new coupon
// @access  Private/Admin
router.post('/', couponValidation, validateMiddleware, async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate, isActive } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists!'
      });
    }

    const newCoupon = new Coupon({
      code,
      discountPercentage,
      expiryDate,
      isActive
    });

    await newCoupon.save();

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully!',
      data: newCoupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/coupons/apply
// @desc    Validate and apply a coupon code
// @access  Private
router.post('/apply', [
  body('code').trim().notEmpty().withMessage('Coupon code is required!')
], validateMiddleware, async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code!'
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is inactive!'
      });
    }

    // Check if expired
    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully!',
      data: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;