const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Driver = require('../models/Driver');

describe('Drivers API', () => {
  let authToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencart_test');
    
    // Create and login test user
    const testUser = new User({
      email: 'test@greencart.com',
      password: 'test123',
      name: 'Test User',
      role: 'manager'
    });
    await testUser.save();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@greencart.com',
        password: 'test123'
      });

    authToken = loginResponse.body.data.token;
  });

  beforeEach(async () => {
    await Driver.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/drivers', () => {
    test('should create driver successfully', async () => {
      const driverData = {
        name: 'Test Driver',
        shiftHours: 8,
        pastWeekHours: [8, 8, 8, 8, 8, 0, 0],
        status: 'Active',
        efficiency: 90
      };

      const response = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(driverData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.driver).toHaveProperty('name', 'Test Driver');
    });

    test('should return validation error for invalid data', async () => {
      const invalidData = {
        name: '', // Empty name
        shiftHours: 15, // Exceeds maximum
        pastWeekHours: [8, 8, 8] // Wrong array length
      };

      const response = await request(app)
        .post('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/drivers', () => {
    test('should get all drivers', async () => {
      // Create test drivers
      await Driver.create([
        { name: 'Driver 1', shiftHours: 8, pastWeekHours: [8, 8, 8, 8, 8, 0, 0] },
        { name: 'Driver 2', shiftHours: 6, pastWeekHours: [6, 6, 6, 6, 6, 0, 0] }
      ]);

      const response = await request(app)
        .get('/api/drivers')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.drivers).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total', 2);
    });
  });
});