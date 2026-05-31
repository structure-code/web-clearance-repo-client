import { apiClient } from './axios';
import { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/users');
  return data;
};

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
};

export const createUser = async (userData: any): Promise<User> => {
  const { data } = await apiClient.post('/users', userData);
  return data;
};

export const updateUser = async (id: string, userData: any): Promise<User> => {
  const { data } = await apiClient.patch(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id: string): Promise<null> => {
  const { data } = await apiClient.delete(`/users/${id}`);
  return data;
};
