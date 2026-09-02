const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const validateMiddleware = require('../middleware/validateMiddleware'); // Adjust path as needed based on your structure
const { body } = require('express-validator');

// Admin Login Route Validation Rules
const adminLoginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address!'),
  body('password').notEmpty().withMessage('Password is required!')
];

// Admin Register / Create Route Validation Rules
const adminRegisterValidation = [
  body('name').trim().notEmpty().withMessage('Name is required!'),
  body('email').isEmail().withMessage('Please provide a valid email address!'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long!'),
  body('role').optional().isIn(['admin', 'super-admin']).withMessage('Invalid role specified!')
];

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', adminLoginValidation, validateMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      });
    }

    // Note: Add your password hashing / comparison logic here (e.g., bcrypt.compare)
    if (password !== admin.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully!',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
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

// @route   POST /api/admin/register
// @desc    Register a new admin
// @access  Public (or protected depending on your app design)
router.post('/register', adminRegisterValidation, validateMiddleware, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists!'
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password, // Remember to hash this password using bcrypt before saving in production!
      role
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully!',
      data: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
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

// @route   GET /api/admin/profile
// @desc    Get current admin profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    // Implement your authentication middleware to attach admin id to req.admin
    res.status(200).json({
      success: true,
      message: 'Admin profile fetched successfully!'
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