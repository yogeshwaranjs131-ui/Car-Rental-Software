const express = require('express');
const router = express.Router();
const Insurance = require('../models/insurance');
const validateMiddleware = require('../middleware/validateMiddleware');
const { body, param } = require('express-validator');

// Insurance Validation Rules
const insuranceValidation = [
  body('booking').notEmpty().withMessage('Booking reference is required!'),
  body('policyNumber').trim().notEmpty().withMessage('Policy number is required!'),
  body('provider').trim().notEmpty().withMessage('Insurance provider is required!'),
  body('coverageType').optional().isIn(['basic', 'comprehensive', 'premium', 'third-party']).withMessage('Invalid coverage type!'),
  body('premiumAmount').isNumeric().withMessage('Premium amount must be a number!'),
  body('startDate').isISO8601().toDate().withMessage('Valid start date is required!'),
  body('endDate').isISO8601().toDate().withMessage('Valid end date is required!')
];

// @route   GET /api/insurance
// @desc    Get all insurance policies
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { status, provider } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (provider) filter.provider = { $regex: provider, $options: 'i' };

    const insurances = await Insurance.find(filter)
      .populate({
        path: 'booking',
        populate: [
          { path: 'user', select: 'name email phone' },
          { path: 'car', select: 'name brand' }
        ]
      });

    res.status(200).json({
      success: true,
      count: insurances.length,
      data: insurances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   GET /api/insurance/:id
// @desc    Get single insurance policy by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id)
      .populate({
        path: 'booking',
        populate: [
          { path: 'user', select: 'name email phone' },
          { path: 'car', select: 'name brand' }
        ]
      });

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance policy not found!'
      });
    }

    res.status(200).json({
      success: true,
      data: insurance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/insurance
// @desc    Create a new insurance policy
// @access  Private/Admin
router.post('/', insuranceValidation, validateMiddleware, async (req, res) => {
  try {
    const { booking, policyNumber, provider, coverageType, premiumAmount, startDate, endDate, status } = req.body;

    // Check if policy number already exists
    const existingPolicy = await Insurance.findOne({ policyNumber: policyNumber.trim() });
    if (existingPolicy) {
      return res.status(400).json({
        success: false,
        message: 'Insurance policy with this policy number already exists!'
      });
    }

    const newInsurance = new Insurance({
      booking,
      policyNumber,
      provider,
      coverageType,
      premiumAmount,
      startDate,
      endDate,
      status
    });

    await newInsurance.save();

    res.status(201).json({
      success: true,
      message: 'Insurance policy created successfully!',
      data: newInsurance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   PUT /api/insurance/:id
// @desc    Update insurance policy details
// @access  Private/Admin
router.put('/:id', insuranceValidation, validateMiddleware, async (req, res) => {
  try {
    const updatedInsurance = await Insurance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedInsurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance policy not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Insurance policy updated successfully!',
      data: updatedInsurance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   DELETE /api/insurance/:id
// @desc    Delete an insurance policy
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndDelete(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance policy not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Insurance policy deleted successfully!'
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