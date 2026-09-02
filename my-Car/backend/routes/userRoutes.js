const express = require('express');
const router = express.Router();

// உங்கள் userController-ல் உள்ள அனைத்து ஃபங்ஷன்களும் சரியாக இறக்குமதி செய்யப்பட்டுள்ளன
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getUserById,
    deleteUserById
} = require('../controllers/userController');

// மிடில்வேர்கள்
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../utils/uploadImage'); // இமேஜ் அப்லோடுக்கு தேவைப்படின்

// சுயவிவர ரௌட்டுகள் (Protected Routes)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

// அட்மின் ரௌட்டுகள் (Admin-only Routes)
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.delete('/:id', protect, admin, deleteUserById);

module.exports = router;