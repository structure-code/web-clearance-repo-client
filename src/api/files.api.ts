import { apiClient } from './axios';
import { ApiResponse, Document } from '../types';

export const uploadFile = async (file: File): Promise<ApiResponse<Document>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await apiClient.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
};
