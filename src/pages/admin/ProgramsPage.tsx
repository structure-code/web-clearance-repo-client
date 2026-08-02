import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, MoreVertical, Edit, Trash } from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

import { getPrograms, createProgram, updateProgram, deleteProgram } from '../../api/programs.api';
import { getFaculties } from '../../api/faculties.api';
import { createProgramSchema } from '../../validations/schemas';
import type { Program, Faculty } from "@/types";

export default function ProgramsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Queries
  const { data: programs = [], isLoading } = useQuery({ queryKey: ['programs'], queryFn: getPrograms });
  const { data: faculties = [] } = useQuery({ queryKey: ['faculties'], queryFn: getFaculties });

  const form = useForm({
    resolver: zodResolver(createProgramSchema),
    defaultValues: { name: '', code: '', facultyId: '', isActive: true },
  });

  const { errors } = form.formState;

  useEffect(() => {
    if (editingProgram) {
      form.reset({
        name: editingProgram.name,
        code: editingProgram.code,
        facultyId: editingProgram.facultyId,
        isActive: editingProgram.isActive ?? true,
      });
    } else {
      form.reset({ name: '', code: '', facultyId: '', isActive: true });
    }
  }, [editingProgram, form]);

  // Mutations
  const createMut = useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program created successfully');
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create program');
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProgram(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program updated successfully');
      setIsOpen(false);
      setEditingProgram(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update program');
    }
  });

  const deleteMut = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Program deleted successfully');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete program');
    }
  });

  const onSubmit = (values: any) => {
    if (editingProgram) {
      updateMut.mutate({ id: editingProgram.id, data: values });
    } else {
      const { isActive, ...createPayload } = values;
      createMut.mutate(createPayload);
    }
  };

  const handleEditClick = (program: Program) => {
    setEditingProgram(program);
    setIsOpen(true);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) setEditingProgram(null);
  };

  const facultyName = (facultyId: string) =>
    Array.isArray(faculties) ? faculties.find((f: Faculty) => f.id === facultyId)?.name : undefined;

  return (
    <div className="space-y-6">
      <PageHeader title="Programs" description="Manage academic programs students register under.">
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProgram(null)}><Plus className="mr-2 h-4 w-4" /> Add Program</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>{editingProgram ? 'Edit Program' : 'Create New Program'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">Program Name</label>
                <Input id="name" placeholder="e.g. Computer Science" {...form.register('name')} />
                {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium leading-none">Code</label>
                <Input id="code" placeholder="e.g. CSC" {...form.register('code')} />
                {errors.code && <p className="text-sm font-medium text-destructive">{errors.code.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Faculty</label>
                <Select
                  onValueChange={(value) => form.setValue('facultyId', value, { shouldValidate: true })}
                  value={form.watch('facultyId')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(faculties) && faculties.map((f: Faculty) => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.facultyId && <p className="text-sm font-medium text-destructive">{errors.facultyId.message as string}</p>}
              </div>

              {editingProgram && (
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
                  {createMut.isPending || updateMut.isPending ? 'Saving...' : editingProgram ? 'Update Program' : 'Create Program'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S/N</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : programs?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">No programs found.</TableCell></TableRow>
              ) : (
                Array.isArray(programs) && programs.map((p: Program, i: number) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{p.faculty?.name || facultyName(p.facultyId) || '—'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${p.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(p)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(p.id)} className="text-destructive">
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
              This will permanently delete the program. Students registered under it might be affected.
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
