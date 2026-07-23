import api from './api';

const testDriveService = {
  bookTestDrive: async (data) => {
    const response = await api.post('/test-drives/book', data);
    return response.data;
  },
  getMyTestDrives: async () => {
    const response = await api.get('/test-drives/me');
    return response.data;
  },
  getAllTestDrives: async () => {
    const response = await api.get('/test-drives/all');
    return response.data;
  },
  updateTestDriveStatus: async (id, status) => {
    const response = await api.put(`/test-drives/${id}/status`, { status });
    return response.data;
  }
};

export default testDriveService;
