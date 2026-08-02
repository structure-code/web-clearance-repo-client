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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';
import { useActiveDepartments } from '@/hooks/useDepartments';
import { useActiveAcademicSessions } from '@/hooks/useAcademicSessions';
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
  const { data: academicSessions = [] } = useActiveAcademicSessions();

  const missingRequiredDepts = departments.filter(
    dept => dept.requiresDocument && (documentsByDept[dept.id] || []).length === 0,
  );

  const form = useForm({
    resolver: zodResolver(createClearanceRequestSchema),
    defaultValues: {
      academicSessionId: '',
      submissions: [],
    },
  });

  // Auto-select the academic session when only one is currently active.
  React.useEffect(() => {
    if (academicSessions.length === 1 && !form.getValues('academicSessionId')) {
      form.setValue('academicSessionId', academicSessions[0].id, { shouldValidate: true });
    }
  }, [academicSessions, form]);

  const selectedSessionId = form.watch('academicSessionId');

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

  const onSubmit = async (values: { academicSessionId: string }) => {
    const submissions = Object.entries(documentsByDept)
      .filter(([, docs]) => docs.length > 0)
      .map(([departmentId, documents]) => ({ departmentId, documents }));

    try {
      await createReq.mutateAsync({ academicSessionId: values.academicSessionId, submissions });
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
              <FormField
                control={form.control}
                name="academicSessionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Session</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the academic session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicSessions.map(session => (
                          <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {academicSessions.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No active academic session is available yet. Please check back later.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {Array.isArray(departments) && departments.length > 0 ? (
                <div className="space-y-4">
                  {departments.map(dept => {
                    const docs = documentsByDept[dept.id] || [];
                    return (
                      <Card key={dept.id} className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {dept.name}
                            {dept.requiresDocument && <Badge variant="secondary">Document Required</Badge>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Label className="text-xs text-muted-foreground">
                            {dept.requiresDocument
                              ? dept.requiredDocumentDescription || 'A supporting document is required for this department.'
                              : 'Supporting document (optional)'}
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

                          {dept.requiresDocument && docs.length === 0 && (
                            <p className="text-xs font-medium text-destructive">A document is required before you can submit.</p>
                          )}

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

              {missingRequiredDepts.length > 0 && (
                <p className="text-sm text-destructive">
                  Please attach a document for: {missingRequiredDepts.map(d => d.name).join(', ')}.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={
                    createReq.isPending ||
                    departments.length === 0 ||
                    missingRequiredDepts.length > 0 ||
                    !selectedSessionId
                  }
                >
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
