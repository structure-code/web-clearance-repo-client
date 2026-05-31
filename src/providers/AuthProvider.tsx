import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials } from '../types';
import { getCurrentUser, login as apiLogin, logout as apiLogout } from '../api/auth.api';
import Loader from "../components/ui/loader";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        // Safe check to ensure the API function exists before invoking it
        if (typeof getCurrentUser !== 'function') {
          throw new Error("getCurrentUser is not a function. Check your API imports.");
        }

        const response = await getCurrentUser();
        
        if (isMounted && response?.success && response?.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.success && response.data) {
        setUser(response.data);
      }
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
    } {
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