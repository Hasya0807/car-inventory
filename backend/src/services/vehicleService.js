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

const buildVehicleQuery = (filters) => {
  const query = {};
  if (filters.make) query.make = { $regex: filters.make, $options: 'i' };
  if (filters.model) query.model = { $regex: filters.model, $options: 'i' };
  if (filters.category) query.category = filters.category;
  
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }
  return query;
};

const getVehicles = async (filters, page = 1, limit = 10) => {
  const query = buildVehicleQuery(filters);
  query.quantity = { $gte: 0 }; // Only vehicles with quantity >= 0

  const skip = (page - 1) * limit;
  const totalCount = await Vehicle.countDocuments(query);
  const vehicles = await Vehicle.find(query)
    .sort({ price: 1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    vehicles,
    page: Number(page),
    totalPages: Math.ceil(totalCount / limit),
    totalCount
  };
};

const purchaseVehicle = async (id, quantity = 1) => {
  if (quantity <= 0) throw new ApiError(400, 'Purchase quantity must be positive');

  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { _id: id, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity } },
    { new: true }
  );

  if (!updatedVehicle) {
    const vehicle = await getVehicleOr404(id);
    if (vehicle.quantity < quantity) {
      throw new ApiError(409, 'Not enough stock available');
    }
  }
  return updatedVehicle;
};

const restockVehicle = async (id, quantity) => {
  if (quantity <= 0) throw new ApiError(400, 'Restock quantity must be positive');

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { $inc: { quantity: quantity } },
    { new: true }
  );

  if (!updatedVehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }
  return updatedVehicle;
};

module.exports = { 
  createVehicle, 
  updateVehicle, 
  deleteVehicle, 
  getVehicleById,
  buildVehicleQuery,
  getVehicles,
  purchaseVehicle,
  restockVehicle
};
