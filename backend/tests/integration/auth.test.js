const request = require('supertest');
const app = require('../../src/app');
const testDb = require('../setup/testDb');

beforeAll(async () => await testDb.connect());
afterEach(async () => await testDb.clear());
afterAll(async () => await testDb.close());

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should return 201 and a token on valid registration', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.password).toBeUndefined(); // Password shouldn't be returned
    });

    it('should return 409 on duplicate email', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User 2',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should return 200 and a token on valid login', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 401 on wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
});
