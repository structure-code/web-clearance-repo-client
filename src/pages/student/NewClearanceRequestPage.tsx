import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { createClearanceRequestSchema } from '../../validations/schemas';
import { useCreateClearanceRequest } from '../../hooks/useClearanceRequests';
import { useUploadFile } from '../../hooks/useUploadFile';
import { getDepartments } from '../../api/departments.api';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';

export default function NewClearanceRequestPage() {
  const navigate = useNavigate();
  const createReq = useCreateClearanceRequest();
  const uploadFile = useUploadFile();
  const [documents, setDocuments] = useState<any[]>([]);

  const { data: deptRes, isLoading: deptLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const form = useForm({
    resolver: zodResolver(createClearanceRequestSchema),
    defaultValues: {
      departmentId: '',
      documents: [],
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadFile.mutateAsync(file);
      if (res.success && res.data) {
        const newDocs = [...documents, res.data];
        setDocuments(newDocs);
        form.setValue('documents', newDocs, { shouldValidate: true });
        toast.success('File uploaded successfully');
      }
    } catch (err: any) {
      toast.error('Failed to upload file');
    }
  };

  const removeDoc = (index: number) => {
    const newDocs = [...documents];
    newDocs.splice(index, 1);
    setDocuments(newDocs);
    form.setValue('documents', newDocs, { shouldValidate: true });
  };

  const onSubmit = async (values: any) => {
    try {
      await createReq.mutateAsync(values);
      toast.success('Clearance request submitted successfully');
      navigate('/student/requests');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader title="New Clearance Request" description="Submit required documents to a department for clearance." />

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {deptRes?.data?.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Supporting Documents</FormLabel>
                
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, JPG, PNG (max 5MB)</p>
                  <Input 
                    type="file" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={handleFileUpload} 
                    disabled={uploadFile.isPending}
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()} disabled={uploadFile.isPending}>
                    {uploadFile.isPending ? 'Uploading...' : 'Select File'}
                  </Button>
                </div>

                {documents.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-medium truncate">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(doc.fileSize)}</p>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeDoc(idx)}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="documents"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" disabled={createReq.isPending || documents.length === 0}>
                  {createReq.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
