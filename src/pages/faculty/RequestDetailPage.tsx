import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';

import { useClearanceRequest, useApproveClearanceRequest, useRejectClearanceRequest, useCompleteClearanceRequest } from '../../hooks/useClearanceRequests';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatFileSize } from '../../utils/helpers';
import { FileText, Download, CheckCircle2 } from 'lucide-react';

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

  const { data: res, isLoading } = useClearanceRequest(id || '');
  const approveMut = useApproveClearanceRequest();
  const rejectMut = useRejectClearanceRequest();
  const completeMut = useCompleteClearanceRequest();

  if (isLoading) return <div>Loading...</div>;
  if (!res) return <div>Request not found</div>;

  const request = res;
  const canReview = user?.role === 'DEPARTMENT_OFFICER' || user?.role === 'ADMIN';
  const canComplete = user?.role === 'ADMIN' && request.status !== 'COMPLETED';
  const reviewerRemarks = request.remarks || request.comment;

  const handleApprove = async () => {
    try {
      await approveMut.mutateAsync({ id: request.id, remarks });
      toast.success('Request approved successfully');
      setApproveOpen(false);
    } catch (err: any) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error('Remarks are required for rejection');
      return;
    }
    try {
      await rejectMut.mutateAsync({ id: request.id, remarks });
      toast.success('Request rejected successfully');
      setRejectOpen(false);
    } catch (err: any) {
      toast.error('Failed to reject request');
    }
  };

  const handleComplete = async () => {
    try {
      await completeMut.mutateAsync(request.id);
      toast.success('Request completed successfully');
    } catch (err: any) {
      toast.error('Failed to complete request');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader title="Request Details" description={`Reviewing clearance for ${request.student?.name}`}>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {request.documents && request.documents.length > 0 ? (
                <div className="space-y-3">
                  {request.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="text-primary h-8 w-8" />
                        <div>
                          <p className="font-medium text-sm">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(doc.fileSize)} • {doc.fileType}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" /> Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No documents attached to this request.</p>
              )}
            </CardContent>
          </Card>

          {reviewerRemarks && (
            <Card>
              <CardHeader>
                <CardTitle>Reviewer Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-muted p-4 rounded-md">{reviewerRemarks}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <StatusBadge status={request.status} />
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Student</p>
                <p className="font-medium">{request.student?.name}</p>
                <p className="text-muted-foreground">{request.student?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Submitted</p>
                <p className="font-medium">{formatDate(request.createdAt)}</p>
              </div>
              {request.reviewedAt && (
                <div>
                  <p className="text-muted-foreground mb-1">Reviewed At</p>
                  <p className="font-medium">{formatDate(request.reviewedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {canReview && request.status === 'PENDING' && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button className="w-full bg-success hover:bg-success/90 text-success-foreground" onClick={() => setApproveOpen(true)}>
                  Approve Request
                </Button>
                <Button className="w-full" variant="destructive" onClick={() => setRejectOpen(true)}>
                  Reject Request
                </Button>
              </CardContent>
            </Card>
          )}

          {canComplete && request.status === 'APPROVED' && (
            <Card>
              <CardContent className="p-4">
                <Button className="w-full" onClick={handleComplete} disabled={completeMut.isPending}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {completeMut.isPending ? 'Completing...' : 'Force Complete'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Clearance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">Are you sure you want to approve this clearance request? This action cannot be undone easily.</p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Comment (Optional)</label>
              <Textarea placeholder="Add remarks..." value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setApproveOpen(false)}>Cancel</Button>
              <Button onClick={handleApprove} disabled={approveMut.isPending}>
                {approveMut.isPending ? 'Approving...' : 'Confirm Approval'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Clearance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">Please provide a reason for rejecting this clearance request.</p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason <span className="text-destructive">*</span></label>
              <Textarea placeholder="Explain why the request is rejected..." value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject} disabled={rejectMut.isPending || !remarks.trim()}>
                {rejectMut.isPending ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
