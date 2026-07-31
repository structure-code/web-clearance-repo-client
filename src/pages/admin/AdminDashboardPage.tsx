import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getClearanceRequests } from '../../api/clearance.api';
import { getDepartments } from '../../api/departments.api';
import { getUsers } from '../../api/users.api';
import { Users, Building2, FileText, CheckCircle2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const STATUS_COLORS = {
  completed: '#22C55E',
  pending: '#F59E0B',
  underReview: '#38BDF8',
  rejected: '#EF4444',
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: reqRes } = useQuery({ queryKey: ['clearance-requests'], queryFn: getClearanceRequests });
  const { data: deptRes } = useQuery({ queryKey: ['departments'], queryFn: getDepartments });
  const { data: usersRes } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const requests = reqRes || [];
  const departments = deptRes || [];
  const users = usersRes || [];

  const studentsCount = users.filter(u => u.role === 'STUDENT').length;
  const deptsCount = departments.length;
  const reqsCount = requests.length;

  const completed = requests.filter(r => r.status === 'COMPLETED').length;
  const pending = requests.filter(r => r.status === 'PENDING').length;
  const underReview = requests.filter(r => r.status === 'UNDER_REVIEW').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;

  const clearedRate = reqsCount > 0 ? Math.round((completed / reqsCount) * 100) : 0;
  const firstName = user?.name?.split(' ')[0];

  const pieData = [
    { name: 'Completed', value: completed, color: STATUS_COLORS.completed },
    { name: 'Pending', value: pending, color: STATUS_COLORS.pending },
    { name: 'Under Review', value: underReview, color: STATUS_COLORS.underReview },
    { name: 'Rejected', value: rejected, color: STATUS_COLORS.rejected },
  ].filter((item) => item.value > 0);

  // Group requests by department
  const deptData = departments.map(d => {
    const deptReqs = requests.filter(r => r.departmentId === d.id);
    return {
      name: d.code,
      total: deptReqs.length,
      completed: deptReqs.filter(r => r.status === 'COMPLETED').length,
      pending: deptReqs.filter(r => r.status === 'PENDING').length,
      underReview: deptReqs.filter(r => r.status === 'UNDER_REVIEW').length,
      rejected: deptReqs.filter(r => r.status === 'REJECTED').length,
    };
  }).filter((department) => department.total > 0).sort((a, b) => b.total - a.total).slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : 'Admin Dashboard'}
        description="System-wide metrics and administrative overview."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={studentsCount} icon={Users} tone="navy" />
        <StatCard label="Departments" value={deptsCount} icon={Building2} tone="gold" />
        <StatCard label="Total Requests" value={reqsCount} icon={FileText} tone="muted" />
        <StatCard label="Cleared Rate" value={clearedRate} suffix="%" icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requests by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {deptData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <EmptyState icon={BarChart3} title="No request data yet" description="Once students start submitting clearance requests, department activity will appear here." />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
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
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <EmptyState icon={BarChart3} title="No request statuses yet" description="Status breakdowns will appear here once requests start coming in." />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="48%"
                      innerRadius={55}
                      outerRadius={92}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={48} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
