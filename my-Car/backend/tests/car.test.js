const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Car = require('../../models/Car');
const User = require('../../models/User');
const Location = require('../../models/location');

let adminToken;
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
  await Location.deleteMany({});

  // Create test location
  const location = await Location.create({
    name: 'Chennai Hub',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'GST Road',
    pincode: '600027',
    isActive: true
  });
  locationId = location._id;

  // Create Admin User to get token for restricted routes
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@carrental.com',
    password: 'Password@123',
    phone: '9876543210',
    role: 'admin'
  });

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@carrental.com',
      password: 'Password@123'
    });

  adminToken = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Car API Tests', () => {
  describe('GET /api/cars', () => {
    it('should retrieve all cars', async () => {
      await Car.create({
        name: 'Test WagonR',
        brand: 'Maruti',
        category: 'Hatchback',
        pricePerDay: 1300,
        seats: 5,
        fuelType: 'petrol',
        location: locationId,
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
      });

      const res = await request(app).get('/api/cars');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/cars', () => {
    it('should allow admin to create a new car', async () => {
      const newCarData = {
        name: 'Test Creta',
        brand: 'Hyundai',
        category: 'SUV',
        pricePerDay: 3500,
        seats: 5,
        fuelType: 'diesel',
        location: locationId,
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'
      };

      const res = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCarData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toEqual('Test Creta');
    });

    it('should not allow non-admin users to create a car', async () => {
      // Register regular user
      const userRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Regular User',
          email: 'user@example.com',
          password: 'Password@123',
          phone: '9123456789'
        });

      const userToken = userRes.body.token;

      const newCarData = {
        name: 'Test City',
        brand: 'Honda',
        category: 'Sedan',
        pricePerDay: 2500,
        seats: 5, 
        fuelType: 'petrol',
        location: locationId,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'
      };

      const res = await request(app)
        .post('/api/cars')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newCarData);

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
});