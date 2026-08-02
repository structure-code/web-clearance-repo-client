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
import { Textarea } from '../../components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';

import { getFaculties, createFaculty, updateFaculty, deleteFaculty, assignOfficerToFaculty } from '../../api/faculties.api';
import { useUsers } from "@/hooks/useUsers"; // Reusing existing hook to get available users
import { createFacultySchema } from '../../validations/schemas';
import type { Faculty, User } from "@/types";

export default function FacultiesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [assignFaculty, setAssignFaculty] = useState<Faculty | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const queryClient = useQueryClient();

  // Queries
  const { data: faculties = [], isLoading } = useQuery({ queryKey: ['faculties'], queryFn: getFaculties });
  const { data: users = [] } = useUsers();

  // Filter users down to only show available faculty officers
  const eligibleOfficers = users.filter((u: User) => u.role === 'FACULTY_OFFICER');

  const form = useForm({
    resolver: zodResolver(createFacultySchema),
    defaultValues: { name: '', code: '', isActive: true, requiresDocument: false, requiredDocumentDescription: '' },
  });

  const { errors } = form.formState;
  const requiresDocument = form.watch('requiresDocument');

  useEffect(() => {
    if (editingFaculty) {
      form.reset({
        name: editingFaculty.name,
        code: editingFaculty.code,
        isActive: editingFaculty.isActive ?? true,
        requiresDocument: editingFaculty.requiresDocument ?? false,
        requiredDocumentDescription: editingFaculty.requiredDocumentDescription ?? '',
      });
    } else {
      form.reset({ name: '', code: '', isActive: true, requiresDocument: false, requiredDocumentDescription: '' });
    }
  }, [editingFaculty, form]);

  // Mutations
  const createMut = useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      toast.success('Faculty created successfully');
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create faculty');
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateFaculty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      toast.success('Faculty updated successfully');
      setIsOpen(false);
      setEditingFaculty(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update faculty');
    }
  });

  const assignOfficerMut = useMutation({
    mutationFn: ({ facultyId, userId }: { facultyId: string; userId: string }) =>
      assignOfficerToFaculty(facultyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Officer assigned successfully');
      setIsAssignOpen(false);
      setSelectedUserId('');
      setAssignFaculty(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to assign officer');
    }
  });

  const deleteMut = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      toast.success('Faculty deleted successfully');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete faculty');
    }
  });

  const onSubmit = (values: any) => {
    if (editingFaculty) {
      updateMut.mutate({ id: editingFaculty.id, data: values });
    } else {
      const { isActive, ...createPayload } = values;
      createMut.mutate(createPayload);
    }
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignFaculty || !selectedUserId) {
      toast.error('Please select an officer');
      return;
    }
    assignOfficerMut.mutate({ facultyId: assignFaculty.id, userId: selectedUserId });
  };

  const handleEditClick = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setIsOpen(true);
  };

  const handleAssignClick = (faculty: Faculty) => {
    setAssignFaculty(faculty);
    setIsAssignOpen(true);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) setEditingFaculty(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Faculties" description="Manage faculties that oversee programs and issue clearance.">
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingFaculty(null)}><Plus className="mr-2 h-4 w-4" /> Add Faculty</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'Create New Faculty'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">Faculty Name</label>
                <Input id="name" placeholder="e.g. Science" {...form.register('name')} />
                {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium leading-none">Code</label>
                <Input id="code" placeholder="e.g. FSC" {...form.register('code')} />
                {errors.code && <p className="text-sm font-medium text-destructive">{errors.code.message as string}</p>}
              </div>

              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <input
                  id="requiresDocument"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                  {...form.register('requiresDocument')}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="requiresDocument" className="text-sm font-medium cursor-pointer">Requires supporting document</label>
                  <p className="text-xs text-muted-foreground">Students must attach a document when requesting clearance from this faculty.</p>
                </div>
              </div>

              {requiresDocument && (
                <div className="space-y-2">
                  <label htmlFor="requiredDocumentDescription" className="text-sm font-medium leading-none">What document is needed?</label>
                  <Textarea
                    id="requiredDocumentDescription"
                    placeholder="e.g. Upload your signed faculty clearance slip"
                    {...form.register('requiredDocumentDescription')}
                  />
                  {errors.requiredDocumentDescription && (
                    <p className="text-sm font-medium text-destructive">{errors.requiredDocumentDescription.message as string}</p>
                  )}
                </div>
              )}

              {editingFaculty && (
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
                  {createMut.isPending || updateMut.isPending ? 'Saving...' : editingFaculty ? 'Update Faculty' : 'Create Faculty'}
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
            <DialogTitle>Assign Officer to {assignFaculty?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label htmlFor="officerSelect" className="text-sm font-medium leading-none">
                Select Faculty Officer
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
                  No unassigned users found with the "Faculty Officer" role.
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
                <TableHead>Programs</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : faculties?.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">No faculties found.</TableCell></TableRow>
              ) : (
                Array.isArray(faculties) && faculties.map((f: Faculty, i: number) => (
                  <TableRow key={f.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{f.code}</TableCell>
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{f.programs?.length || 0}</TableCell>
                    <TableCell>
                      {f.requiresDocument ? (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-sky-500/10 text-sky-600">Required</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Optional</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${f.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                        {f.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAssignClick(f)}>
                            <UserPlus className="mr-2 h-4 w-4" /> Assign Officer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(f)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(f.id)} className="text-destructive">
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
              This will permanently delete the faculty. Programs and requests associated with this faculty might be affected.
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
