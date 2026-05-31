import { apiClient } from './axios';
import { ClearanceRequest, ApiResponse } from '../types';

export const getClearanceRequests = async (): Promise<ApiResponse<ClearanceRequest[]>> => {
  const { data } = await apiClient.get('/clearance-requests');
  return data;
};

export const getClearanceRequestById = async (id: string): Promise<ApiResponse<ClearanceRequest>> => {
  const { data } = await apiClient.get(`/clearance-requests/${id}`);
  return data;
};

export const createClearanceRequest = async (requestData: any): Promise<ApiResponse<ClearanceRequest>> => {
  const { data } = await apiClient.post('/clearance-requests', requestData);
  return data;
};

export const approveClearanceRequest = async (id: string, comment?: string): Promise<ApiResponse<ClearanceRequest>> => {
  const { data } = await apiClient.patch(`/clearance-requests/${id}/approve`, { comment });
  return data;
};

export const rejectClearanceRequest = async (id: string, comment: string): Promise<ApiResponse<ClearanceRequest>> => {
  const { data } = await apiClient.patch(`/clearance-requests/${id}/reject`, { comment });
  return data;
};
