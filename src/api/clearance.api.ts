import { apiClient } from './axios';
import {
  ClearanceRequest,
  CreateClearanceRequestDto,
  UpdateClearanceStatusDto,
} from '../types';
import { unwrapData } from './response';

export const getClearanceRequests = async (): Promise<ClearanceRequest[]> => {
  const { data } = await apiClient.get('/clearance-requests');
  return unwrapData<ClearanceRequest[]>(data);
};

export const getClearanceRequestById = async (id: string): Promise<ClearanceRequest> => {
  const { data } = await apiClient.get(`/clearance-requests/${id}`);
  return unwrapData<ClearanceRequest>(data);
};

export const createClearanceRequest = async (
  requestData: CreateClearanceRequestDto,
): Promise<ClearanceRequest> => {
  const { data } = await apiClient.post('/clearance-requests', requestData);
  return unwrapData<ClearanceRequest>(data);
};

export const approveClearanceRequest = async (
  id: string,
  remarks?: UpdateClearanceStatusDto['remarks'],
): Promise<ClearanceRequest> => {
  const payload: UpdateClearanceStatusDto = remarks ? { remarks } : {};
  const { data } = await apiClient.patch(`/clearance-requests/${id}/approve`, payload);
  return unwrapData<ClearanceRequest>(data);
};

export const rejectClearanceRequest = async (
  id: string,
  remarks: string,
): Promise<ClearanceRequest> => {
  const { data } = await apiClient.patch(`/clearance-requests/${id}/reject`, { remarks });
  return unwrapData<ClearanceRequest>(data);
};

export const completeClearanceRequest = async (id: string): Promise<ClearanceRequest> => {
  const { data } = await apiClient.patch(`/clearance-requests/${id}/complete`);
  return unwrapData<ClearanceRequest>(data);
};
