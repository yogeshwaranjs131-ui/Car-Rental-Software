const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Contact = require('../models/contact');
const Review = require('../models/Review');
const Wishlist = require('../models/wishlist');
const Notification = require('../models/Notification');
const Insurance = require('../models/insurance');
const Location = require('../models/location');
const Coupon = require('../models/coupon');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-rental-db');
    console.log('MongoDB Connected for Comprehensive Seeding...');

    // Clear existing data across all collections
    await Promise.all([
      User.deleteMany({}),
      Car.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Contact.deleteMany({}),
      Review.deleteMany({}),
      Wishlist.deleteMany({}),
      Notification.deleteMany({}),
      Insurance.deleteMany({}),
      Location.deleteMany({}),
      Coupon.deleteMany({})
    ]);
    console.log('All existing collections cleared.');

    // 1. Seed Locations
    const locationsData = [
      { name: 'Chennai Airport Hub', city: 'Chennai', state: 'Tamil Nadu', address: 'GST Road, Meenambakkam', pincode: '600027', isActive: true },
      { name: 'T. Nagar Express Station', city: 'Chennai', state: 'Tamil Nadu', address: 'Pondy Bazaar, North Usman Road', pincode: '600017', isActive: true },
      { name: 'Coimbatore Central Hub', city: 'Coimbatore', state: 'Tamil Nadu', address: 'Avinashi Road, Peelamedu', pincode: '641004', isActive: true },
      { name: 'Madurai Bypass Station', city: 'Madurai', state: 'Tamil Nadu', address: 'Byepass Road, Near Mattuthavani', pincode: '625007', isActive: true }
    ];
    const createdLocations = await Location.insertMany(locationsData);
    console.log('Locations seeded.');

    // 2. Seed Users (Admin & Regular User)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password@123', salt);

    const usersData = [
      {
        name: 'System Admin',
        email: process.env.ADMIN_EMAIL || 'admin@carrental.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Yogeshwaran U',
        email: 'yogesh@example.com',
        password: hashedPassword,
        phone: '9123456789',
        role: 'user',
        isActive: true
      }
    ];
    const createdUsers = await User.insertMany(usersData);
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const regularUser = createdUsers.find(u => u.role === 'user');
    console.log('Users seeded.');

    // 3. Seed Cars (Using sample references from locations)
    const carsData = [
      {
        name: 'Swift',
        brand: 'Maruti',
        category: 'Hatchback',
        pricePerDay: 1500,
        seats: 5,
        fuelType: 'petrol',
        location: createdLocations[0]._id,
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800'
      },
      {
        name: 'Honda City',
        brand: 'Honda',
        category: 'Sedan',
        pricePerDay: 2500,
        seats: 5,
        fuelType: 'petrol',
        location: createdLocations[1]._id,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'
      },
      {
        name: 'Creta',
        brand: 'Hyundai',
        category: 'SUV',
        pricePerDay: 3500,
        seats: 5,
        fuelType: 'diesel',
        location: createdLocations[2]._id,
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'
      },
      {
        name: 'BMW 3 Series',
        brand: 'BMW',
        category: 'Luxury',
        pricePerDay: 9000,
        seats: 5,
        fuelType: 'petrol',
        location: createdLocations[3]._id,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
      }
    ];
    const createdCars = await Car.insertMany(carsData);
    console.log('Cars seeded.');

    // 4. Seed Coupons
    const couponsData = [
      { code: 'WELCOME10', discountPercentage: 10, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
      { code: 'SUMMER20', discountPercentage: 20, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), isActive: true }
    ];
    await Coupon.insertMany(couponsData);
    console.log('Coupons seeded.');

    // 5. Seed Bookings
    const bookingData = {
      user: regularUser._id,
      car: createdCars[0]._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalPrice: 4500,
      status: 'confirmed'
    };
    const createdBooking = await Booking.create(bookingData);
    console.log('Booking seeded.');

    // 6. Seed Payments
    await Payment.create({
      booking: createdBooking._id,
      user: regularUser._id,
      amount: 4500,
      paymentMethod: 'upi',
      transactionId: 'TXN987654321',
      status: 'completed'
    });
    console.log('Payment seeded.');

    // 7. Seed Insurance
    await Insurance.create({
      booking: createdBooking._id,
      policyNumber: 'POL-CH-2026-001',
      provider: 'ICICI Lombard',
      coverageType: 'comprehensive',
      premiumAmount: 450,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'active'
    });
    console.log('Insurance seeded.');

    // 8. Seed Reviews
    await Review.create({
      user: regularUser._id,
      car: createdCars[0]._id,
      rating: 5,
      comment: 'Smooth drive and well-maintained vehicle!'
    });
    console.log('Reviews seeded.');

    // 9. Seed Wishlist
    await Wishlist.create({
      user: regularUser._id,
      car: createdCars[1]._id
    });
    console.log('Wishlist seeded.');

    // 10. Seed Notifications
    await Notification.create({
      recipient: regularUser._id,
      title: 'Booking Confirmed',
      message: 'Your rental booking for Swift has been successfully confirmed.',
      type: 'booking',
      isRead: false
    });
    console.log('Notifications seeded.');

    // 11. Seed Support Inquiries
    await Contact.create({
      name: regularUser.name,
      email: regularUser.email,
      phone: regularUser.phone,
      subject: 'Pickup Inquiry',
      message: 'Can I change my pickup location to Chennai Airport Hub?',
      status: 'pending'
    });
    console.log('Support inquiries seeded.');

    console.log('Database comprehensive seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();