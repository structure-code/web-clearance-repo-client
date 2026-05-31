import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth.api';

export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 mins
  });
};
