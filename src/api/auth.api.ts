import { apiClient } from "./axios";
import {
  ForgotPasswordDto,
  LoginCredentials,
  RegisterDto,
  ResetPasswordDto,
  UpdateUserDto,
  User,
  VerifyEmailDto,
} from "../types";
import { unwrapData } from "./response";

export const login = async (
  credentials: LoginCredentials,
): Promise<unknown> => {
  const { data } = await apiClient.post("/auth/login", credentials);
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
  payload: Pick<UpdateUserDto, "name" | "email">,
): Promise<User> => {
  const { data } = await apiClient.patch("/auth/profile", payload);
  return unwrapData<User>(data);
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<null> => {
  const { data } = await apiClient.post("/auth/change-password", payload);
  return unwrapData<null>(data);
};
