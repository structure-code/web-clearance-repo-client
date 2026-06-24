import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Clock, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { getClearanceRequests } from '../../api/clearance.api';
import { formatDate } from '../../utils/helpers';

export default function FacultyDashboardPage() {
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const { data: res, isLoading } = useQuery({
    queryKey: ['clearance-requests'],
    queryFn: getClearanceRequests,
  });

  const requests = res || [];
  const reviewableRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW');
  const pendingCount = reviewableRequests.length;
  const completedToday = requests.filter(r => r.status === 'COMPLETED' && new Date(r.updatedAt).toDateString() === new Date().toDateString()).length;
  const totalProcessed = requests.filter(r => r.status !== 'PENDING' && r.status !== 'UNDER_REVIEW').length;

  useEffect(() => {
    if (!isLoading) {
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
    }
  }, [isLoading, pendingCount, completedToday, totalProcessed]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Department Officer Dashboard" description="Manage and review student clearance requests." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-warning">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span ref={(el) => { countersRef.current[0] = el; }} data-value={pendingCount}>{pendingCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-success">Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span ref={(el) => { countersRef.current[1] = el; }} data-value={completedToday}>{completedToday}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span ref={(el) => { countersRef.current[2] = el; }} data-value={totalProcessed}>{totalProcessed}</span>
            </div>
          </CardContent>
        </Card>
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
            <div className="text-center py-8 text-muted-foreground">
              No pending requests at the moment.
            </div>
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
