const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const Car = require('../../models/Car');
const Booking = require('../../models/Booking');
const Payment = require('../../models/Payment');
const Location = require('../../models/location');

let token;
let userId;
let bookingId;

beforeAll(async () => {
  const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/car-rental-test-db';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI);
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Car.deleteMany({});
  await Booking.deleteMany({});
  await Payment.deleteMany({});
  await Location.deleteMany({});

  // Create test location
  const location = await Location.create({
    name: 'Payment Test Hub',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'OMR Road',
    pincode: '600097',
    isActive: true
  });

  // Create test car
  const car = await Car.create({
    name: 'Test Audi',
    brand: 'Audi',
    category: 'Luxury',
    pricePerDay: 9500,
    seats: 5,
    fuelType: 'petrol',
    location: location._id,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'
  });

  // Register user and get token
  const authRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Payment User',
      email: 'paymentuser@example.com',
      password: 'Password@123',
      phone: '9876543210'
    });

  token = authRes.body.token;
  userId = authRes.body.user._id;

  // Create a pending booking
  const booking = await Booking.create({
    user: userId,
    car: car._id,
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalPrice: 19000,
    status: 'pending'
  });

  bookingId = booking._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Payment API Tests', () => {
  describe('POST /api/payments', () => {
    it('should process payment successfully and update booking status to confirmed', async () => {
      const res = await request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          booking: bookingId,
          amount: 19000,
          paymentMethod: 'upi',
          transactionId: 'TXN123456789'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.status).toEqual('completed');

      // Verify booking status changed to confirmed
      const updatedBooking = await Booking.findById(bookingId);
      expect(updatedBooking.status).toEqual('confirmed');
    });

    it('should not process payment without authentication', async () => {
      const res = await request(app)
        .post('/api/payments')
        .send({
          booking: bookingId,
          amount: 19000,
          paymentMethod: 'upi',
          transactionId: 'TXN123456789'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
});
