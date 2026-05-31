import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getClearanceRequests } from '../../api/clearance.api';
import { formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function ClearanceHistoryPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['clearance-requests'],
    queryFn: getClearanceRequests,
  });

  if (isLoading) return <div>Loading...</div>;

  const requests = res?.data || [];
  // For history, typically we might show completed (APPROVED/REJECTED) requests.
  const historyRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <PageHeader title="Clearance History" description="View past decisions and archived requests." />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Date Reviewed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No history found.
                  </TableCell>
                </TableRow>
              ) : (
                historyRequests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.department?.name}</TableCell>
                    <TableCell>{formatDate(req.createdAt)}</TableCell>
                    <TableCell>{formatDate(req.updatedAt)}</TableCell>
                    <TableCell><StatusBadge status={req.status} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/student/requests/${req.id}`}>Details</Link>
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
