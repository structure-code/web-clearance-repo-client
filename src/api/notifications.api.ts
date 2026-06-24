import { Notification } from '../types';
import { apiClient } from './axios';
import { unwrapData } from './response';

export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await apiClient.get('/notifications');
  return unwrapData<Notification[]>(data);
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const { data } = await apiClient.patch(`/notifications/${id}/read`);
  return unwrapData<Notification>(data);
};
