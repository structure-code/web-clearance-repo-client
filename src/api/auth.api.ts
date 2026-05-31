import { apiClient } from './axios';
import { LoginCredentials, User, ApiResponse } from '../types';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const register = async (userData: any): Promise<User> => {
  const { data } = await apiClient.post('/auth/register', userData);
  return data;
};

export const logout = async (): Promise<null> => {
  const { data } = await apiClient.post('/auth/logout');
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};

export const forgotPassword = async (email: string): Promise<null> => {
  const { data } = await apiClient.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (payload: any): Promise<null> => {
  const { data } = await apiClient.post('/auth/reset-password', payload);
  return data;
};
