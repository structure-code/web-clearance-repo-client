import { apiClient } from './axios';
import {
  AcademicSession,
  CreateAcademicSessionDto,
  UpdateAcademicSessionDto,
} from '../types';
import { unwrapData } from './response';

export const getAcademicSessions = async (): Promise<AcademicSession[]> => {
  const { data } = await apiClient.get('/academic-sessions');
  return unwrapData<AcademicSession[]>(data);
};

export const getActiveAcademicSessions = async (): Promise<AcademicSession[]> => {
  const { data } = await apiClient.get('/academic-sessions/active');
  return unwrapData<AcademicSession[]>(data);
};

export const getAcademicSessionById = async (id: string): Promise<AcademicSession> => {
  const { data } = await apiClient.get(`/academic-sessions/${id}`);
  return unwrapData<AcademicSession>(data);
};

export const createAcademicSession = async (
  sessionData: CreateAcademicSessionDto,
): Promise<AcademicSession> => {
  const { data } = await apiClient.post('/academic-sessions', sessionData);
  return unwrapData<AcademicSession>(data);
};

export const updateAcademicSession = async (
  id: string,
  sessionData: UpdateAcademicSessionDto,
): Promise<AcademicSession> => {
  const { data } = await apiClient.patch(`/academic-sessions/${id}`, sessionData);
  return unwrapData<AcademicSession>(data);
};

export const deleteAcademicSession = async (id: string): Promise<void> => {
  await apiClient.delete(`/academic-sessions/${id}`);
};
