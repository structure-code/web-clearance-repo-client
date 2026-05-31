import { apiClient } from './axios';
import { Department } from "@/types/department";

export const getDepartments = async (): Promise<Department[]> => {
  const { data } = await apiClient.get('/departments');
  return data;
};

export const getDepartmentById = async (id: string): Promise<Department> => {
  const { data } = await apiClient.get(`/departments/${id}`);
  return data;
};

export const createDepartment = async (departmentData: any): Promise<Department> => {
  const { data } = await apiClient.post('/departments', departmentData);
  return data;
};

export const updateDepartment = async (id: string, departmentData: any): Promise<Department> => {
  const { data } = await apiClient.patch(`/departments/${id}`, departmentData);
  return data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  return await apiClient.delete(`/departments/${id}`);
};

export const assignOfficer = async (id: string, userId: string): Promise<Department> => {
  const { data } = await apiClient.post(`/departments/${id}/officers`, { userId });
  return data;
};
