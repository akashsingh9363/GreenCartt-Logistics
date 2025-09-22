const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

describe('Simulation API', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencart_test');
    
    // Create test user
    testUser = new User({
      email: 'test@greencart.com',
      password: 'test123',
      name: 'Test User',
      role: 'manager'
    });
    await testUser.save();

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@greencart.com',
        password: 'test123'
      });

    authToken = loginResponse.body.data.token;
  });

  beforeEach(async () => {
    // Clear and seed test data
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});

    // Create test drivers
    await Driver.create([
      { name: 'Test Driver 1', shiftHours: 8, pastWeekHours: [8, 8, 8, 8, 8, 0, 0], status: 'Active' },
      { name: 'Test Driver 2', shiftHours: 6, pastWeekHours: [6, 6, 6, 6, 6, 0, 0], status: 'Active' }
    ]);

    // Create test routes
    await Route.create([
      { routeId: 1, distanceKm: 10, trafficLevel: 'Low', baseTimeMin: 60 },
      { routeId: 2, distanceKm: 15, trafficLevel: 'High', baseTimeMin: 90 }
    ]);

    // Create test orders
    await Order.create([
      { orderId: 1, valueRs: 1500, routeId: 1, deliveryTime: '01:00' },
      { orderId: 2, valueRs: 800, routeId: 2, deliveryTime: '02:00' }
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/simulation/run', () => {
    test('should run simulation successfully with valid parameters', async () => {
      const simulationParams = {
        drivers: 2,
        startTime: '08:00',
        maxHours: 8,
        routeOptimization: true,
        fuelEfficiency: 85,
        weatherCondition: 'normal'
      };

      const response = await request(app)
        .post('/api/simulation/run')
        .set('Authorization', `Bearer ${authToken}`)
        .send(simulationParams);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.results).toHaveProperty('totalProfit');
      expect(response.body.data.results).toHaveProperty('efficiencyScore');
      expect(response.body.data.results).toHaveProperty('onTimeDeliveries');
      expect(response.body.data.results).toHaveProperty('totalFuelCost');
    });

    test('should return error for insufficient drivers', async () => {
      const simulationParams = {
        drivers: 10, // More than available
        startTime: '08:00',
        maxHours: 8
      };

      const response = await request(app)
        .post('/api/simulation/run')
        .set('Authorization', `Bearer ${authToken}`)
        .send(simulationParams);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INSUFFICIENT_DRIVERS');
    });

    test('should return validation error for invalid parameters', async () => {
      const simulationParams = {
        drivers: -1, // Invalid
        startTime: '25:00', // Invalid time
        maxHours: 15 // Exceeds maximum
      };

      const response = await request(app)
        .post('/api/simulation/run')
        .set('Authorization', `Bearer ${authToken}`)
        .send(simulationParams);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    test('should return error without authentication', async () => {
      const simulationParams = {
        drivers: 2,
        startTime: '08:00',
        maxHours: 8
      };

      const response = await request(app)
        .post('/api/simulation/run')
        .send(simulationParams);

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('NO_TOKEN');
    });
  });

  describe('GET /api/simulation/history', () => {
    test('should get simulation history', async () => {
      // First run a simulation
      await request(app)
        .post('/api/simulation/run')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          drivers: 2,
          startTime: '08:00',
          maxHours: 8
        });

      const response = await request(app)
        .get('/api/simulation/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.simulations).toBeInstanceOf(Array);
      expect(response.body.data.pagination).toHaveProperty('total');
    });
  });
});