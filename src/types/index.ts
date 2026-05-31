import type { Department } from "./department";

export type UserRole = 'STUDENT' | 'DEPARTMENT_OFFICER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Document {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export type ClearanceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ClearanceRequest {
  id: string;
  studentId: string;
  student?: User;
  departmentId: string;
  department?: Department;
  status: ClearanceStatus;
  documents: Document[];
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
