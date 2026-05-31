import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { CheckCircle2, Clock, XCircle, FileText, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { getClearanceRequests } from '../../api/clearance.api';
import { getDepartments } from '../../api/departments.api';
import { formatDate } from '../../utils/helpers';

export default function StudentDashboardPage() {
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const { data: requestsRes, isLoading: reqLoading } = useQuery({
    queryKey: ['clearance-requests'],
    queryFn: getClearanceRequests,
  });

  const requests = requestsRes?.data || [];

  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;
  const totalCount = requests.length;

  useEffect(() => {
    if (!reqLoading) {
      countersRef.current.forEach((el, index) => {
        if (el) {
          const targetValue = parseInt(el.getAttribute('data-value') || '0', 10);
          gsap.fromTo(
            el,
            { innerHTML: 0 },
            {
              innerHTML: targetValue,
              duration: 1.5,
              ease: 'power2.out',
              snap: { innerHTML: 1 },
              onUpdate: function () {
                if (el) el.innerHTML = Math.round(this.targets()[0].innerHTML).toString();
              },
            }
          );
        }
      });
    }
  }, [reqLoading, approvedCount, pendingCount, rejectedCount, totalCount]);

  if (reqLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Student Dashboard" 
        description="Overview of your academic clearance progress."
      >
        <Button asChild>
          <Link to="/student/requests/new">
            Submit New Request <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Clearance Progress</h3>
              <p className="text-sm text-muted-foreground">
                {/* You have cleared {approvedCount} out of {totalDepts} departments */}
              </p>
            </div>
            {/* <div className="text-3xl font-bold text-primary">{progressPercent}%</div> */}
          </div>
          {/* <Progress value={progressPercent} className="h-3 w-full" /> */}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* <span ref={(el) => (countersRef.current[0] = el)} data-value={totalCount}>{totalCount}</span> */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-success">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* <span ref={(el) => (countersRef.current[1] = el)} data-value={approvedCount}>{approvedCount}</span> */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-warning">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* <span ref={(el) => (countersRef.current[2] = el)} data-value={pendingCount}>{pendingCount}</span> */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-destructive">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* <span ref={(el) => (countersRef.current[3] = el)} data-value={rejectedCount}>{rejectedCount}</span> */}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Clearance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No clearance requests found. Start by submitting a new request.
            </div>
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
