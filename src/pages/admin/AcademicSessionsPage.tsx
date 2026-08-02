import React, { useState, useEffect } from 'react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

import {
  useAcademicSessions,
  useCreateAcademicSession,
  useUpdateAcademicSession,
  useDeleteAcademicSession,
} from '../../hooks/useAcademicSessions';
import { createAcademicSessionSchema } from '../../validations/schemas';
import type { AcademicSession } from '@/types';

export default function AcademicSessionsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: sessions = [], isLoading } = useAcademicSessions();

  const form = useForm({
    resolver: zodResolver(createAcademicSessionSchema),
    defaultValues: { name: '', isActive: true },
  });

  const { errors } = form.formState;

  useEffect(() => {
    if (editingSession) {
      form.reset({ name: editingSession.name, isActive: editingSession.isActive ?? true });
    } else {
      form.reset({ name: '', isActive: true });
    }
  }, [editingSession, form]);

  const createMut = useCreateAcademicSession();
  const updateMut = useUpdateAcademicSession();
  const deleteMut = useDeleteAcademicSession();

  const onSubmit = async (values: any) => {
    try {
      if (editingSession) {
        await updateMut.mutateAsync({ id: editingSession.id, data: values });
        toast.success('Academic session updated successfully');
      } else {
        const { isActive, ...createPayload } = values;
        await createMut.mutateAsync(createPayload);
        toast.success('Academic session created successfully');
      }
      setIsOpen(false);
      setEditingSession(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save academic session');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMut.mutateAsync(deleteId);
      toast.success('Academic session deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete academic session');
    } finally {
      setDeleteId(null);
    }
  };

  const handleEditClick = (session: AcademicSession) => {
    setEditingSession(session);
    setIsOpen(true);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) setEditingSession(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Sessions"
        description="Manage the academic sessions students submit clearance requests and receive certificates under."
      >
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSession(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>{editingSession ? 'Edit Academic Session' : 'Create New Academic Session'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">Session Name</label>
                <Input id="name" placeholder="e.g. 2025/2026" {...form.register('name')} />
                {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message as string}</p>}
              </div>

              {editingSession && (
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <input
                    id="isActive"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                    {...form.register('isActive')}
                  />
                  <div className="space-y-1 leading-none">
                    <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Active Status</label>
                    <p className="text-xs text-muted-foreground">
                      Only active sessions can be selected by students when starting a clearance request or viewing a certificate.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                  {createMut.isPending || updateMut.isPending ? 'Saving...' : editingSession ? 'Update Session' : 'Create Session'}
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
                <TableHead>Session</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : sessions.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">No academic sessions found.</TableCell></TableRow>
              ) : (
                sessions.map((s: AcademicSession, i: number) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${s.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(s)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(s.id)} className="text-destructive">
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
              This will permanently delete the academic session. Sessions with existing clearance requests or certificates can't be deleted — deactivate them instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMut.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
