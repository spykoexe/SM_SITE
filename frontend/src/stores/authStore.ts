import { create } from "zustand";
import { api } from "@/services/api";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  displayName?: string;
  avatarUrl?: string;
  theme?: string;
  language?: string;
  notificationEmail?: boolean;
  twoFactorEnabled?: boolean;
  phone?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ requires2FA?: boolean; tempToken?: string }>;
  verify2FA: (tempToken: string, code: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string; displayName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  init: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (!res.success) throw new Error(res.message || "Erreur de connexion");
    if (res.data.requires2FA) {
      return { requires2FA: true, tempToken: res.data.tempToken };
    }
    localStorage.setItem("accessToken", res.data.tokens.accessToken);
    localStorage.setItem("refreshToken", res.data.tokens.refreshToken);
    set({ user: res.data.user, isAuthenticated: true });
    return {};
  },

  verify2FA: async (tempToken, code) => {
    const res = await api.post("/auth/2fa/verify", { tempToken, code });
    if (!res.success) throw new Error(res.message || "Code invalide");
    localStorage.setItem("accessToken", res.data.tokens.accessToken);
    localStorage.setItem("refreshToken", res.data.tokens.refreshToken);
    set({ user: res.data.user, isAuthenticated: true });
  },

  register: async (data) => {
    const res = await api.post("/auth/register", data);
    if (!res.success) throw new Error(res.message || "Erreur d'inscription");
  },

  logout: async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthenticated: false });
  },

  init: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await api.get("/users/profile");
      if (res?.success) {
        set({ user: res.data, isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
}));
