const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
    registerUser,
    loginUser,
    sendOTP
} = require('../controllers/authController');

// ==========================================
// Generate JWT Token
// ==========================================
const generateToken = (id, role) => {
    return jwt.sign(
        {
            id,
            role
        },
        process.env.JWT_SECRET || 'your_secret_key',
        {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        }
    );
};

// ==========================================
// Public Routes
// ==========================================
router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/send-otp', sendOTP);

// ==========================================
// Google Authentication
// ==========================================

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

// ==========================================
// Google Callback
// ==========================================

router.get(
    '/google/callback',

    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login`
    }),

    (req, res) => {
        try {

            // Generate JWT
            const token = generateToken(
                req.user._id,
                req.user.role
            );

            // Frontend URL
            const frontendURL =
                process.env.FRONTEND_URL ||
                'http://localhost:5173';

            // Redirect to frontend
            res.redirect(
                `${frontendURL}/google-success?token=${encodeURIComponent(token)}`
            );

        } catch (error) {

            console.error(
                'Google Callback Error:',
                error
            );

            const frontendURL =
                process.env.FRONTEND_URL ||
                'http://localhost:5173';

            res.redirect(
                `${frontendURL}/login`
            );
        }
    }
);

module.exports = router;