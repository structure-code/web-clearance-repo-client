import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, "Full Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const createDepartmentSchema = z.object({
  name: z.string().min(2, { message: "Department name is required" }),
  code: z.string().min(2, { message: "Department code is required" }).toUpperCase(),
  isActive: z.boolean().optional()
});

export const createUserSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.union([
    z.string().min(6, { message: "Password must be at least 6 characters" }),
    z.literal(''),
  ]),
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
  remarks: z.string().optional(),
});

export const rejectSchema = z.object({
  remarks: z.string().min(5, { message: "Rejection remarks are required" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
