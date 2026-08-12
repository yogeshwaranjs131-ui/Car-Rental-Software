const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Directly defining the schema inside routes to eliminate module not found errors!
const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required!']
  },
  cars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }]
}, {
  timestamps: true
});

const Wishlist = mongoose.models.FavWishlist || mongoose.model('FavWishlist', wishlistSchema);

const validateMiddleware = require('../middleware/validateMiddleware');
const { body } = require('express-validator');

// Wishlist Validation Rules
const wishlistValidation = [
  body('user').notEmpty().withMessage('User reference is required!'),
  body('car').notEmpty().withMessage('Car reference is required!')
];

// @route   GET /api/wishlist
router.get('/', async (req, res, next) => {
  try {
    const { user } = req.query;
    let filter = {};
    if (user) filter.user = user;

    const wishlistItems = await Wishlist.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate({
        path: 'cars',
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
router.post('/', wishlistValidation, validateMiddleware, async (req, res, next) => {
  try {
    const { user, car } = req.body;

    let wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      wishlist = new Wishlist({ user, cars: [car] });
    } else {
      if (wishlist.cars.includes(car)) {
        return res.status(400).json({
          success: false,
          message: 'This car is already in your wishlist!'
        });
      }
      wishlist.cars.push(car);
    }

    await wishlist.save();

    await wishlist.populate({
      path: 'cars',
      populate: [
        { path: 'brand', select: 'name logo' },
        { path: 'category', select: 'name image' },
        { path: 'location', select: 'name city' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Car added to wishlist successfully!',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/wishlist/:id
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

// @route   DELETE /api/wishlist/remove
router.delete('/remove', [
  body('user').notEmpty().withMessage('User reference is required!'),
  body('car').notEmpty().withMessage('Car reference is required!')
], validateMiddleware, async (req, res, next) => {
  try {
    const { user, car } = req.body;

    const wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found!'
      });
    }

    wishlist.cars = wishlist.cars.filter(c => c.toString() !== car);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Car removed from wishlist successfully!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;