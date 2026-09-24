import axiosClient from './axiosClient';

export const addVaccinationApi = async (tagId, data) => {
  const response = await axiosClient.post(`/api/cows/${tagId}/vaccinations`, data);
  return response.data;
};

export const getVaccinationsByCowApi = async (tagId) => {
  const response = await axiosClient.get(`/api/cows/${tagId}/vaccinations`);
  return response.data;
};

export const getDueVaccinationsApi = async () => {
  const response = await axiosClient.get('/api/vaccinations/due');
  return response.data;
};
