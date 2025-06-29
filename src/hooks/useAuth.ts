// src/hooks/useAuth.ts
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../api/services/AuthService";

interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

export const useAuth = () => {
  const { user, accessToken, setUser, setAccessToken, clearAuth } =
    useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await loginService(email, password);
      setUser(user);
      setAccessToken(token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await registerService(data);
      setUser(user);
      setAccessToken(token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutService();
      clearAuth();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    loading,
    error,
    login,
    register,
    logout,
    setUser,
  };
};
