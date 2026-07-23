const request = require('supertest');
const app = require('../../src/app');
const testDb = require('../setup/testDb');
const User = require('../../src/models/User');
const generateToken = require('../../src/utils/generateToken');

let token;
let adminToken;

beforeAll(async () => {
  await testDb.connect();
});

beforeEach(async () => {
  await testDb.clear();
  const user = await User.create({ name: 'Test', email: 'test@ex.com', password: 'password123' });
  const admin = await User.create({ name: 'Admin', email: 'admin@ex.com', password: 'password123', role: 'admin' });
  
  token = generateToken(user._id, user.role);
  adminToken = generateToken(admin._id, admin.role);
});

afterAll(async () => {
  await testDb.close();
});

describe('Customers API', () => {
  it('should allow admin to fetch customer list', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should deny non-admin access to customer list', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
  });
});
