import { useQuery } from '@tanstack/react-query';
import { getApiGreeting } from '../api/app.api';

export const useApiStatus = () => {
  return useQuery({
    queryKey: ['api-status'],
    queryFn: getApiGreeting,
    staleTime: 5 * 60 * 1000,
  });
};
