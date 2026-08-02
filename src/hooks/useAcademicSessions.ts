import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAcademicSession,
  deleteAcademicSession,
  getAcademicSessionById,
  getAcademicSessions,
  getActiveAcademicSessions,
  updateAcademicSession,
} from '../api/academic-sessions.api';
import type { CreateAcademicSessionDto, UpdateAcademicSessionDto } from '../types';

export const useAcademicSessions = () => {
  return useQuery({
    queryKey: ['academic-sessions'],
    queryFn: getAcademicSessions,
  });
};

export const useActiveAcademicSessions = () => {
  return useQuery({
    queryKey: ['academic-sessions', 'active'],
    queryFn: getActiveAcademicSessions,
  });
};

export const useAcademicSession = (id: string) => {
  return useQuery({
    queryKey: ['academic-sessions', id],
    queryFn: () => getAcademicSessionById(id),
    enabled: !!id,
  });
};

export const useCreateAcademicSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAcademicSessionDto) => createAcademicSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
    },
  });
};

export const useUpdateAcademicSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcademicSessionDto }) =>
      updateAcademicSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
    },
  });
};

export const useDeleteAcademicSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAcademicSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
    },
  });
};
