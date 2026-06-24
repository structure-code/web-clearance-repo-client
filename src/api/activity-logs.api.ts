import { ActivityLog } from '../types';
import { apiClient } from './axios';
import { unwrapData } from './response';

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  const { data } = await apiClient.get('/activity-logs');
  return unwrapData<ActivityLog[]>(data);
};
