import { apiClient } from './axios';
import { CreateProgramDto, Program, UpdateProgramDto } from '../types';
import { unwrapData } from './response';

export const getPrograms = async (): Promise<Program[]> => {
  const { data } = await apiClient.get('/programs');
  return unwrapData<Program[]>(data);
};

export const getActivePrograms = async (): Promise<Program[]> => {
  const { data } = await apiClient.get('/programs/active');
  return unwrapData<Program[]>(data);
};

export const getProgramById = async (id: string): Promise<Program> => {
  const { data } = await apiClient.get(`/programs/${id}`);
  return unwrapData<Program>(data);
};

export const createProgram = async (programData: CreateProgramDto): Promise<Program> => {
  const { data } = await apiClient.post('/programs', programData);
  return unwrapData<Program>(data);
};

export const updateProgram = async (id: string, programData: UpdateProgramDto): Promise<Program> => {
  const { data } = await apiClient.patch(`/programs/${id}`, programData);
  return unwrapData<Program>(data);
};

export const deleteProgram = async (id: string): Promise<void> => {
  await apiClient.delete(`/programs/${id}`);
};
