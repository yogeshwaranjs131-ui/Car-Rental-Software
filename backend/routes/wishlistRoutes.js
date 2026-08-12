const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const validateMiddleware = require('../middleware/validateMiddleware');
const { body } = require('express-validator');

// Wishlist Validation Rules
const wishlistValidation = [
  body('user').notEmpty().withMessage('User reference is required!'),
  body('car').notEmpty().withMessage('Car reference is required!')
];

// @route   GET /api/wishlist
// @desc    Get user wishlist items (filtered by user query)
router.get('/', async (req, res, next) => {
  try {
    const { user } = req.query;
    let filter = {};

    if (user) filter.user = user;

    const wishlistItems = await Wishlist.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate({
        path: 'car',
        populate: [
          { path: 'brand', select: 'name logo' },
          { path: 'category', select: 'name image' },
          { path: 'location', select: 'name city' }
        ]
      });

    res.status(200).json({
      success: true,
      count: wishlistItems.length,
      data: wishlistItems
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/wishlist
// @desc    Add a car to wishlist
router.post('/', wishlistValidation, validateMiddleware, async (req, res, next) => {
  try {
    const { user, car } = req.body;

    const existingWishlistItem = await Wishlist.findOne({ user, car });
    if (existingWishlistItem) {
      return res.status(400).json({
        success: false,
        message: 'This car is already in your wishlist!'
      });
    }

    const newWishlistItem = new Wishlist({ user, car });
    await newWishlistItem.save();

    await newWishlistItem.populate({
      path: 'car',
      populate: [
        { path: 'brand', select: 'name logo' },
        { path: 'category', select: 'name image' },
        { path: 'location', select: 'name city' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Car added to wishlist successfully!',
      data: newWishlistItem
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/wishlist/:id
// @desc    Remove an item from wishlist by wishlist ID
router.delete('/:id', async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.findByIdAndDelete(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car removed from wishlist successfully!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;