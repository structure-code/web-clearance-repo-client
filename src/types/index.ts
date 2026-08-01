import type { Department } from "./department";

export type UserRole = 'STUDENT' | 'DEPARTMENT_OFFICER' | 'FACULTY_OFFICER' | 'ADMIN';

export interface User {
  id: string;
  email?: string;
  matricNo?: string;
  name?: string;
  role: UserRole;
  departmentId?: string;
  facultyId?: string;
  isActive: boolean;
  signatureUrl?: string;
  createdAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
  departmentId?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  departmentId?: string;
  isActive?: boolean;
}

export interface Document {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export type ClearanceStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface ClearanceRequest {
  id: string;
  studentId: string;
  student?: User;
  departmentId: string;
  department?: Department;
  status: ClearanceStatus;
  documents: Document[];
  remarks?: string;
  comment?: string;
  reviewedById?: string;
  reviewedAt?: string;
  clearedByOfficerName?: string;
  clearedBySignatureUrl?: string;
  clearedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface StudentLoginCredentials {
  matricNo: string;
  password: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface RegisterDto {
  matricNo: string;
  password: string;
  name?: string;
  departmentId: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  newPassword: string;
  token: string;
}

export interface DepartmentSubmissionDto {
  departmentId: string;
  documents?: Document[];
}

export interface CreateClearanceRequestDto {
  submissions: DepartmentSubmissionDto[];
}

export interface UpdateProfileDto {
  name?: string;
  departmentId?: string;
  signatureUrl?: string;
}

export interface UpdateClearanceStatusDto {
  remarks?: string;
}

export interface ActivityLog {
  id: string;
  action?: string;
  description?: string;
  userId?: string;
  user?: User;
  departmentId?: string;
  department?: Department;
  createdAt: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  title?: string;
  message?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt: string;
  [key: string]: unknown;
}

export interface Certificate {
  id?: string;
  token?: string;
  certificateToken?: string;
  fileUrl?: string;
  issuedAt?: string;
  student?: User;
  studentId?: string;
  [key: string]: unknown;
}
