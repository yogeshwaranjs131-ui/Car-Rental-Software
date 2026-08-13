const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser, sendOTP } = require('../controllers/authController');

// Token generator helper function
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_secret_key', {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// Public routes (No authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOTP); // Route for sending OTP

// Google Authentication Routes
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
    (req, res) => {
        try {
            const token = generateToken(req.user._id, req.user.role);
            res.redirect(`http://localhost:5173/?token=${token}`);
        } catch (error) {
            console.error("Google Callback Error:", error);
            res.redirect('http://localhost:5173/login');
        }
    }
);

module.exports = router;