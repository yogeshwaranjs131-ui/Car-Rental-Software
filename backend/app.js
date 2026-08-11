const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route files
const bookingRoutes = require('./routes/bookingRoutes');
const carRoutes = require('./routes/carRoutes'); // 👈 கார் வழிகளை (routes) import செய்யவும்

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// A simple test route
app.get('/', (req, res) => {
  res.send('Car Rental API is running...');
});

// Mount routers
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/cars', carRoutes); // 👈 கார் வழிகளைப் பயன்படுத்தவும்

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});