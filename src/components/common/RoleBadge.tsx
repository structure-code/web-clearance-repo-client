import React from 'react';
import { Badge } from '../ui/badge';
import { getRoleColor } from '../../utils/helpers';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const colorClass = getRoleColor(role);
  
  return (
    <Badge variant="outline" className={`${colorClass} border-none capitalize`}>
      {role.replace('_', ' ').toLowerCase()}
    </Badge>
  );
};
