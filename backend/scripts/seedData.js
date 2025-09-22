const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@greencart.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Admin User',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Created admin user');

    // Seed drivers from CSV
    const drivers = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../data/drivers.csv'))
        .pipe(csv())
        .on('data', (row) => {
          const pastWeekHours = row.past_week_hours.split('|').map(Number);
          drivers.push({
            name: row.name,
            shiftHours: parseInt(row.shift_hours),
            pastWeekHours: pastWeekHours,
            status: 'Active',
            efficiency: Math.floor(Math.random() * 20) + 80, // 80-100%
            deliveries: Math.floor(Math.random() * 200) + 50 // 50-250 deliveries
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    await Driver.insertMany(drivers);
    console.log(`✅ Seeded ${drivers.length} drivers`);

    // Seed routes from CSV
    const routes = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../data/routes.csv'))
        .pipe(csv())
        .on('data', (row) => {
          const route = {
            routeId: parseInt(row.route_id),
            name: `Route ${row.route_id}`,
            distanceKm: parseFloat(row.distance_km),
            trafficLevel: row.traffic_level,
            baseTimeMin: parseInt(row.base_time_min)
          };
          
          // Calculate fuel cost
          const baseCost = route.distanceKm * 5;
          const surcharge = route.trafficLevel === 'High' ? route.distanceKm * 2 : 0;
          route.fuelCost = baseCost + surcharge;
          route.avgDeliveryTime = route.baseTimeMin;
          
          routes.push(route);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    await Route.insertMany(routes);
    console.log(`✅ Seeded ${routes.length} routes`);

    // Create route lookup map
    const routeMap = {};
    routes.forEach(route => {
      routeMap[route.routeId] = route;
    });

    // Seed orders from CSV
    const orders = [];
    const customers = [
      'Green Grocers', 'Eco Market', 'Fresh Foods Co', 'Organic Plus',
      'Nature\'s Best', 'Healthy Choice', 'Farm Fresh', 'Pure Organic',
      'Green Valley', 'Earth Foods', 'Bio Market', 'Natural Harvest'
    ];

    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../data/orders.csv'))
        .pipe(csv())
        .on('data', (row) => {
          const routeId = parseInt(row.route_id);
          const route = routeMap[routeId];
          
          if (route) {
            const [hours, minutes] = row.delivery_time.split(':').map(Number);
            const deliveryTimeMinutes = hours * 60 + minutes;
            
            const order = {
              orderId: parseInt(row.order_id),
              customer: customers[Math.floor(Math.random() * customers.length)],
              valueRs: parseInt(row.value_rs),
              routeId: routeId,
              deliveryTime: row.delivery_time,
              deliveryTimeMinutes: deliveryTimeMinutes,
              status: Math.random() > 0.2 ? 'Delivered' : 'Pending',
              priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
            };

            // Calculate metrics based on company rules
            const isOnTime = deliveryTimeMinutes <= (route.baseTimeMin + 10);
            order.isOnTime = isOnTime;
            order.penalty = isOnTime ? 0 : 50;
            order.bonus = (order.valueRs > 1000 && isOnTime) ? order.valueRs * 0.1 : 0;
            order.profit = order.valueRs + order.bonus - order.penalty - route.fuelCost;

            orders.push(order);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    await Order.insertMany(orders);
    console.log(`✅ Seeded ${orders.length} orders`);

    console.log('🎉 Data seeding completed successfully!');
    console.log(`📧 Admin login: ${adminUser.email}`);
    console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();