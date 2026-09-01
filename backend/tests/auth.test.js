const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); // Assuming app is exported from server.js
const User = require('../../models/User');

beforeAll(async () => {
  // Connect to test database
  const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/car-rental-test-db';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI);
  }
});

beforeEach(async () => {
  // Clear users collection before each test
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API Tests', () => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'Password@123',
    phone: '9876543210'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toEqual(testUser.email);
    });

    it('should not register a user with an existing email', async () => {
      // Register first
      await request(app).post('/api/auth/register').send(testUser);

      // Try registering again with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register user before login tests
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login an existing user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toEqual(testUser.email);
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword@123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});