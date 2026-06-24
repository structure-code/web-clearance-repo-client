import { apiClient } from './axios';
import { Document } from '../types';
import { unwrapData } from './response';

export const uploadFile = async (file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await apiClient.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return unwrapData<Document>(data);
};
