// src/hooks/useAuth.ts
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  autoRefreshToken,
} from "../api/services/AuthService";
import { useShallow } from "zustand/react/shallow";
import { useUsers } from "./useUsers";

interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

export const useAuth = () => {
  const { user, accessToken, setUser, setAccessToken, clearAuth } =
    useAuthStore(
      useShallow((state) => ({
        user: state.user,
        accessToken: state.accessToken,
        setUser: state.setUser,
        setAccessToken: state.setAccessToken,
        clearAuth: state.clearAuth,
      }))
    );
  const { fetchUserProfile, setCurrentUserProfile } = useUsers();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user, refreshToken } = await loginService(email, password);
      setUser(user);
      setCurrentUserProfile(user);
      setAccessToken(token);
      sessionStorage.setItem("refreshToken", refreshToken);
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
      setCurrentUserProfile;
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
  const autoLogin = async () => {
    setLoading(true);
    try {
      const token = await autoRefreshToken();
      if (token) {
        setAccessToken(token);
        const user = await fetchUserProfile();
        if (user) setUser(user);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    autoLogin,
    user,
    accessToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    loading,
    error,
    setAccessToken,
    login,
    register,
    logout,
    setUser,
  };
};
