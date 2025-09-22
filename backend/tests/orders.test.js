const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Order = require('../models/Order');
const Route = require('../models/Route');

describe('Orders API', () => {
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
    await Order.deleteMany({});
    await Route.deleteMany({});
    
    // Create test route
    await Route.create({
      routeId: 1,
      distanceKm: 10,
      trafficLevel: 'Low',
      baseTimeMin: 60
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/orders', () => {
    test('should create order successfully', async () => {
      const orderData = {
        orderId: 1,
        customer: 'Test Customer',
        valueRs: 1500,
        routeId: 1,
        deliveryTime: '01:00'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.order).toHaveProperty('orderId', 1);
      expect(response.body.data.order).toHaveProperty('profit');
    });

    test('should return error for non-existent route', async () => {
      const orderData = {
        orderId: 2,
        customer: 'Test Customer',
        valueRs: 1000,
        routeId: 999, // Non-existent route
        deliveryTime: '01:00'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('ROUTE_NOT_FOUND');
    });
  });

  describe('GET /api/orders', () => {
    test('should get all orders', async () => {
      // Create test orders
      await Order.create([
        { orderId: 1, valueRs: 1000, routeId: 1, deliveryTime: '01:00' },
        { orderId: 2, valueRs: 1500, routeId: 1, deliveryTime: '01:30' }
      ]);

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.orders).toHaveLength(2);
    });
  });
});