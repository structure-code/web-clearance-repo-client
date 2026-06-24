import type { Department } from "./department";

export type UserRole = 'STUDENT' | 'DEPARTMENT_OFFICER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  departmentId?: string;
  isActive: boolean;
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

export type ClearanceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

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
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
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

export interface CreateClearanceRequestDto {
  departmentId: string;
  documents: Document[];
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
