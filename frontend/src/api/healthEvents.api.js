import axiosClient from './axiosClient';

export const addHealthEventApi = async (tagId, data) => {
  const response = await axiosClient.post(`/api/cows/${tagId}/health-events`, data);
  return response.data;
};

export const getHealthEventsByCowApi = async (tagId) => {
  const response = await axiosClient.get(`/api/cows/${tagId}/health-events`);
  return response.data;
};
