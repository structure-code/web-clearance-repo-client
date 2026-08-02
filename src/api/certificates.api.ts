import { Certificate } from '../types';
import { apiClient } from './axios';
import { unwrapData } from './response';

export const getMyCertificate = async (academicSessionId: string): Promise<Certificate | null> => {
  const { data } = await apiClient.get('/certificates/mine', { params: { academicSessionId } });
  return unwrapData<Certificate | null>(data);
};

export const verifyCertificate = async (token: string): Promise<Certificate> => {
  const { data } = await apiClient.get(`/certificates/verify/${token}`);
  return unwrapData<Certificate>(data);
};
