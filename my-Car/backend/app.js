const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');

const connectDB = require('./config/db');

// ==========================================
// Load Environment Variables
// ==========================================
dotenv.config();

// ==========================================
// Load Passport Google Strategy
// ==========================================
require('./config/passport');

// ==========================================
// Import Routes
// ==========================================
const bookingRoutes = require('./routes/bookingRoutes');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');

// ==========================================
// Initialize Express App
// ==========================================
const app = express();

// ==========================================
// Connect to MongoDB
// ==========================================
connectDB();

// ==========================================
// Middlewares
// ==========================================

// CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Passport
app.use(passport.initialize());

// ==========================================
// Test Route
// ==========================================
app.get('/', (req, res) => {
    res.send('Car Rental API is running...');
});

// ==========================================
// API Routes
// ==========================================

// Booking Routes
app.use('/api/v1/bookings', bookingRoutes);

// Car Routes
app.use('/api/v1/cars', carRoutes);

// Authentication Routes
app.use('/api/auth', authRoutes);

// ==========================================
// Server Port
// ==========================================
const PORT = process.env.PORT || 5000;

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});