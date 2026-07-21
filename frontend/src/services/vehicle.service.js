import api from './api';

const getVehicles = async (params) => {
  const response = await api.get('/vehicles', { params });
  return { data: response.data.data, meta: response.data.metadata };
};

const getVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data.data;
};

const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data.data;
};

const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(`/vehicles/${id}`, vehicleData);
  return response.data.data;
};

const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};

const purchaseVehicle = async (id, quantity = 1) => {
  const response = await api.post(`/vehicles/${id}/purchase`, { quantity });
  return response.data.data;
};

const restockVehicle = async (id, quantity) => {
  const response = await api.post(`/vehicles/${id}/restock`, { quantity });
  return response.data.data;
};

export default {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
};
