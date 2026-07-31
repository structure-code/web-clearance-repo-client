import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, FileText, ArrowRight, ClipboardCheck } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { getClearanceRequests } from '../../api/clearance.api';
import { formatDate } from '../../utils/helpers';

export default function FacultyDashboardPage() {
  const { user } = useAuth();
  const { data: res, isLoading } = useQuery({
    queryKey: ['clearance-requests'],
    queryFn: getClearanceRequests,
  });

  const requests = res || [];
  const reviewableRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW');
  const pendingCount = reviewableRequests.length;
  const completedToday = requests.filter(r => r.status === 'COMPLETED' && new Date(r.updatedAt).toDateString() === new Date().toDateString()).length;
  const totalProcessed = requests.filter(r => r.status !== 'PENDING' && r.status !== 'UNDER_REVIEW').length;
  const firstName = user?.name?.split(' ')[0];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
        title={firstName ? `Welcome back, ${firstName}` : 'Department Officer Dashboard'}
        description="Here's what's waiting on your desk."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Pending Reviews" value={pendingCount} icon={Clock} tone="warning" />
        <StatCard label="Completed Today" value={completedToday} icon={CheckCircle2} tone="success" />
        <StatCard label="Total Processed" value={totalProcessed} icon={FileText} tone="navy" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Pending Requests</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/faculty/requests">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {reviewableRequests.length === 0 ? (
            <EmptyState
              icon={ClipboardCheck}
              title="Nothing pending"
              description="You're all caught up — no requests are waiting on your review right now."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewableRequests.slice(0, 5).map(req => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.student?.name}</TableCell>
                    <TableCell>{req.student?.email}</TableCell>
                    <TableCell>{formatDate(req.createdAt)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/faculty/requests/${req.id}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
