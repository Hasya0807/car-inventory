const request = require('supertest');
const express = require('express');
const { protect, admin } = require('../../src/middleware/authMiddleware');
const generateToken = require('../../src/utils/generateToken');
const User = require('../../src/models/User');
const testDb = require('../setup/testDb');

const app = express();
app.use(express.json());

// Dummy routes for testing middleware
app.get('/api/protected', protect, (req, res) => res.json({ success: true, user: req.user }));
app.get('/api/admin', protect, admin, (req, res) => res.json({ success: true, user: req.user }));

beforeAll(async () => await testDb.connect());
afterEach(async () => await testDb.clear());
afterAll(async () => await testDb.close());

describe('Auth Middleware', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    const user = await User.create({ name: 'User', email: 'u@test.com', password: 'pw' });
    const adminUser = await User.create({ name: 'Admin', email: 'a@test.com', password: 'pw', role: 'admin' });
    userToken = generateToken(user._id, user.role);
    adminToken = generateToken(adminUser._id, adminUser.role);
  });

  describe('protect()', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/protected');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 with malformed token', async () => {
      const res = await request(app).get('/api/protected').set('Authorization', 'Bearer invalidtoken');
      expect(res.statusCode).toEqual(401);
    });

    it('should attach req.user and call next() with valid token', async () => {
      const res = await request(app).get('/api/protected').set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('u@test.com');
    });
  });

  describe('admin()', () => {
    it('should return 403 for non-admin user', async () => {
      const res = await request(app).get('/api/admin').set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it('should allow admin user', async () => {
      const res = await request(app).get('/api/admin').set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});
