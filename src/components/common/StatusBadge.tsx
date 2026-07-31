import React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { formatStatusLabel } from '../../utils/helpers';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = getStatusBadgeClass(status);
  
  return (
    <Badge className={cn('border-transparent shadow-xs', colorClass)}>
      {formatStatusLabel(status)}
    </Badge>
  );
};

const getStatusBadgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-success text-success-foreground';
    case 'PENDING':
      return 'bg-warning text-warning-foreground';
    case 'UNDER_REVIEW':
      return 'bg-sky-500 text-white';
    case 'APPROVED':
      return 'bg-emerald-500 text-white';
    case 'REJECTED':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};
