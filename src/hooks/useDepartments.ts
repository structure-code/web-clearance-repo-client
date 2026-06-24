import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  assignOfficerToDepartment,
  createDepartment,
  deleteDepartment,
  getActiveDepartments,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from '../api/departments.api';
import type { CreateDepartmentDto, UpdateDepartmentDto } from '../types/department';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
};

export const useActiveDepartments = () => {
  return useQuery({
    queryKey: ['departments', 'active'],
    queryFn: getActiveDepartments,
  });
};

export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: ['departments', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepartmentDto) => createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentDto }) =>
      updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useAssignOfficerToDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentId, userId }: { departmentId: string; userId: string }) =>
      assignOfficerToDepartment(departmentId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments', variables.departmentId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
