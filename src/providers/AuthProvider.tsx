import React, { createContext, useContext, useEffect, useState } from "react";
import { User, StudentLoginCredentials, AdminLoginCredentials, ApiResponse } from "../types";
import {
  getCurrentUser,
  studentLogin as apiStudentLogin,
  adminLogin as apiAdminLogin,
  logout as apiLogout,
} from "../api/auth.api";
import Loader from "../components/ui/loader";

type LoginArgs =
  | ({ mode: "student" } & StudentLoginCredentials)
  | ({ mode: "admin" } & AdminLoginCredentials);

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginArgs) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
      const data = await getCurrentUser();
      setUser(data);
      } catch (error: any) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials: LoginArgs) => {
    try {
      if (credentials.mode === "student") {
        await apiStudentLogin({ matricNo: credentials.matricNo, password: credentials.password });
      } else {
        await apiAdminLogin({ email: credentials.email, password: credentials.password });
      }
      const data = await getCurrentUser();
      setUser(data);
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw so the calling component can handle UI errors
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Always clear local session even if the backend call hits an error
      setUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <Loader />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier context consumption across components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
