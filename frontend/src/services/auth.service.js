import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.data && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.data && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default { login, register, logout };
