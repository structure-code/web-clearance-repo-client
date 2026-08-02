import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    middleName: z.string().optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    matricNo: z.string().min(2, "Matriculation number is required"),
    programId: z.string().min(1, "Program is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const studentLoginSchema = z.object({
  matricNo: z.string().min(1, { message: "Matriculation number is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const adminLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createDepartmentSchema = z
  .object({
    name: z.string().min(2, { message: "Department name is required" }),
    code: z
      .string()
      .min(2, { message: "Department code is required" })
      .toUpperCase(),
    isActive: z.boolean().optional(),
    requiresDocument: z.boolean().optional(),
    requiredDocumentDescription: z.string().optional(),
  })
  .refine(
    (data) => !data.requiresDocument || !!data.requiredDocumentDescription?.trim(),
    {
      message: "Describe what document students need to attach",
      path: ["requiredDocumentDescription"],
    },
  );

export const createFacultySchema = z
  .object({
    name: z.string().min(2, { message: "Faculty name is required" }),
    code: z
      .string()
      .min(2, { message: "Faculty code is required" })
      .toUpperCase(),
    isActive: z.boolean().optional(),
    requiresDocument: z.boolean().optional(),
    requiredDocumentDescription: z.string().optional(),
  })
  .refine(
    (data) => !data.requiresDocument || !!data.requiredDocumentDescription?.trim(),
    {
      message: "Describe what document students need to attach",
      path: ["requiredDocumentDescription"],
    },
  );

export const createProgramSchema = z.object({
  name: z.string().min(2, { message: "Program name is required" }),
  code: z
    .string()
    .min(2, { message: "Program code is required" })
    .toUpperCase(),
  facultyId: z.string().min(1, { message: "Faculty is required" }),
  isActive: z.boolean().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.union([
    z.string().min(6, { message: "Password must be at least 6 characters" }),
    z.literal(""),
  ]),
  role: z.enum(["STUDENT", "DEPARTMENT_OFFICER", "FACULTY_OFFICER", "ADMIN"]),
  departmentId: z.string().optional(),
  programId: z.string().optional(),
  facultyId: z.string().optional(),
  isActive: z.boolean().default(true),
});

const clearanceDocumentSchema = z.object({
  fileName: z.string(),
  fileUrl: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
});

export const createClearanceRequestSchema = z.object({
  submissions: z
    .array(
      z.object({
        departmentId: z.string().min(1),
        documents: z.array(clearanceDocumentSchema).optional(),
      }),
    )
    .min(1, { message: "At least one department is required" }),
});

export const rejectSchema = z.object({
  remarks: z.string().min(5, { message: "Rejection remarks are required" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type StudentLoginInput = z.infer<typeof studentLoginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
