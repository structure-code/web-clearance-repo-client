import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getClearanceRequests } from '../../api/clearance.api';
import { getDepartments } from '../../api/departments.api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS = {
  completed: '#22C55E',
  pending: '#F59E0B',
  underReview: '#38BDF8',
  rejected: '#EF4444',
};

export default function ReportsPage() {
  const { data: reqRes, isLoading: reqLoading } = useQuery({ queryKey: ['clearance-requests'], queryFn: getClearanceRequests });
  const { data: deptRes, isLoading: deptLoading } = useQuery({ queryKey: ['departments'], queryFn: getDepartments });

  if (reqLoading || deptLoading) return <div>Loading reports...</div>;

  const requests = reqRes || [];
  const departments = deptRes || [];

  const deptStats = departments.map(d => {
    const deptReqs = requests.filter(r => r.departmentId === d.id);
    return {
      department: d.name,
      code: d.code,
      total: deptReqs.length,
      completed: deptReqs.filter(r => r.status === 'COMPLETED').length,
      pending: deptReqs.filter(r => r.status === 'PENDING').length,
      underReview: deptReqs.filter(r => r.status === 'UNDER_REVIEW').length,
      rejected: deptReqs.filter(r => r.status === 'REJECTED').length,
    };
  }).sort((a, b) => b.total - a.total);
  const chartData = deptStats.filter((department) => department.total > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="System Reports" description="Detailed metrics and exportable data." />

      <Card>
        <CardHeader>
          <CardTitle>Department Clearance Volume</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">
              No request data to display yet.
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="code" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                  <Legend verticalAlign="bottom" height={36} />
                  <Bar dataKey="completed" name="Completed" stackId="status" fill={STATUS_COLORS.completed} />
                  <Bar dataKey="pending" name="Pending" stackId="status" fill={STATUS_COLORS.pending} />
                  <Bar dataKey="underReview" name="Under Review" stackId="status" fill={STATUS_COLORS.underReview} />
                  <Bar dataKey="rejected" name="Rejected" stackId="status" fill={STATUS_COLORS.rejected} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right text-success">Completed</TableHead>
                <TableHead className="text-right text-warning">Pending</TableHead>
                <TableHead className="text-right">Under Review</TableHead>
                <TableHead className="text-right text-destructive">Rejected</TableHead>
                <TableHead className="text-right">Cleared Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptStats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No department data available.
                  </TableCell>
                </TableRow>
              ) : (
                deptStats.map(stat => (
                  <TableRow key={stat.code}>
                    <TableCell className="font-medium">{stat.department}</TableCell>
                    <TableCell className="text-right">{stat.total}</TableCell>
                    <TableCell className="text-right">{stat.completed}</TableCell>
                    <TableCell className="text-right">{stat.pending}</TableCell>
                    <TableCell className="text-right">{stat.underReview}</TableCell>
                    <TableCell className="text-right">{stat.rejected}</TableCell>
                    <TableCell className="text-right">
                      {stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0}%
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
