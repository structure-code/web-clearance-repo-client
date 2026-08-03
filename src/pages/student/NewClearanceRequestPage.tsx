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
import { useActiveFaculties } from '@/hooks/useFaculties';
import { useActiveAcademicSessions } from '@/hooks/useAcademicSessions';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { Document } from '../../types';

// A clearance request is opened against every active department, plus the
// student's own faculty unit (a student belongs to exactly one faculty).
// Both are treated uniformly here so they can be grouped together when they
// ask for the same document.
interface Unit {
  kind: 'department' | 'faculty';
  id: string;
  name: string;
  requiresDocument?: boolean;
  requiredDocumentDescription?: string;
}

// A unique key per unit, used both for local document state and for the
// keys the backend expects in each submission (departmentId / facultyId).
const unitKey = (unit: Unit) => `${unit.kind}:${unit.id}`;

interface DocGroup {
  key: string;
  description?: string;
  requiresDocument: boolean;
  units: Unit[];
}

// Groups units (departments + the student's faculty) that ask for the exact
// same document (matched on the normalized requiredDocumentDescription text)
// so the student only has to upload it once, instead of re-uploading the
// same file per unit. Units with no description, or whose description
// doesn't match any other unit's, stay in their own single-unit group.
function groupUnitsByDocument(units: Unit[]): DocGroup[] {
  const map = new Map<string, DocGroup>();

  for (const unit of units) {
    const normalizedDesc = unit.requiresDocument
      ? unit.requiredDocumentDescription?.trim().toLowerCase()
      : undefined;
    const key = normalizedDesc ? `doc:${normalizedDesc}` : `unit:${unitKey(unit)}`;

    const existing = map.get(key);
    if (existing) {
      existing.units.push(unit);
    } else {
      map.set(key, {
        key,
        description: unit.requiredDocumentDescription?.trim(),
        requiresDocument: !!unit.requiresDocument,
        units: [unit],
      });
    }
  }

  return Array.from(map.values());
}

export default function NewClearanceRequestPage() {
  const navigate = useNavigate();
  const createReq = useCreateClearanceRequest();
  const uploadFile = useUploadFile();
  // Documents keyed by unit key (`department:<id>` or `faculty:<id>`).
  // Grouped units (same required document) are kept in sync so the same
  // uploaded document is applied to every unit in the group without
  // re-uploading the file.
  const [documentsByUnit, setDocumentsByUnit] = useState<Record<string, Document[]>>({});
  const [uploadingGroupKey, setUploadingGroupKey] = useState<string | null>(null);

  const { data: departments = [] } = useActiveDepartments();
  const { data: faculties = [] } = useActiveFaculties();
  const { data: academicSessions = [] } = useActiveAcademicSessions();
  const { data: currentUser } = useCurrentUser();

  // The student's own faculty unit — every clearance request also includes
  // this alongside the active departments, matching how the backend builds
  // requests (one per active department, plus one for the student's faculty).
  const studentFaculty = useMemo(
    () => faculties.find(f => f.id === currentUser?.facultyId),
    [faculties, currentUser],
  );

  const units: Unit[] = useMemo(() => {
    const departmentUnits: Unit[] = departments.map(d => ({
      kind: 'department',
      id: d.id,
      name: d.name,
      requiresDocument: d.requiresDocument,
      requiredDocumentDescription: d.requiredDocumentDescription,
    }));
    const facultyUnit: Unit[] = studentFaculty
      ? [{
          kind: 'faculty',
          id: studentFaculty.id,
          name: studentFaculty.name,
          requiresDocument: studentFaculty.requiresDocument,
          requiredDocumentDescription: studentFaculty.requiredDocumentDescription,
        }]
      : [];
    return [...departmentUnits, ...facultyUnit];
  }, [departments, studentFaculty]);

  const groups = useMemo(() => groupUnitsByDocument(units), [units]);

  const missingRequiredGroups = groups.filter(
    group => group.requiresDocument && (documentsByUnit[unitKey(group.units[0])] || []).length === 0,
  );
  const missingRequiredUnits = missingRequiredGroups.flatMap(group => group.units);

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
  // the documentsByUnit state. Without this, `submissions` stays at its
  // default value of [] forever, so the "At least one department is
  // required" validation error fires even after documents are attached.
  React.useEffect(() => {
    const submissions = Object.entries(documentsByUnit)
      .filter(([, docs]) => docs.length > 0)
      .map(([key, documents]) => {
        const [kind, id] = key.split(':');
        return kind === 'faculty'
          ? { facultyId: id, documents }
          : { departmentId: id, documents };
      });
    form.setValue('submissions', submissions, { shouldValidate: true });
  }, [documentsByUnit, form]);

  const handleFileUpload = async (group: DocGroup, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGroupKey(group.key);
    try {
      // Upload to the backend exactly once per group, then attach the same
      // document to every unit (department or faculty) that shares this
      // requirement.
      const res = await uploadFile.mutateAsync(file);
      setDocumentsByUnit(prev => {
        const next = { ...prev };
        for (const unit of group.units) {
          const key = unitKey(unit);
          next[key] = [...(prev[key] || []), res];
        }
        return next;
      });
      toast.success(
        group.units.length > 1
          ? `File uploaded and applied to ${group.units.length} units`
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
    setDocumentsByUnit(prev => {
      const next = { ...prev };
      for (const unit of group.units) {
        const key = unitKey(unit);
        const docs = [...(prev[key] || [])];
        docs.splice(index, 1);
        next[key] = docs;
      }
      return next;
    });
  };

  const onSubmit = async (values: { academicSessionId: string }) => {
    const submissions = Object.entries(documentsByUnit)
      .filter(([, docs]) => docs.length > 0)
      .map(([key, documents]) => {
        const [kind, id] = key.split(':');
        return kind === 'faculty'
          ? { facultyId: id, documents }
          : { departmentId: id, documents };
      });

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
        description="Submitting will open a clearance request with every active department and your faculty unit. Attach a document below for any unit that needs one."
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

              {Array.isArray(units) && units.length > 0 ? (
                <div className="space-y-4">
                  {groups.map(group => {
                    const docs = documentsByUnit[unitKey(group.units[0])] || [];
                    const isShared = group.units.length > 1;
                    const hasFaculty = group.units.some(u => u.kind === 'faculty');
                    return (
                      <Card key={group.key} className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex flex-wrap items-center gap-2">
                            {group.units.map(u => u.name).join(' + ')}
                            {group.requiresDocument && <Badge variant="secondary">Document Required</Badge>}
                            {isShared && <Badge variant="outline">Shared document</Badge>}
                            {hasFaculty && <Badge variant="outline">Faculty unit</Badge>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Label className="text-xs text-muted-foreground">
                            {group.requiresDocument
                              ? group.description || 'A supporting document is required for these units.'
                              : 'Supporting document (optional)'}
                          </Label>
                          {isShared && (
                            <p className="text-xs text-muted-foreground">
                              Upload once — this document will be attached to all {group.units.length} units listed above.
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
                <p className="text-sm text-muted-foreground">No active departments or faculty unit are accepting clearance requests right now.</p>
              )}

              {currentUser && !currentUser.facultyId && (
                <p className="text-xs text-destructive">
                  Your account isn't linked to a faculty yet, so your faculty unit won't be included in this request. Contact an administrator if this looks wrong.
                </p>
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

              {missingRequiredUnits.length > 0 && (
                <p className="text-sm text-destructive">
                  Please attach a document for: {missingRequiredUnits.map(u => u.name).join(', ')}.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={
                    createReq.isPending ||
                    units.length === 0 ||
                    missingRequiredUnits.length > 0 ||
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