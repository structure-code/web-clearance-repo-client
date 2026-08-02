import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, MoreVertical, Edit, Trash, Shield } from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { RoleBadge } from '../../components/common/RoleBadge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

// Note: Ensure your api file exports an updateUser function
import { createUser, deleteUser, updateUser } from '../../api/users.api';
import { createUserSchema } from '../../validations/schemas';

import { useUsers } from "@/hooks/useUsers";
import { useDepartments } from "@/hooks/useDepartments";
import { useFaculties } from "@/hooks/useFaculties";
import { usePrograms } from "@/hooks/usePrograms";

import type { Department } from "@/types/department";
import type { User } from "@/types";

// Splits a single "full name" string into first/middle/last parts for
// pre-filling the separate name inputs when editing a student user.
function splitFullName(fullName?: string) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", middleName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], middleName: "", lastName: "" };
  if (parts.length === 2) return { firstName: parts[0], middleName: "", lastName: parts[1] };
  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useUsers();
  const { data: departments = [] } = useDepartments();
  const { data: faculties = [] } = useFaculties();
  const { data: programs = [] } = usePrograms();

  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'STUDENT' as any,
      departmentId: 'none',
      programId: 'none',
      facultyId: 'none',
      isActive: true,
    },
  });

  const selectedRole = form.watch('role');
  const watchedFirstName = form.watch('firstName');
  const watchedMiddleName = form.watch('middleName');
  const watchedLastName = form.watch('lastName');

  // Keep the underlying "name" field (used by validation + submit) in sync
  // with the split first/middle/last name inputs whenever role is STUDENT.
  useEffect(() => {
    if (selectedRole === 'STUDENT') {
      const joined = [watchedFirstName, watchedMiddleName, watchedLastName]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(' ');
      form.setValue('name', joined, { shouldValidate: false });
    }
  }, [selectedRole, watchedFirstName, watchedMiddleName, watchedLastName, form]);

  // Handle setting form values when entering Edit mode
  useEffect(() => {
    if (editingUser) {
      const { firstName, middleName, lastName } = splitFullName(editingUser.name);
      form.reset({
        name: editingUser.name,
        firstName,
        middleName,
        lastName,
        email: editingUser.email,
        password: '', // Keep blank during edits unless changing it
        role: editingUser.role as any,
        departmentId: editingUser.departmentId || 'none',
        programId: editingUser.programId || 'none',
        facultyId: editingUser.facultyId || 'none',
        isActive: editingUser.isActive,
      });
    } else {
      form.reset({
        name: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'STUDENT',
        departmentId: 'none',
        programId: 'none',
        facultyId: 'none',
        isActive: true,
      });
    }
  }, [editingUser, form]);

  const createMut = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
      setIsOpen(false);
      setEditingUser(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  });

  const deleteMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });

  const onSubmit = (values: any) => {
    const payload = { ...values };

    if (payload.role === 'STUDENT') {
      payload.name = [payload.firstName, payload.middleName, payload.lastName]
        .map((part: string | undefined) => part?.trim())
        .filter(Boolean)
        .join(' ');
    }
    delete payload.firstName;
    delete payload.middleName;
    delete payload.lastName;

    if (!payload.departmentId || payload.departmentId === "none") {
      delete payload.departmentId;
    }
    if (!payload.programId || payload.programId === "none") {
      delete payload.programId;
    }
    if (!payload.facultyId || payload.facultyId === "none") {
      delete payload.facultyId;
    }

    if (editingUser) {
      if (!payload.password) delete payload.password;
      updateMut.mutate({ id: editingUser.id, data: payload });
    } else {
      if (!payload.password) {
        toast.error('Password is required');
        return;
      }
      delete payload.isActive;
      createMut.mutate(payload);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users Management" description="Manage students, faculty, and administrative users.">
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {selectedRole === 'STUDENT' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField control={form.control} name="firstName" render={({field}) => (
                      <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field}/></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="middleName" render={({field}) => (
                      <FormItem><FormLabel>Middle Name</FormLabel><FormControl><Input placeholder="Optional" {...field}/></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="lastName" render={({field}) => (
                      <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field}/></FormControl><FormMessage/></FormItem>
                    )}/>
                  </div>
                ) : (
                  <FormField control={form.control} name="name" render={({field}) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                  )}/>
                )}
                <FormField control={form.control} name="email" render={({field}) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="password" render={({field}) => (
                  <FormItem>
                    <FormLabel>{editingUser ? 'Password (Leave blank to keep current)' : 'Password'}</FormLabel>
                    <FormControl><Input type="password" {...field}/></FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField control={form.control} name="role" render={({field}) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="DEPARTMENT_OFFICER">Department Officer</SelectItem>
                        <SelectItem value="FACULTY_OFFICER">Faculty Officer</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )}/>
                {selectedRole === 'DEPARTMENT_OFFICER' && (
                  <FormField control={form.control} name="departmentId" render={({field}) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {Array.isArray(departments) && departments.map((d: Department) => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )}/>
                )}
                {selectedRole === 'STUDENT' && (
                  <FormField control={form.control} name="programId" render={({field}) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {Array.isArray(programs) && programs.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )}/>
                )}
                {(selectedRole === 'FACULTY_OFFICER' || selectedRole === 'STUDENT') && (
                  <FormField control={form.control} name="facultyId" render={({field}) => (
                    <FormItem>
                      <FormLabel>Faculty (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {Array.isArray(faculties) && faculties.map((f) => (
                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )}/>
                )}
                {editingUser && (
                  <FormField control={form.control} name="isActive" render={({field}) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active Account</FormLabel>
                      </div>
                    </FormItem>
                  )}/>
                )}
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                    {createMut.isPending || updateMut.isPending ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">No users found.</TableCell></TableRow>
              ) : (
                users.map((u: User) => {
                  const userDept = departments.find((d: Department) => d.id === u.departmentId);
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {u.role === 'ADMIN' && <Shield size={14} className="text-primary" />}
                          {u.name}
                        </div>
                      </TableCell>
                      <TableCell>{u.email || u.matricNo || '—'}</TableCell>
                      <TableCell><RoleBadge role={u.role} /></TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {userDept ? userDept.name : '—'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${u.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(u)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteId(u.id)} className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account.
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
