const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Route = require('../models/Route');

describe('Routes API', () => {
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
    await Route.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/routes', () => {
    test('should create route successfully', async () => {
      const routeData = {
        routeId: 1,
        distanceKm: 15.5,
        trafficLevel: 'Medium',
        baseTimeMin: 90
      };

      const response = await request(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(routeData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.route).toHaveProperty('routeId', 1);
      expect(response.body.data.route).toHaveProperty('fuelCost');
    });

    test('should calculate fuel cost correctly for high traffic', async () => {
      const routeData = {
        routeId: 2,
        distanceKm: 10,
        trafficLevel: 'High',
        baseTimeMin: 60
      };

      const response = await request(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(routeData);

      expect(response.status).toBe(201);
      // Base cost: 10 * 5 = 50, High traffic surcharge: 10 * 2 = 20, Total: 70
      expect(response.body.data.route.fuelCost).toBe(70);
    });
  });

  describe('GET /api/routes', () => {
    test('should get all routes', async () => {
      // Create test routes
      await Route.create([
        { routeId: 1, distanceKm: 10, trafficLevel: 'Low', baseTimeMin: 60 },
        { routeId: 2, distanceKm: 15, trafficLevel: 'High', baseTimeMin: 90 }
      ]);

      const response = await request(app)
        .get('/api/routes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.routes).toHaveLength(2);
    });
  });
});