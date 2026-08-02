import { apiClient } from './axios';
import {
  AssignFacultyOfficerDto,
  CreateFacultyDto,
  Faculty,
  UpdateFacultyDto,
} from '../types';
import { unwrapData } from './response';

export const getFaculties = async (): Promise<Faculty[]> => {
  const { data } = await apiClient.get('/faculties');
  return unwrapData<Faculty[]>(data);
};

export const getActiveFaculties = async (): Promise<Faculty[]> => {
  const { data } = await apiClient.get('/faculties/active');
  return unwrapData<Faculty[]>(data);
};

export const getFacultyById = async (id: string): Promise<Faculty> => {
  const { data } = await apiClient.get(`/faculties/${id}`);
  return unwrapData<Faculty>(data);
};

export const createFaculty = async (facultyData: CreateFacultyDto): Promise<Faculty> => {
  const { data } = await apiClient.post('/faculties', facultyData);
  return unwrapData<Faculty>(data);
};

export const updateFaculty = async (id: string, facultyData: UpdateFacultyDto): Promise<Faculty> => {
  const { data } = await apiClient.patch(`/faculties/${id}`, facultyData);
  return unwrapData<Faculty>(data);
};

export const deleteFaculty = async (id: string): Promise<void> => {
  await apiClient.delete(`/faculties/${id}`);
};

export const assignOfficerToFaculty = async (
  id: string,
  userId: AssignFacultyOfficerDto['userId'],
): Promise<Faculty> => {
  const { data } = await apiClient.post(`/faculties/${id}/assign-officer`, { userId });
  return unwrapData<Faculty>(data);
};
