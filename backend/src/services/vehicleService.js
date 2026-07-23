const ApiError = require('../utils/ApiError');
const Vehicle = require('../models/Vehicle');
const Purchase = require('../models/Purchase');
const ActivityLog = require('../models/ActivityLog');

const createVehicle = async (data) => {
  const vehicle = await Vehicle.create(data);
  await ActivityLog.create({
    userId: data.createdBy,
    action: 'Vehicle Added',
    vehicleId: vehicle._id
  });
  return vehicle;
};

const getVehicleOr404 = async (id) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }
  return vehicle;
};

const updateVehicle = async (id, data, adminId) => {
  const vehicle = await getVehicleOr404(id);
  Object.assign(vehicle, data);
  await vehicle.save();
  if (adminId) {
    await ActivityLog.create({ userId: adminId, action: 'Vehicle Updated', vehicleId: id });
  }
  return vehicle;
};

const deleteVehicle = async (id, adminId) => {
  const vehicle = await getVehicleOr404(id);
  await vehicle.deleteOne();
  if (adminId) {
    await ActivityLog.create({ userId: adminId, action: 'Vehicle Deleted', vehicleId: id });
  }
  return { success: true, message: 'Vehicle removed' };
};

const getVehicleById = async (id) => {
  return await getVehicleOr404(id);
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const buildVehicleQuery = (filters) => {
  const query = {};
  if (filters.search) {
    const searchRegex = new RegExp(escapeRegex(filters.search), 'i');
    query.$or = [
      { make: searchRegex },
      { model: searchRegex },
      { category: searchRegex }
    ];
  }
  if (filters.make) query.make = { $regex: escapeRegex(filters.make), $options: 'i' };
  if (filters.model) query.model = { $regex: escapeRegex(filters.model), $options: 'i' };
  if (filters.category) {
    const categories = filters.category.split(',').map(c => new RegExp(`^${escapeRegex(c)}$`, 'i'));
    query.category = { $in: categories };
  }
  if (filters.color) {
    const colors = filters.color.split(',').map(c => new RegExp(escapeRegex(c), 'i'));
    query.color = { $in: colors };
  }
  if (filters.fuel) query.fuel = filters.fuel;
  if (filters.transmission) query.transmission = filters.transmission;
  
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }
  if (filters.inStock === 'true') {
    query.quantity = { $gt: 0 };
  }
  return query;
};

const getVehicles = async (filters, page = 1, limit = 10, sort = 'price_asc') => {
  const query = buildVehicleQuery(filters);
  if (!filters.inStock) {
    query.quantity = { $gte: 0 }; 
  }

  const skip = (page - 1) * limit;
  const totalCount = await Vehicle.countDocuments(query);
  
  let sortObj = { price: 1 };
  if (sort === 'price_desc') sortObj = { price: -1 };
  if (sort === 'newest') sortObj = { createdAt: -1 };
  if (sort === 'oldest') sortObj = { createdAt: 1 };

  const vehicles = await Vehicle.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(Number(limit));

  const makes = await Vehicle.distinct('make');
  const minPriceDoc = await Vehicle.findOne().sort({ price: 1 }).select('price');
  const maxPriceDoc = await Vehicle.findOne().sort({ price: -1 }).select('price');
  
  // For models, we can either return all models, or if a make filter is selected, models for that make.
  const modelQuery = filters.make ? { make: { $regex: new RegExp(`^${filters.make}$`, 'i') } } : {};
  const models = await Vehicle.distinct('model', modelQuery);

  return {
    vehicles,
    page: Number(page),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    makes,
    models,
    minPrice: minPriceDoc ? minPriceDoc.price : 0,
    maxPrice: maxPriceDoc ? maxPriceDoc.price : 10000000
  };
};

const purchaseVehicle = async (id, quantity = 1, userId) => {
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

  if (userId) {
    await Purchase.create({
      userId,
      vehicleId: id,
      price: updatedVehicle.price,
      quantity
    });

    await ActivityLog.create({
      userId,
      action: 'Vehicle Purchased',
      vehicleId: id,
      details: { quantity, price: updatedVehicle.price }
    });
  }

  return updatedVehicle;
};

const restockVehicle = async (id, quantity, adminId) => {
  if (quantity <= 0) throw new ApiError(400, 'Restock quantity must be positive');

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { $inc: { quantity: quantity } },
    { new: true }
  );

  if (!updatedVehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  if (adminId) {
    await ActivityLog.create({
      userId: adminId,
      action: 'Vehicle Restocked',
      vehicleId: id,
      details: { added: quantity, newTotal: updatedVehicle.quantity }
    });
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
