import { apiClient } from "./axios";
import {
  AdminLoginCredentials,
  ForgotPasswordDto,
  RegisterDto,
  ResetPasswordDto,
  StudentLoginCredentials,
  UpdateProfileDto,
  User,
  VerifyEmailDto,
} from "../types";
import { unwrapData } from "./response";

export const studentLogin = async (
  credentials: StudentLoginCredentials,
): Promise<unknown> => {
  const { data } = await apiClient.post("/auth/student/login", credentials);
  return unwrapData<unknown>(data);
};

export const adminLogin = async (
  credentials: AdminLoginCredentials,
): Promise<unknown> => {
  const { data } = await apiClient.post("/auth/admin/login", credentials);
  return unwrapData<unknown>(data);
};

export const register = async (userData: RegisterDto): Promise<User> => {
  const { data } = await apiClient.post("/auth/register", userData);
  return unwrapData<User>(data);
};

export const verifyEmail = async (
  token: VerifyEmailDto["token"],
): Promise<null> => {
  const { data } = await apiClient.post("/auth/verify-email", { token });
  return unwrapData<null>(data);
};

export const refreshAccessToken = async (): Promise<unknown> => {
  const { data } = await apiClient.post("/auth/refresh");
  return unwrapData<unknown>(data);
};

export const logout = async (): Promise<null> => {
  const { data } = await apiClient.post("/auth/logout");
  return unwrapData<null>(data);
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get("/auth/me");
  return unwrapData<User>(data);
};

export const forgotPassword = async (
  email: ForgotPasswordDto["email"],
): Promise<null> => {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return unwrapData<null>(data);
};

export const resetPassword = async (
  payload: ResetPasswordDto,
): Promise<null> => {
  const { data } = await apiClient.post("/auth/reset-password", payload);
  return unwrapData<null>(data);
};

export const updateProfile = async (
  payload: UpdateProfileDto,
): Promise<User> => {
  const { data } = await apiClient.patch("/auth/me/profile", payload);
  return unwrapData<User>(data);
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<null> => {
  const { data } = await apiClient.post("/auth/me/change-password", payload);
  return unwrapData<null>(data);
};
