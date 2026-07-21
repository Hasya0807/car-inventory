const ApiError = require('../utils/ApiError');
const Vehicle = require('../models/Vehicle');

const createVehicle = async (data) => {
  return await Vehicle.create(data);
};

const getVehicleOr404 = async (id) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }
  return vehicle;
};

const updateVehicle = async (id, data) => {
  const vehicle = await getVehicleOr404(id);
  Object.assign(vehicle, data);
  return await vehicle.save();
};

const deleteVehicle = async (id) => {
  const vehicle = await getVehicleOr404(id);
  await vehicle.deleteOne();
  return { success: true, message: 'Vehicle removed' };
};

const getVehicleById = async (id) => {
  return await getVehicleOr404(id);
};

module.exports = { createVehicle, updateVehicle, deleteVehicle, getVehicleById };
