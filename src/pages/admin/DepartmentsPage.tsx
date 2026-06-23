import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, MoreVertical, Edit, Trash, UserPlus } from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

import { getDepartments, createDepartment, updateDepartment, deleteDepartment, assignOfficerToDepartment } from '../../api/departments.api';
import { useUsers } from "@/hooks/useUsers"; // Reusing your existing hooks to get available users
import { createDepartmentSchema } from '../../validations/schemas';
import type { Department } from "@/types/department";
import type { User } from "@/types";

export default function DepartmentsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [assignDept, setAssignDept] = useState<Department | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  const queryClient = useQueryClient();

  // Queries
  const { data: departments = [], isLoading } = useQuery({ queryKey: ['departments'], queryFn: getDepartments });
  const { data: users = [] } = useUsers();

  // Filter users down to only show available department officers
  const eligibleOfficers = users.filter((u: User) => u.role === 'DEPARTMENT_OFFICER');

  const form = useForm({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: { name: '', code: '', isActive: true },
  });

  const { errors } = form.formState;

  useEffect(() => {
    if (editingDept) {
      form.reset({
        name: editingDept.name,
        code: editingDept.code,
        isActive: editingDept.isActive ?? true,
      });
    } else {
      form.reset({ name: '', code: '', isActive: true });
    }
  }, [editingDept, form]);

  // Mutations
  const createMut = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department updated successfully');
      setIsOpen(false);
      setEditingDept(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update department');
    }
  });

  const assignOfficerMut = useMutation({
    mutationFn: ({ deptId, userId }: { deptId: string; userId: string }) => 
      assignOfficerToDepartment(deptId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Officer assigned successfully');
      setIsAssignOpen(false);
      setSelectedUserId('');
      setAssignDept(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to assign officer');
    }
  });

  const deleteMut = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted successfully');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete department');
    }
  });

  const onSubmit = (values: any) => {
    if (editingDept) {
      updateMut.mutate({ id: editingDept.id, data: values });
    } else {
      const { isActive, ...createPayload } = values;
      createMut.mutate(createPayload);
    }
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignDept || !selectedUserId) {
      toast.error('Please select an officer');
      return;
    }
    assignOfficerMut.mutate({ deptId: assignDept.id, userId: selectedUserId });
  };

  const handleEditClick = (dept: Department) => {
    setEditingDept(dept);
    setIsOpen(true);
  };

  const handleAssignClick = (dept: Department) => {
    setAssignDept(dept);
    setIsAssignOpen(true);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) setEditingDept(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Departments" description="Manage academic and administrative departments requiring clearance.">
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDept(null)}><Plus className="mr-2 h-4 w-4" /> Add Department</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>{editingDept ? 'Edit Department' : 'Create New Department'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">Department Name</label>
                <Input id="name" placeholder="e.g. Computer Science" {...form.register('name')} />
                {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium leading-none">Code</label>
                <Input id="code" placeholder="e.g. CSC" {...form.register('code')} />
                {errors.code && <p className="text-sm font-medium text-destructive">{errors.code.message as string}</p>}
              </div>
              
              {editingDept && (
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <input
                    id="isActive"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                    {...form.register('isActive')}
                  />
                  <div className="space-y-1 leading-none">
                    <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Active Status</label>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                  {createMut.isPending || updateMut.isPending ? 'Saving...' : editingDept ? 'Update Department' : 'Create Department'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Assign Officer Dialog Popup */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Officer to {assignDept?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label htmlFor="officerSelect" className="text-sm font-medium leading-none">
                Select Department Officer
              </label>
              <select
                id="officerSelect"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Choose an Officer --</option>
                {eligibleOfficers.map((u: User) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {eligibleOfficers.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  No unassigned users found with the "Department Officer" role.
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAssignOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={assignOfficerMut.isPending || !selectedUserId}>
                {assignOfficerMut.isPending ? 'Assigning...' : 'Assign Officer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S/N</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Users Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : departments?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">No departments found.</TableCell></TableRow>
              ) : (
                Array.isArray(departments) && departments.map((d: Department, i: number) => (
                  <TableRow key={d.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{d.code}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.users?.length || 0}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${d.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {d.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAssignClick(d)}>
                            <UserPlus className="mr-2 h-4 w-4" /> Assign Officer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(d)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(d.id)} className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department. Requests associated with this department might be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMut.mutate(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMut.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}