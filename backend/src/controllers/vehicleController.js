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
    // Basic get all for now, will add search/pagination in Phase 5
    const vehicles = await require('../models/Vehicle').find({});
    res.status(200).json({ success: true, data: vehicles });
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
