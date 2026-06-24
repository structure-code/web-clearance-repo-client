import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { formatDate } from '../../utils/helpers';

export default function ActivityLogsPage() {
  const { data: logs = [], isLoading } = useActivityLogs();

  if (isLoading) return <div>Loading activity logs...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Activity Logs" description="Audit trail for clearance and account actions." />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="font-medium">{log.action || 'Activity'}</div>
                      {log.description && (
                        <div className="text-xs text-muted-foreground mt-1">{log.description}</div>
                      )}
                    </TableCell>
                    <TableCell>{log.user?.name || log.userId || 'System'}</TableCell>
                    <TableCell>{log.department?.name || log.departmentId || '-'}</TableCell>
                    <TableCell>{formatDate(log.createdAt, 'PPp')}</TableCell>
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
