import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClearanceRequests,
  getClearanceRequestById,
  createClearanceRequest,
  approveClearanceRequest,
  rejectClearanceRequest
} from '../api/clearance.api';

export const useClearanceRequests = () => {
  return useQuery({
    queryKey: ['clearance-requests'],
    queryFn: getClearanceRequests,
  });
};

export const useClearanceRequest = (id: string) => {
  return useQuery({
    queryKey: ['clearance-requests', id],
    queryFn: () => getClearanceRequestById(id),
    enabled: !!id,
  });
};

export const useCreateClearanceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClearanceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clearance-requests'] });
    },
  });
};

export const useApproveClearanceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) => approveClearanceRequest(id, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clearance-requests'] });
      queryClient.invalidateQueries({ queryKey: ['clearance-requests', variables.id] });
    },
  });
};

export const useRejectClearanceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) => rejectClearanceRequest(id, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clearance-requests'] });
      queryClient.invalidateQueries({ queryKey: ['clearance-requests', variables.id] });
    },
  });
};
