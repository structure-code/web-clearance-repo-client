import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProgram,
  deleteProgram,
  getActivePrograms,
  getProgramById,
  getPrograms,
  updateProgram,
} from '../api/programs.api';
import type { CreateProgramDto, UpdateProgramDto } from '../types';

export const usePrograms = () => {
  return useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms,
  });
};

export const useActivePrograms = () => {
  return useQuery({
    queryKey: ['programs', 'active'],
    queryFn: getActivePrograms,
  });
};

export const useProgram = (id: string) => {
  return useQuery({
    queryKey: ['programs', id],
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProgramDto) => createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProgramDto }) =>
      updateProgram(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
};
