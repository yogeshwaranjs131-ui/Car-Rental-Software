const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-rental', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  await connectDB();

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@carrental.com';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', salt);

    // Create admin user
    const adminUser = new User({
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '9999999999',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log(`Admin user created successfully with email: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();