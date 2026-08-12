const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Safe Routes Import (எந்த ஃபைல் மிஸ் ஆனாலும் சர்வர் கிராஷ் ஆகாமல் இருக்க Try-Catch அல்லது பாதுகாப்பான முறையில் இம்போர்ட்)
try {
    const carRoutes = require('./routes/carRoutes.js');
    const bookingRoutes = require('./routes/bookingRoutes.js');
    const authRoutes = require('./routes/authRoutes.js');
    const userRoutes = require('./routes/userRoutes.js');
    const wishlistRoutes = require('./routes/wishlistRoutes.js');
    const reviewRoutes = require('./routes/reviewRoutes.js');
    const couponRoutes = require('./routes/couponRoutes.js');
    const paymentRoutes = require('./routes/paymentRoutes.js');

    const mountRoutes = (versionPrefix) => {
        app.use(`${versionPrefix}/cars`, carRoutes);
        app.use(`${versionPrefix}/bookings`, bookingRoutes);
        app.use(`${versionPrefix}/auth`, authRoutes);
        app.use(`${versionPrefix}/users`, userRoutes);
        app.use(`${versionPrefix}/wishlist`, wishlistRoutes);
        app.use(`${versionPrefix}/reviews`, reviewRoutes);
        app.use(`${versionPrefix}/coupons`, couponRoutes);
        app.use(`${versionPrefix}/payments`, paymentRoutes);
    };

    mountRoutes('/api/v1');
    mountRoutes('/api');
    console.log('All routes loaded successfully! 🟢');
} catch (error) {
    console.error('Error loading routes: ❌', error.message);
}

// Base Root Route for Testing
app.get('/', (req, res) => {
    res.send('Car Rental Backend Server is Active & Running! 🚀');
});

// 404 Not Found Handler
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