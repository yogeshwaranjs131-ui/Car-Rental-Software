const express = require('express');
const router = express.Router();
const Location = require('../models/location');
const validateMiddleware = require('../middleware/validateMiddleware');
const { body } = require('express-validator');

// Location Validation Rules
const locationValidation = [
  body('name').trim().notEmpty().withMessage('Location name is required!'),
  body('city').trim().notEmpty().withMessage('City is required!'),
  body('state').trim().notEmpty().withMessage('State is required!'),
  body('address').trim().notEmpty().withMessage('Address is required!'),
  body('pincode').trim().notEmpty().withMessage('Pincode is required!')
];

// @route   GET /api/locations
// @desc    Get all locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, isActive } = req.query;
    let filter = {};

    if (city) filter.city = { $regex: city, $options: 'i' };
    if (isActive !== undefined) filter.isActive = isActive;

    const locations = await Location.find(filter);

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   GET /api/locations/:id
// @desc    Get single location by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found!'
      });
    }

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/locations
// @desc    Create a new location
// @access  Private/Admin
router.post('/', locationValidation, validateMiddleware, async (req, res) => {
  try {
    const { name, city, state, address, pincode, isActive } = req.body;

    // Check if location name already exists
    const existingLocation = await Location.findOne({ name: name.trim() });
    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'Location with this name already exists!'
      });
    }

    const newLocation = new Location({
      name,
      city,
      state,
      address,
      pincode,
      isActive
    });

    await newLocation.save();

    res.status(201).json({
      success: true,
      message: 'Location created successfully!',
      data: newLocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   PUT /api/locations/:id
// @desc    Update location details
// @access  Private/Admin
router.put('/:id', locationValidation, validateMiddleware, async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({
        success: false,
        message: 'Location not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated successfully!',
      data: updatedLocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   DELETE /api/locations/:id
// @desc    Delete a location
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location deleted successfully!'
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