import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string | undefined, formatStr = 'PPP') => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    return dateString;
  }
};

export const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'COMPLETED':
      return 'success';
    case 'PENDING':
    case 'UNDER_REVIEW':
      return 'warning';
    case 'REJECTED':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export const formatStatusLabel = (status: string) => {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getRoleColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'bg-primary text-primary-foreground';
    case 'DEPARTMENT_OFFICER':
      return 'bg-accent text-accent-foreground';
    case 'STUDENT':
      return 'bg-success text-success-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
