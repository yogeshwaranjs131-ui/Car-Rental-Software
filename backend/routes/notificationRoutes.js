const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const validateMiddleware = require('../middleware/validateMiddleware');
const { body, param } = require('express-validator');

// Notification Validation Rules
const notificationValidation = [
  body('recipient').notEmpty().withMessage('Recipient reference is required!'),
  body('title').trim().notEmpty().withMessage('Title is required!'),
  body('message').trim().notEmpty().withMessage('Message is required!'),
  body('type').optional().isIn(['booking', 'payment', 'system', 'promotion']).withMessage('Invalid notification type!')
];

// @route   GET /api/notifications
// @desc    Get all notifications (filtered by recipient query if provided)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { recipient, isRead, type } = req.query;
    let filter = {};

    if (recipient) filter.recipient = recipient;
    if (isRead !== undefined) filter.isRead = isRead;
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .populate('recipient', 'name email');

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private/Admin
router.post('/', notificationValidation, validateMiddleware, async (req, res) => {
  try {
    const { recipient, title, message, type, isRead } = req.body;

    const newNotification = new Notification({
      recipient,
      title,
      message,
      type,
      isRead
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created successfully!',
      data: newNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read!',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully!'
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