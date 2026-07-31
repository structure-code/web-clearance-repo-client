import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, FileText, ArrowRight, Inbox } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getClearanceRequests } from '../../api/clearance.api';
import { formatDate } from '../../utils/helpers';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { data: requestsRes, isLoading: reqLoading } = useQuery({
    queryKey: ['clearance-requests'],
    queryFn: getClearanceRequests,
  });

  const requests = requestsRes || [];

  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const pendingCount = requests.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
  const totalCount = requests.length;
  const firstName = user?.name?.split(' ')[0];

  if (reqLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : 'Student Dashboard'}
        description="Here's where your clearance stands across every department."
      >
        <Button asChild>
          <Link to="/student/requests/new">
            Submit New Request <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total Requests" value={totalCount} icon={FileText} tone="navy" />
        <StatCard label="Completed" value={completedCount} icon={CheckCircle2} tone="success" />
        <StatCard label="Approved" value={approvedCount} icon={CheckCircle2} tone="gold" />
        <StatCard label="Pending" value={pendingCount} icon={Clock} tone="warning" />
        <StatCard label="Rejected" value={rejectedCount} icon={XCircle} tone="destructive" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Clearance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No clearance requests yet"
              description="Start your clearance to open a request with every department at once."
              action={
                <Button size="sm" asChild>
                  <Link to="/student/requests/new">Submit New Request</Link>
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.slice(0, 5).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.department?.name || 'Unknown'}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/student/requests/${request.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
