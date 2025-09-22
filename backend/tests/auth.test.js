const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Authentication API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencart_test');
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Create test user
    const testUser = new User({
      email: 'test@greencart.com',
      password: 'test123',
      name: 'Test User',
      role: 'manager'
    });
    await testUser.save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/login', () => {
    test('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@greencart.com',
          password: 'test123'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', 'test@greencart.com');
    });

    test('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@greencart.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });

    test('should return validation error for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'test123'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should get current user with valid token', async () => {
      // Login first
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@greencart.com',
          password: 'test123'
        });

      const token = loginResponse.body.data.token;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('email', 'test@greencart.com');
    });

    test('should return error without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('NO_TOKEN');
    });
  });
});