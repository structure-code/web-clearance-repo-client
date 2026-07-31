import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClearanceRequests,
  getClearanceRequestById,
  createClearanceRequest,
  approveClearanceRequest,
  rejectClearanceRequest,
  completeClearanceRequest
} from '../api/clearance.api';
import type { CreateClearanceRequestDto } from '../types';

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
    mutationFn: (data: CreateClearanceRequestDto) => createClearanceRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clearance-requests'] });
    },
  });
};

export const useApproveClearanceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks?: string }) => approveClearanceRequest(id, remarks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clearance-requests'] });
      queryClient.invalidateQueries({ queryKey: ['clearance-requests', variables.id] });
    },
  });
};

export const useRejectClearanceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) => rejectClearanceRequest(id, remarks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clearance-requests'] });
      queryClient.invalidateQueries({ queryKey: ['clearance-requests', variables.id] });
    },
  });
};

export const useCompleteClearanceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeClearanceRequest,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['clearance-requests'] });
      queryClient.invalidateQueries({ queryKey: ['clearance-requests', id] });
    },
  });
};
