import { apiClient } from './axios';

export const getApiGreeting = async (): Promise<string> => {
  const { data } = await apiClient.get('');
  return data;
};
