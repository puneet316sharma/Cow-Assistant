import axiosClient from './axiosClient';

export const registerApi = async (userData) => {
  const response = await axiosClient.post('/api/auth/register', userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await axiosClient.post('/api/auth/login', credentials);
  return response.data;
};

export const getMeApi = async () => {
  const response = await axiosClient.get('/api/auth/me');
  return response.data;
};
