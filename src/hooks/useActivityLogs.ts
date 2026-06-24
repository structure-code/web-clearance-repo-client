import { useQuery } from '@tanstack/react-query';
import { getActivityLogs } from '../api/activity-logs.api';

export const useActivityLogs = () => {
  return useQuery({
    queryKey: ['activity-logs'],
    queryFn: getActivityLogs,
  });
};
