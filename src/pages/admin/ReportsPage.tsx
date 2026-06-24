import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getClearanceRequests } from '../../api/clearance.api';
import { getDepartments } from '../../api/departments.api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      approved: deptReqs.filter(r => r.status === 'APPROVED').length,
      pending: deptReqs.filter(r => r.status === 'PENDING').length,
      underReview: deptReqs.filter(r => r.status === 'UNDER_REVIEW').length,
      rejected: deptReqs.filter(r => r.status === 'REJECTED').length,
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <PageHeader title="System Reports" description="Detailed metrics and exportable data." />

      <Card>
        <CardHeader>
          <CardTitle>Department Clearance Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="code" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                <Bar dataKey="approved" stackId="a" fill="#22C55E" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                <Bar dataKey="underReview" stackId="a" fill="#38BDF8" />
                <Bar dataKey="rejected" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
                <TableHead className="text-right text-success">Approved</TableHead>
                <TableHead className="text-right text-warning">Pending</TableHead>
                <TableHead className="text-right">Under Review</TableHead>
                <TableHead className="text-right text-destructive">Rejected</TableHead>
                <TableHead className="text-right">Approval Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptStats.map(stat => (
                <TableRow key={stat.code}>
                  <TableCell className="font-medium">{stat.department}</TableCell>
                  <TableCell className="text-right">{stat.total}</TableCell>
                  <TableCell className="text-right">{stat.approved}</TableCell>
                  <TableCell className="text-right">{stat.pending}</TableCell>
                  <TableCell className="text-right">{stat.underReview}</TableCell>
                  <TableCell className="text-right">{stat.rejected}</TableCell>
                  <TableCell className="text-right">
                    {stat.total > 0 ? Math.round((stat.approved / stat.total) * 100) : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
