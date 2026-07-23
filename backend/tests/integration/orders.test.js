const request = require('supertest');
const app = require('../../src/app');
const testDb = require('../setup/testDb');
const User = require('../../src/models/User');
const Purchase = require('../../src/models/Purchase');
const generateToken = require('../../src/utils/generateToken');
const mongoose = require('mongoose');

let token;
let adminToken;
let user;
let adminUser;

beforeAll(async () => {
  await testDb.connect();
});

beforeEach(async () => {
  await testDb.clear();
  
  // Create test users
  user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  
  adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });

  const resUser = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });
  token = generateToken(user._id, user.role);

  const resAdmin = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'password123' });
  adminToken = generateToken(adminUser._id, adminUser.role);
});

afterAll(async () => {
  await testDb.close();
});

describe('Orders API', () => {
  it('should fetch orders for admin', async () => {
    // Create an order
    await Purchase.create({
      userId: user._id,
      vehicleId: new mongoose.Types.ObjectId(),
      quantity: 1,
      price: 50000,
      price: 50000,
      purchaseDate: new Date()
    });

    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].price).toBe(50000);
  });

  it('should deny non-admin access to fetch orders', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(403);
  });
});
