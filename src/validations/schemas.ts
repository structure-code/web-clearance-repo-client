import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(2, { message: "Department name is required" }),
  code: z.string().min(2, { message: "Department code is required" }).toUpperCase(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(['STUDENT', 'DEPARTMENT_OFFICER', 'ADMIN']),
  departmentId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const createClearanceRequestSchema = z.object({
  departmentId: z.string().min(1, { message: "Department is required" }),
  documents: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
  })).min(1, { message: "At least one document is required" }),
});

export const approveSchema = z.object({
  comment: z.string().optional(),
});

export const rejectSchema = z.object({
  comment: z.string().min(5, { message: "Rejection comment is required" }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
