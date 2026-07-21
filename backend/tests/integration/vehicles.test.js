const request = require('supertest');
const app = require('../../src/app');
const testDb = require('../setup/testDb');
const User = require('../../src/models/User');
const Vehicle = require('../../src/models/Vehicle');
const generateToken = require('../../src/utils/generateToken');

beforeAll(async () => await testDb.connect());
afterEach(async () => await testDb.clear());
afterAll(async () => await testDb.close());

describe('Vehicles API', () => {
  let userToken, adminToken;
  let vehicleData = {
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 20000,
    quantity: 5
  };

  beforeEach(async () => {
    const user = await User.create({ name: 'User', email: 'u@test.com', password: 'pw' });
    const admin = await User.create({ name: 'Admin', email: 'a@test.com', password: 'pw', role: 'admin' });
    userToken = generateToken(user._id, user.role);
    adminToken = generateToken(admin._id, admin.role);
  });

  describe('POST /api/vehicles', () => {
    it('should block unauthenticated user', async () => {
      const res = await request(app).post('/api/vehicles').send(vehicleData);
      expect(res.statusCode).toBe(401);
    });

    it('should block non-admin user', async () => {
      const res = await request(app).post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(vehicleData);
      expect(res.statusCode).toBe(403);
    });

    it('should create vehicle for admin user', async () => {
      const res = await request(app).post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(vehicleData);
      expect(res.statusCode).toBe(201);
      expect(res.body.data.make).toBe('Honda');
    });
  });

  describe('GET /api/vehicles', () => {
    beforeEach(async () => {
      await Vehicle.create(vehicleData);
      await Vehicle.create({ ...vehicleData, make: 'Toyota', model: 'Corolla', price: 22000, category: 'Sedan' });
    });

    it('should return paginated list of vehicles', async () => {
      const res = await request(app).get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.metadata.totalCount).toBe(2);
    });
  });

  describe('GET /api/vehicles/search', () => {
    beforeEach(async () => {
      await Vehicle.create(vehicleData);
      await Vehicle.create({ ...vehicleData, make: 'Toyota', model: 'Corolla', price: 22000, category: 'Sedan' });
      await Vehicle.create({ ...vehicleData, make: 'Ford', model: 'Escape', price: 30000, category: 'SUV' });
    });

    it('should filter vehicles by search criteria', async () => {
      const res = await request(app).get('/api/vehicles/search?make=Toyota')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].make).toBe('Toyota');
    });

    it('should filter by price range', async () => {
      const res = await request(app).get('/api/vehicles/search?minPrice=21000&maxPrice=25000')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].model).toBe('Corolla');
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    let vehicleId;
    beforeEach(async () => {
      const v = await Vehicle.create(vehicleData);
      vehicleId = v._id;
    });

    it('should block non-admin', async () => {
      const res = await request(app).put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 21000 });
      expect(res.statusCode).toBe(403);
    });

    it('should update for admin', async () => {
      const res = await request(app).put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 21000 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.price).toBe(21000);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    let vehicleId;
    beforeEach(async () => {
      const v = await Vehicle.create(vehicleData);
      vehicleId = v._id;
    });

    it('should block non-admin', async () => {
      const res = await request(app).delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(403);
    });

    it('should delete for admin', async () => {
      const res = await request(app).delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      const found = await Vehicle.findById(vehicleId);
      expect(found).toBeNull();
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    let vehicleId;
    beforeEach(async () => {
      const v = await Vehicle.create(vehicleData);
      vehicleId = v._id;
    });

    it('should purchase vehicle and decrement stock', async () => {
      const res = await request(app).post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.quantity).toBe(3);
    });

    it('should block purchasing more than stock', async () => {
      const res = await request(app).post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 });
      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    let vehicleId;
    beforeEach(async () => {
      const v = await Vehicle.create(vehicleData);
      vehicleId = v._id;
    });

    it('should block non-admin', async () => {
      const res = await request(app).post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });
      expect(res.statusCode).toBe(403);
    });

    it('should increase stock for admin', async () => {
      const res = await request(app).post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.quantity).toBe(10);
    });
  });
});
