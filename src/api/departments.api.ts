import { apiClient } from './axios';
import { Department, ApiResponse } from '../types';

export const getDepartments = async (): Promise<ApiResponse<Department[]>> => {
  const { data } = await apiClient.get('/departments');
  return data;
};

export const getDepartmentById = async (id: string): Promise<ApiResponse<Department>> => {
  const { data } = await apiClient.get(`/departments/${id}`);
  return data;
};

export const createDepartment = async (departmentData: any): Promise<ApiResponse<Department>> => {
  const { data } = await apiClient.post('/departments', departmentData);
  return data;
};

export const updateDepartment = async (id: string, departmentData: any): Promise<ApiResponse<Department>> => {
  const { data } = await apiClient.patch(`/departments/${id}`, departmentData);
  return data;
};

export const deleteDepartment = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/departments/${id}`);
  return data;
};

export const assignOfficer = async (id: string, userId: string): Promise<ApiResponse<Department>> => {
  const { data } = await apiClient.post(`/departments/${id}/officers`, { userId });
  return data;
};
