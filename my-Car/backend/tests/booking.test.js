const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const Car = require('../../models/Car');
const Booking = require('../../models/Booking');
const Location = require('../../models/location');

let token;
let userId;
let carId;
let locationId;

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
  await Location.deleteMany({});

  // Create a test location
  const location = await Location.create({
    name: 'Test Hub',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'GST Road',
    pincode: '600027',
    isActive: true
  });
  locationId = location._id;

  // Create a test car
  const car = await Car.create({
    name: 'Test Swift',
    brand: 'Maruti',
    category: 'Hatchback',
    pricePerDay: 1500,
    seats: 5,
    fuelType: 'petrol',
    location: locationId,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800'
  });
  carId = car._id;

  // Register and login a test user to get token
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Booking User',
      email: 'bookinguser@example.com',
      password: 'Password@123',
      phone: '9876543210'
    });

  token = res.body.token;
  userId = res.body.user._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Booking API Tests', () => {
  describe('POST /api/bookings', () => {
    it('should create a new booking successfully', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          car: carId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          totalPrice: 4500
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.totalPrice).toEqual(4500);
    });

    it('should not create a booking without authentication', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send({
          car: carId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          totalPrice: 4500
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings', () => {
    it('should retrieve all bookings for the authenticated user', async () => {
      // Create a booking first
      await Booking.create({
        user: userId,
        car: carId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        totalPrice: 3000,
        status: 'pending'
      });

      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});