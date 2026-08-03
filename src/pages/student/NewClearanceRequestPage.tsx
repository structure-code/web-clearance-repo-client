import React, { useMemo, useState } from 'react';
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
import { formatFileSize, formatAcademicSession } from '../../utils/helpers';
import { useActiveDepartments } from '@/hooks/useDepartments';
import { useActiveAcademicSessions } from '@/hooks/useAcademicSessions';
import type { Document } from '../../types';
import type { Department } from '../../types/department';

interface DocGroup {
  key: string;
  description?: string;
  requiresDocument: boolean;
  departments: Department[];
}

// Groups departments that ask for the exact same document (matched on the
// normalized requiredDocumentDescription text) so the student only has to
// upload it once, instead of re-uploading the same file per department.
// Departments with no description, or whose description doesn't match any
// other department's, stay in their own single-department group.
function groupDepartmentsByDocument(departments: Department[]): DocGroup[] {
  const map = new Map<string, DocGroup>();

  for (const dept of departments) {
    const normalizedDesc = dept.requiresDocument
      ? dept.requiredDocumentDescription?.trim().toLowerCase()
      : undefined;
    const key = normalizedDesc ? `doc:${normalizedDesc}` : `dept:${dept.id}`;

    const existing = map.get(key);
    if (existing) {
      existing.departments.push(dept);
    } else {
      map.set(key, {
        key,
        description: dept.requiredDocumentDescription?.trim(),
        requiresDocument: !!dept.requiresDocument,
        departments: [dept],
      });
    }
  }

  return Array.from(map.values());
}

export default function NewClearanceRequestPage() {
  const navigate = useNavigate();
  const createReq = useCreateClearanceRequest();
  const uploadFile = useUploadFile();
  // Documents keyed by departmentId. Grouped departments (same required
  // document) are kept in sync so the same uploaded document is applied to
  // every department in the group without re-uploading the file.
  const [documentsByDept, setDocumentsByDept] = useState<Record<string, Document[]>>({});
  const [uploadingGroupKey, setUploadingGroupKey] = useState<string | null>(null);

  const { data: departments = [] } = useActiveDepartments();
  const { data: academicSessions = [] } = useActiveAcademicSessions();

  const groups = useMemo(() => groupDepartmentsByDocument(departments), [departments]);

  const missingRequiredGroups = groups.filter(
    group => group.requiresDocument && (documentsByDept[group.departments[0].id] || []).length === 0,
  );
  const missingRequiredDepts = missingRequiredGroups.flatMap(group => group.departments);

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

  // Keep the form's `submissions` field (used by zod validation) in sync with
  // the documentsByDept state. Without this, `submissions` stays at its
  // default value of [] forever, so the "At least one department is
  // required" validation error fires even after documents are attached.
  React.useEffect(() => {
    const submissions = Object.entries(documentsByDept)
      .filter(([, docs]) => docs.length > 0)
      .map(([departmentId, documents]) => ({ departmentId, documents }));
    form.setValue('submissions', submissions, { shouldValidate: true });
  }, [documentsByDept, form]);

  const handleFileUpload = async (group: DocGroup, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGroupKey(group.key);
    try {
      // Upload to the backend exactly once per group, then attach the same
      // document to every department that shares this requirement.
      const res = await uploadFile.mutateAsync(file);
      setDocumentsByDept(prev => {
        const next = { ...prev };
        for (const dept of group.departments) {
          next[dept.id] = [...(prev[dept.id] || []), res];
        }
        return next;
      });
      toast.success(
        group.departments.length > 1
          ? `File uploaded and applied to ${group.departments.length} departments`
          : 'File uploaded successfully',
      );
    } catch (err: any) {
      toast.error('Failed to upload file');
    } finally {
      setUploadingGroupKey(null);
      e.target.value = '';
    }
  };

  const removeDoc = (group: DocGroup, index: number) => {
    setDocumentsByDept(prev => {
      const next = { ...prev };
      for (const dept of group.departments) {
        const docs = [...(prev[dept.id] || [])];
        docs.splice(index, 1);
        next[dept.id] = docs;
      }
      return next;
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
                          <SelectItem key={session.id} value={session.id}>{formatAcademicSession(session)}</SelectItem>
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
                  {groups.map(group => {
                    const docs = documentsByDept[group.departments[0].id] || [];
                    const isShared = group.departments.length > 1;
                    return (
                      <Card key={group.key} className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex flex-wrap items-center gap-2">
                            {group.departments.map(d => d.name).join(' + ')}
                            {group.requiresDocument && <Badge variant="secondary">Document Required</Badge>}
                            {isShared && <Badge variant="outline">Shared document</Badge>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Label className="text-xs text-muted-foreground">
                            {group.requiresDocument
                              ? group.description || 'A supporting document is required for these departments.'
                              : 'Supporting document (optional)'}
                          </Label>
                          {isShared && (
                            <p className="text-xs text-muted-foreground">
                              Upload once — this document will be attached to all {group.departments.length} departments listed above.
                            </p>
                          )}
                          <div className="flex items-center gap-3">
                            <Input
                              type="file"
                              className="hidden"
                              id={`file-upload-${group.key}`}
                              onChange={e => handleFileUpload(group, e)}
                              disabled={uploadingGroupKey === group.key}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`file-upload-${group.key}`)?.click()}
                              disabled={uploadingGroupKey === group.key}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadingGroupKey === group.key ? 'Uploading...' : 'Attach File'}
                            </Button>
                          </div>

                          {group.requiresDocument && docs.length === 0 && (
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
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDoc(group, idx)}>
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