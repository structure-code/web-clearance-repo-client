import React from 'react';
import { Badge } from '../ui/badge';
import { formatStatusLabel, getStatusColor } from '../../utils/helpers';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variant = getStatusColor(status);
  
  return (
    <Badge variant={variant as any}>
      {formatStatusLabel(status)}
    </Badge>
  );
};
