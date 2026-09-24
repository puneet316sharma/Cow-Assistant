import axiosClient from './axiosClient';

export const analyzeSymptomsApi = async (tagId, symptomsText) => {
  const response = await axiosClient.post(`/api/cows/${tagId}/ai-assistant`, { symptomsText });
  return response.data;
};
