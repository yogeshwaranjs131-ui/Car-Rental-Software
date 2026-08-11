const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendOTP } = require('../controllers/authController');

// Public routes (No authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOTP); // OTP அனுப்புவதற்கான ரவுட்

module.exports = router;