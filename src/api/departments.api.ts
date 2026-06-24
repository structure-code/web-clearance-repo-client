import { apiClient } from './axios';
import {
  AssignOfficerDto,
  CreateDepartmentDto,
  Department,
  UpdateDepartmentDto,
} from "@/types/department";
import { unwrapData } from './response';

export const getDepartments = async (): Promise<Department[]> => {
  const { data } = await apiClient.get('/departments');
  return unwrapData<Department[]>(data);
};

export const getActiveDepartments = async (): Promise<Department[]> => {
  const { data } = await apiClient.get('/departments/active');
  return unwrapData<Department[]>(data);
};

export const getDepartmentById = async (id: string): Promise<Department> => {
  const { data } = await apiClient.get(`/departments/${id}`);
  return unwrapData<Department>(data);
};

export const createDepartment = async (departmentData: CreateDepartmentDto): Promise<Department> => {
  const { data } = await apiClient.post('/departments', departmentData);
  return unwrapData<Department>(data);
};

export const updateDepartment = async (id: string, departmentData: UpdateDepartmentDto): Promise<Department> => {
  const { data } = await apiClient.patch(`/departments/${id}`, departmentData);
  return unwrapData<Department>(data);
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await apiClient.delete(`/departments/${id}`);
};

export const assignOfficerToDepartment = async (
  id: string,
  userId: AssignOfficerDto['userId'],
): Promise<Department> => {
  const { data } = await apiClient.post(`/departments/${id}/officers`, { userId });
  return unwrapData<Department>(data);
};
