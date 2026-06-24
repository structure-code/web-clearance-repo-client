import { apiClient } from './axios';
import { CreateUserDto, UpdateUserDto, User } from '../types';
import { unwrapData } from './response';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/users');
  return unwrapData<User[]>(data);
};

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await apiClient.get(`/users/${id}`);
  return unwrapData<User>(data);
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const { data } = await apiClient.post('/users', userData);
  return unwrapData<User>(data);
};

export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
  const { data } = await apiClient.patch(`/users/${id}`, userData);
  return unwrapData<User>(data);
};

export const deleteUser = async (id: string): Promise<null> => {
  const { data } = await apiClient.delete(`/users/${id}`);
  return unwrapData<null>(data);
};
