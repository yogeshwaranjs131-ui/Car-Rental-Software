const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 1. சரியான கன்ட்ரோலர் கோப்பிலிருந்து பங்கஷன்களை இறக்குமதி செய்தல்
const { 
    getAllCars, 
    getCarById, 
    addCar, 
    updateCar, 
    deleteCar 
} = require('../controllers/carController');

// 2. இமேஜ் அப்லோட் செட்டப் (Multer)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // பேக்என்ட்டில் uploads ஃபோல்டர் இருக்க வேண்டும்
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 3. மிடில்வேர்கள் (தேவைக்கேற்ப மாற்றிக்கொள்ளலாம்)
const protect = (req, res, next) => {
    next();
};

const admin = (req, res, next) => {
    next();
};

const validateMiddleware = (req, res, next) => {
    next();
};

// 4. உண்மையான கன்ட்ரோலர் பங்கஷன்கள் இணைக்கப்பட்ட ரௌட்டுகள் (Routes)
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/', protect, admin, upload.single('image'), validateMiddleware, addCar);
router.put('/:id', protect, admin, validateMiddleware, updateCar);
router.delete('/:id', protect, admin, deleteCar);

module.exports = router;