const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/car-rental-db';

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Images Static Folder (backend/public/images/logo.png-க்காக)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes Import
const carRoutes = require('./routes/carRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const wishlistRoutes = require('./routes/wishlistRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const couponRoutes = require('./routes/couponRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js'); // 🌟 Payment Routes இங்கு சரியாக இம்போர்ட் செய்யப்பட்டுள்ளது

// API Versioning helper (payments ரூட்டையும் சேர்த்து முறைப்படுத்தப்பட்டுள்ளது)
const mountRoutes = (versionPrefix) => {
    app.use(`${versionPrefix}/cars`, carRoutes);
    app.use(`${versionPrefix}/bookings`, bookingRoutes);
    app.use(`${versionPrefix}/auth`, authRoutes);
    app.use(`${versionPrefix}/users`, userRoutes);
    app.use(`${versionPrefix}/wishlist`, wishlistRoutes);
    app.use(`${versionPrefix}/reviews`, reviewRoutes);
    app.use(`${versionPrefix}/coupons`, couponRoutes);
    app.use(`${versionPrefix}/payments`, paymentRoutes); // 🌟 அனைத்து Version-களிலும் Payments இணைக்கப்படும்
};

mountRoutes('/api/v1');
mountRoutes('/api');

// Base Root Route for Testing
app.get('/', (req, res) => {
    res.send('Car Rental Backend Server is Active & Running! 🚀');
});

// ⚠️ 404 Not Found Handler (எல்லா ரூட்களுக்கும் கீழே இருக்க வேண்டும்)
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'API Route Not Found on Server ❌' });
});

// MongoDB Connection & Server Startup
mongoose.connect(MONGO_URI)
.then(() => {
    console.log('MongoDB Connected Successfully... 📦');
    app.listen(PORT, () => {
        console.log(`Server is running smoothly on port ${PORT} 🟢`);
    });
})
.catch(err => {
    console.error('DB Connection Failed: ❌', err);
});