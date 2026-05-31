import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, MoreVertical, Trash } from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

import { getDepartments, createDepartment, deleteDepartment } from '../../api/departments.api';
import { createDepartmentSchema } from '../../validations/schemas';
import type { Department  } from "@/types/department";

export default function DepartmentsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({ queryKey: ['departments'], queryFn: getDepartments });

  const createMut = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
      setIsCreateOpen(false);
      form.reset();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create department');
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

  const form = useForm({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: { name: '', code: '' },
  });

  const onSubmit = (values: any) => {
    createMut.mutate(values);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Departments" description="Manage academic and administrative departments requiring clearance.">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Department</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({field}) => (
                  <FormItem><FormLabel>Department Name</FormLabel><FormControl><Input placeholder="e.g. Computer Science" {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="code" render={({field}) => (
                  <FormItem><FormLabel>Code</FormLabel><FormControl><Input placeholder="e.g. CSC" {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={createMut.isPending}>
                    {createMut.isPending ? 'Creating...' : 'Create Department'}
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
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Officers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : departments?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">No departments found.</TableCell></TableRow>
              ) : (
                Array.isArray(departments) && departments.map((d: Department) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.code}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.officers?.length || 0}</TableCell>
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
            <AlertDialogAction onClick={() => deleteId && deleteMut.mutate(deleteId)} className="bg-destructive text-destructive-foreground">
              {deleteMut.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
