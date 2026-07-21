const vehicleService = require('../services/vehicleService');

const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const { page, limit, make, model, category, minPrice, maxPrice } = req.query;
    
    const filters = { make, model, category, minPrice, maxPrice };
    const result = await vehicleService.getVehicles(filters, page, limit);

    res.status(200).json({ success: true, data: result.vehicles, metadata: {
      page: result.page,
      totalPages: result.totalPages,
      totalCount: result.totalCount
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

module.exports = { createVehicle, getVehicles, updateVehicle, deleteVehicle };
