import { format, parseISO } from 'date-fns';

// Splits a single "full name" string into first/middle/last parts, used to
// pre-fill the separate name inputs students use across the app (registration,
// admin user management, and profile editing).
export const splitFullName = (fullName?: string) => {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', middleName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], middleName: '', lastName: '' };
  if (parts.length === 2) return { firstName: parts[0], middleName: '', lastName: parts[1] };
  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
};

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
    case 'FACULTY_OFFICER':
      return 'bg-sky-500 text-white';
    case 'STUDENT':
      return 'bg-success text-success-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export const formatSemester = (semester: string | undefined) => {
  switch (semester) {
    case 'FIRST':
      return 'First Semester';
    case 'SECOND':
      return 'Second Semester';
    default:
      return '';
  }
};

export const formatAcademicSession = (session?: { name?: string; semester?: string } | null) => {
  if (!session?.name) return '—';
  const semesterLabel = formatSemester(session.semester);
  return semesterLabel ? `${session.name} — ${semesterLabel}` : session.name;
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
