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
});
