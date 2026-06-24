import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getClearanceRequests } from '../../api/clearance.api';
import { formatDate } from '../../utils/helpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export default function ReviewRequestsPage() {
  const [filter, setFilter] = useState('PENDING');

  const { data: res, isLoading } = useQuery({
    queryKey: ['clearance-requests'],
    queryFn: getClearanceRequests,
  });

  if (isLoading) return <div>Loading...</div>;

  const requests = res || [];
  const filteredRequests = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);
  const canReviewStatus = (status: string) => status === 'PENDING' || status === 'UNDER_REVIEW';

  return (
    <div className="space-y-6">
      <PageHeader title="Review Requests" description="Manage and process student clearance requests for your department." />

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b flex justify-end">
            <div className="w-[180px]">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No requests found matching the filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">
                      <div>{req.student?.name}</div>
                      <div className="text-xs text-muted-foreground">{req.student?.email}</div>
                    </TableCell>
                    <TableCell>{formatDate(req.createdAt)}</TableCell>
                    <TableCell><StatusBadge status={req.status} /></TableCell>
                    <TableCell>
                      <Button variant={canReviewStatus(req.status) ? 'default' : 'ghost'} size="sm" asChild>
                        <Link to={`/faculty/requests/${req.id}`}>
                          {canReviewStatus(req.status) ? 'Review' : 'View'}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
