import axiosClient from './axiosClient';

export const getDashboardSummaryApi = async () => {
  const response = await axiosClient.get('/api/dashboard/summary');
  return response.data;
};
