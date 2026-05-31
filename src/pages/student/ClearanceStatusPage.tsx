import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Card, CardContent } from '../../components/ui/card';
import { getClearanceRequests } from '../../api/clearance.api';
import { getDepartments } from '../../api/departments.api';
import { Progress } from '../../components/ui/progress';

export default function ClearanceStatusPage() {
  const { data: reqRes, isLoading: reqLoading } = useQuery({
    queryKey: ['clearance-requests'],
    queryFn: getClearanceRequests,
  });

  const { data: deptRes, isLoading: deptLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  if (reqLoading || deptLoading) {
    return <div>Loading status...</div>;
  }

  const requests = reqRes?.data || [];
  const departments = deptRes?.data || [];

  const getStatusForDept = (deptId: string) => {
    const req = requests.find(r => r.departmentId === deptId);
    return req ? req.status : 'PENDING';
  };

  const getCommentForDept = (deptId: string) => {
    const req = requests.find(r => r.departmentId === deptId);
    return req?.comment || '';
  };

  const approvedCount = departments.filter(d => getStatusForDept(d.id) === 'APPROVED').length;
  const progressPercent = departments.length > 0 ? Math.round((approvedCount / departments.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clearance Status" 
        description="Track your clearance progress across all departments."
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3 w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {approvedCount} of {departments.length} departments cleared
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const status = getStatusForDept(dept.id);
          const comment = getCommentForDept(dept.id);
          return (
            <Card key={dept.id} className="border-l-4" style={{
              borderLeftColor: status === 'APPROVED' ? 'hsl(var(--success))' : status === 'REJECTED' ? 'hsl(var(--destructive))' : 'hsl(var(--warning))'
            }}>
              <CardContent className="p-4 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <StatusBadge status={status} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Code: {dept.code}</p>
                </div>
                {status === 'REJECTED' && comment && (
                  <div className="bg-destructive/10 text-destructive text-sm p-2 rounded mt-2">
                    <strong>Reason:</strong> {comment}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
