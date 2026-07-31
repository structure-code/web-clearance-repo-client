export interface Department {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  requiresDocument?: boolean;
  requiredDocumentDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  users?: any[];
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  requiresDocument?: boolean;
  requiredDocumentDescription?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  isActive?: boolean;
  requiresDocument?: boolean;
  requiredDocumentDescription?: string;
}

export interface AssignOfficerDto {
  userId: string;
}
