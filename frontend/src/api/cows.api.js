import axiosClient from './axiosClient';

export const getCowsApi = async (params = {}) => {
  const response = await axiosClient.get('/api/cows', { params });
  return response.data;
};

export const getCowByTagIdApi = async (tagId) => {
  const response = await axiosClient.get(`/api/cows/${tagId}`);
  return response.data;
};

export const createCowApi = async (cowData) => {
  const response = await axiosClient.post('/api/cows', cowData);
  return response.data;
};

export const updateCowApi = async (tagId, cowData) => {
  const response = await axiosClient.put(`/api/cows/${tagId}`, cowData);
  return response.data;
};

export const deleteCowApi = async (tagId) => {
  const response = await axiosClient.delete(`/api/cows/${tagId}`);
  return response.data;
};
