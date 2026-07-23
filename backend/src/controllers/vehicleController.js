const vehicleService = require('../services/vehicleService');
const { getIO } = require('../socket');

const triggerUpdate = () => { try { getIO().emit('INVENTORY_UPDATED'); } catch (e) {} };

const createVehicle = async (req, res, next) => {
  try {
    const vehicleData = { ...req.body, createdBy: req.user._id };
    if (req.file?.path) vehicleData.imageUrl = req.file.path;
    const vehicle = await vehicleService.createVehicle(vehicleData);
    triggerUpdate();
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const filters = { ...req.query };
    const result = await vehicleService.getVehicles(filters, req.query.page, req.query.limit, req.query.sort);
    res.status(200).json({ 
      success: true, 
      data: result.vehicles, 
      metadata: {
        page: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        makes: result.makes,
        models: result.models,
        minPrice: result.minPrice,
        maxPrice: result.maxPrice
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicleData = { ...req.body };
    if (req.file?.path) vehicleData.imageUrl = req.file.path;
    const vehicle = await vehicleService.updateVehicle(req.params.id, vehicleData, req.user._id);
    triggerUpdate();
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id, req.user._id);
    triggerUpdate();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const purchaseVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.purchaseVehicle(req.params.id, Number(req.body.quantity) || 1, req.user._id);
    triggerUpdate();
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

const restockVehicle = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!quantity) throw new Error('Quantity is required');
    const vehicle = await vehicleService.restockVehicle(req.params.id, quantity, req.user._id);
    triggerUpdate();
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

const getVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
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
