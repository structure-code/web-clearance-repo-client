export interface Department {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  users?: any[];
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface AssignOfficerDto {
  userId: string;
}
