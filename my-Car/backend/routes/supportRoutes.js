const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const validateMiddleware = require('../middleware/validateMiddleware');
const { body, param } = require('express-validator');

// Support / Contact Validation Rules
const supportValidation = [
  body('name').trim().notEmpty().withMessage('Name is required!'),
  body('email').isEmail().withMessage('Please provide a valid email address!'),
  body('subject').trim().notEmpty().withMessage('Subject is required!'),
  body('message').trim().notEmpty().withMessage('Message is required!')
];

// @route   GET /api/support
// @desc    Get all support/contact inquiries
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) filter.status = status;

    const inquiries = await Contact.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   GET /api/support/:id
// @desc    Get single support inquiry by ID
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await Contact.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Support inquiry not found!'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/support
// @desc    Submit a new support/contact message
// @access  Public
router.post('/', supportValidation, validateMiddleware, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newInquiry = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      status: 'pending'
    });

    await newInquiry.save();

    res.status(201).json({
      success: true,
      message: 'Support inquiry submitted successfully!',
      data: newInquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   PATCH /api/support/:id/status
// @desc    Update support inquiry status (e.g., pending, resolved)
// @access  Private/Admin
router.patch('/:id/status', [
  body('status').isIn(['pending', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status value!')
], validateMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const inquiry = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Support inquiry not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Support inquiry status updated successfully!',
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   DELETE /api/support/:id
// @desc    Delete a support inquiry
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const inquiry = await Contact.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Support inquiry not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Support inquiry deleted successfully!'
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