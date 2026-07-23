const mongoose = require('mongoose');
const vehicleService = require('../../src/services/vehicleService');
const testDb = require('../setup/testDb');
const ApiError = require('../../src/utils/ApiError');
const Vehicle = require('../../src/models/Vehicle');

beforeAll(async () => await testDb.connect());
afterEach(async () => await testDb.clear());
afterAll(async () => await testDb.close());

describe('Vehicle Service', () => {
  const validVehicleData = {
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 10
  };

  describe('createVehicle', () => {
    it('should successfully create a vehicle', async () => {
      const vehicle = await vehicleService.createVehicle(validVehicleData);
      expect(vehicle).toBeDefined();
      expect(vehicle.make).toBe('Toyota');
      expect(vehicle.quantity).toBe(10);
    });

    it('should fail when required fields are missing', async () => {
      await expect(vehicleService.createVehicle({})).rejects.toThrow();
    });
  });

  describe('updateVehicle', () => {
    it('should throw ApiError(404) for unknown id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(vehicleService.updateVehicle(fakeId, { price: 20000 }))
        .rejects.toThrow(ApiError);
      
      try {
        await vehicleService.updateVehicle(fakeId, { price: 20000 });
      } catch (err) {
        expect(err.statusCode).toBe(404);
      }
    });

    it('should update vehicle details', async () => {
      const created = await vehicleService.createVehicle(validVehicleData);
      const updated = await vehicleService.updateVehicle(created._id, { price: 22000 });
      expect(updated.price).toBe(22000);
    });
  });

  describe('deleteVehicle', () => {
    it('should remove the document', async () => {
      const created = await vehicleService.createVehicle(validVehicleData);
      await vehicleService.deleteVehicle(created._id);
      
      const found = await Vehicle.findById(created._id);
      expect(found).toBeNull();
    });

    it('should throw ApiError(404) for unknown id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(vehicleService.deleteVehicle(fakeId))
        .rejects.toThrow(ApiError);
    });
  });

  describe('buildVehicleQuery', () => {
    it('should filter by exact make and model with regex', () => {
      const query = vehicleService.buildVehicleQuery({ make: 'Honda', model: 'civic' });
      expect(query.make).toEqual({ $regex: 'Honda', $options: 'i' });
      expect(query.model).toEqual({ $regex: 'civic', $options: 'i' });
    });

    it('should filter by category', () => {
      const query = vehicleService.buildVehicleQuery({ category: 'SUV' });
      expect(query.category).toBeDefined();
      expect(query.category.$in[0].test('SUV')).toBe(true);
    });

    it('should apply min and max price ranges', () => {
      const query = vehicleService.buildVehicleQuery({ minPrice: 10000, maxPrice: 20000 });
      expect(query.price).toEqual({ $gte: 10000, $lte: 20000 });
    });
    
    it('should combine multiple filters', () => {
      const query = vehicleService.buildVehicleQuery({ make: 'Ford', minPrice: 15000 });
      expect(query.make).toBeDefined();
      expect(query.price).toEqual({ $gte: 15000 });
    });
  });

  describe('purchaseVehicle', () => {
    let vehicleId;
    beforeEach(async () => {
      const created = await vehicleService.createVehicle(validVehicleData); // quantity: 10
      vehicleId = created._id;
    });

    it('should purchase exactly the remaining stock', async () => {
      await vehicleService.purchaseVehicle(vehicleId, 10);
      const vehicle = await Vehicle.findById(vehicleId);
      expect(vehicle.quantity).toBe(0);
    });

    it('should successfully purchase 1 from stock', async () => {
      await vehicleService.purchaseVehicle(vehicleId, 1);
      const vehicle = await Vehicle.findById(vehicleId);
      expect(vehicle.quantity).toBe(9);
    });

    it('should throw ApiError(409) if purchasing more than stock', async () => {
      await expect(vehicleService.purchaseVehicle(vehicleId, 15)).rejects.toThrow(ApiError);
      try {
        await vehicleService.purchaseVehicle(vehicleId, 15);
      } catch (err) {
        expect(err.statusCode).toBe(409);
      }
      // stock unchanged
      const vehicle = await Vehicle.findById(vehicleId);
      expect(vehicle.quantity).toBe(10);
    });
  });

  describe('restockVehicle', () => {
    let vehicleId;
    beforeEach(async () => {
      const created = await vehicleService.createVehicle(validVehicleData); // quantity: 10
      vehicleId = created._id;
    });

    it('should increase quantity on restock', async () => {
      await vehicleService.restockVehicle(vehicleId, 5);
      const vehicle = await Vehicle.findById(vehicleId);
      expect(vehicle.quantity).toBe(15);
    });

    it('should throw error on negative quantity', async () => {
      await expect(vehicleService.restockVehicle(vehicleId, -5)).rejects.toThrow(ApiError);
    });
  });
});
