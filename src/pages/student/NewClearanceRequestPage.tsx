import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { createClearanceRequestSchema } from '../../validations/schemas';
import { useCreateClearanceRequest } from '../../hooks/useClearanceRequests';
import { useUploadFile } from '../../hooks/useUploadFile';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormMessage } from '../../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';
import { useActiveDepartments } from '@/hooks/useDepartments';
import type { Document } from '../../types';

export default function NewClearanceRequestPage() {
  const navigate = useNavigate();
  const createReq = useCreateClearanceRequest();
  const uploadFile = useUploadFile();
  // Documents keyed by departmentId. A clearance request is opened with every
  // active department at once; attaching a document here is optional and only
  // applies to that specific department's request.
  const [documentsByDept, setDocumentsByDept] = useState<Record<string, Document[]>>({});
  const [uploadingDeptId, setUploadingDeptId] = useState<string | null>(null);

  const { data: departments = [] } = useActiveDepartments();

  const form = useForm({
    resolver: zodResolver(createClearanceRequestSchema),
    defaultValues: {
      submissions: [],
    },
  });

  const handleFileUpload = async (deptId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDeptId(deptId);
    try {
      const res = await uploadFile.mutateAsync(file);
      setDocumentsByDept(prev => ({
        ...prev,
        [deptId]: [...(prev[deptId] || []), res],
      }));
      toast.success('File uploaded successfully');
    } catch (err: any) {
      toast.error('Failed to upload file');
    } finally {
      setUploadingDeptId(null);
      e.target.value = '';
    }
  };

  const removeDoc = (deptId: string, index: number) => {
    setDocumentsByDept(prev => {
      const next = [...(prev[deptId] || [])];
      next.splice(index, 1);
      return { ...prev, [deptId]: next };
    });
  };

  const onSubmit = async () => {
    const submissions = Object.entries(documentsByDept)
      .filter(([, docs]) => docs.length > 0)
      .map(([departmentId, documents]) => ({ departmentId, documents }));

    try {
      await createReq.mutateAsync({ submissions });
      toast.success('Clearance requests submitted successfully');
      navigate('/student/requests');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="New Clearance Request"
        description="Submitting will open a clearance request with every active department. Attach a document below for any department that needs one."
      />

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {Array.isArray(departments) && departments.length > 0 ? (
                <div className="space-y-4">
                  {departments.map(dept => {
                    const docs = documentsByDept[dept.id] || [];
                    return (
                      <Card key={dept.id} className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Label className="text-xs text-muted-foreground">
                            Supporting document (optional)
                          </Label>
                          <div className="flex items-center gap-3">
                            <Input
                              type="file"
                              className="hidden"
                              id={`file-upload-${dept.id}`}
                              onChange={e => handleFileUpload(dept.id, e)}
                              disabled={uploadingDeptId === dept.id}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`file-upload-${dept.id}`)?.click()}
                              disabled={uploadingDeptId === dept.id}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadingDeptId === dept.id ? 'Uploading...' : 'Attach File'}
                            </Button>
                          </div>

                          {docs.length > 0 && (
                            <div className="space-y-2">
                              {docs.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                                  <div className="flex items-center space-x-2 overflow-hidden">
                                    <FileIcon className="h-4 w-4 text-primary shrink-0" />
                                    <div className="truncate">
                                      <p className="text-xs font-medium truncate">{doc.fileName}</p>
                                      <p className="text-xs text-muted-foreground">{formatFileSize(doc.fileSize)}</p>
                                    </div>
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDoc(dept.id, idx)}>
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active departments are accepting clearance requests right now.</p>
              )}

              <FormField
                control={form.control}
                name="submissions"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" disabled={createReq.isPending || departments.length === 0}>
                  {createReq.isPending ? 'Submitting...' : 'Submit Clearance Requests'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
