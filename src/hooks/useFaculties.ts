import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  assignOfficerToFaculty,
  createFaculty,
  deleteFaculty,
  getActiveFaculties,
  getFacultyById,
  getFaculties,
  updateFaculty,
} from '../api/faculties.api';
import type { CreateFacultyDto, UpdateFacultyDto } from '../types';

export const useFaculties = () => {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  });
};

export const useActiveFaculties = () => {
  return useQuery({
    queryKey: ['faculties', 'active'],
    queryFn: getActiveFaculties,
  });
};

export const useFaculty = (id: string) => {
  return useQuery({
    queryKey: ['faculties', id],
    queryFn: () => getFacultyById(id),
    enabled: !!id,
  });
};

export const useCreateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFacultyDto) => createFaculty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },
  });
};

export const useUpdateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFacultyDto }) =>
      updateFaculty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },
  });
};

export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },
  });
};

export const useAssignOfficerToFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ facultyId, userId }: { facultyId: string; userId: string }) =>
      assignOfficerToFaculty(facultyId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      queryClient.invalidateQueries({ queryKey: ['faculties', variables.facultyId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
