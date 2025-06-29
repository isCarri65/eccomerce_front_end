// src/stores/authStore.ts
import { create } from "zustand";
import { IUser } from "../types/User/IUser";

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  setUser: (user: IUser) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => set({ user: null, accessToken: null }),
}));
