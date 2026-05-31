import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getClearanceRequests } from '../../api/clearance.api';
import { getDepartments } from '../../api/departments.api';
import { getUsers } from '../../api/users.api';
import { Users, Building2, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import gsap from 'gsap';

const COLORS = ['#22C55E', '#F59E0B', '#EF4444'];

export default function AdminDashboardPage() {
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const { data: reqRes } = useQuery({ queryKey: ['clearance-requests'], queryFn: getClearanceRequests });
  const { data: deptRes } = useQuery({ queryKey: ['departments'], queryFn: getDepartments });
  const { data: usersRes } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const requests = reqRes?.data || [];
  const departments = deptRes?.data || [];
  const users = usersRes?.data || [];

  const studentsCount = users.filter(u => u.role === 'STUDENT').length;
  const deptsCount = departments.length;
  const reqsCount = requests.length;

  const approved = requests.filter(r => r.status === 'APPROVED').length;
  const pending = requests.filter(r => r.status === 'PENDING').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;

  const approvalRate = reqsCount > 0 ? Math.round((approved / reqsCount) * 100) : 0;

  const pieData = [
    { name: 'Approved', value: approved },
    { name: 'Pending', value: pending },
    { name: 'Rejected', value: rejected },
  ];

  // Group requests by department
  const deptData = departments.map(d => {
    const deptReqs = requests.filter(r => r.departmentId === d.id);
    return {
      name: d.code,
      total: deptReqs.length,
      approved: deptReqs.filter(r => r.status === 'APPROVED').length,
    };
  }).sort((a, b) => b.total - a.total).slice(0, 10);

  useEffect(() => {
    countersRef.current.forEach((el) => {
      if (el) {
        const targetValue = parseInt(el.getAttribute('data-value') || '0', 10);
        gsap.fromTo(el, { innerHTML: 0 }, {
          innerHTML: targetValue,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          onUpdate: function () {
            if (el) el.innerHTML = Math.round(this.targets()[0].innerHTML).toString();
          },
        });
      }
    });
  }, [studentsCount, deptsCount, reqsCount, approvalRate]);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="System-wide metrics and administrative overview." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span ref={el => countersRef.current[0] = el} data-value={studentsCount}>{studentsCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span ref={el => countersRef.current[1] = el} data-value={deptsCount}>{deptsCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span ref={el => countersRef.current[2] = el} data-value={reqsCount}>{reqsCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span ref={el => countersRef.current[3] = el} data-value={approvalRate}>{approvalRate}</span>%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requests by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="total" name="Total Requests" fill="#0F172A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" name="Approved" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
