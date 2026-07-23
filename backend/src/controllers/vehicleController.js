const vehicleService = require('../services/vehicleService');
const { getIO } = require('../socket');

const createVehicle = async (req, res, next) => {
  try {
    const vehicleData = { ...req.body, createdBy: req.user._id };
    if (req.file && req.file.path) {
      vehicleData.imageUrl = req.file.path;
    }
    const vehicle = await vehicleService.createVehicle(vehicleData);
    try { getIO().emit('INVENTORY_UPDATED'); } catch (e) {}
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const { page, limit, sort, make, model, category, minPrice, maxPrice, fuel, transmission, inStock, search } = req.query;
    
    const filters = { make, model, category, minPrice, maxPrice, fuel, transmission, inStock, search };
    const result = await vehicleService.getVehicles(filters, page, limit, sort);

    res.status(200).json({ success: true, data: result.vehicles, metadata: {
      page: result.page,
      totalPages: result.totalPages,
      totalCount: result.totalCount,
      makes: result.makes,
      models: result.models,
      minPrice: result.minPrice,
      maxPrice: result.maxPrice
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicleData = { ...req.body };
    if (req.file && req.file.path) {
      vehicleData.imageUrl = req.file.path;
    }
    const vehicle = await vehicleService.updateVehicle(req.params.id, vehicleData, req.user._id);
    try { getIO().emit('INVENTORY_UPDATED'); } catch (e) {}
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id, req.user._id);
    try { getIO().emit('INVENTORY_UPDATED'); } catch (e) {}
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const purchaseVehicle = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity) || 1;
    const vehicle = await vehicleService.purchaseVehicle(req.params.id, quantity, req.user._id);
    try { getIO().emit('INVENTORY_UPDATED'); } catch (e) {}
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const restockVehicle = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!quantity) throw new Error('Quantity is required');
    const vehicle = await vehicleService.restockVehicle(req.params.id, quantity, req.user._id);
    try { getIO().emit('INVENTORY_UPDATED'); } catch (e) {}
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createVehicle, 
  getVehicles, 
  getVehicle,
  updateVehicle, 
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
};
