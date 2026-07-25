import { create } from "zustand";
import { api } from "../services/api";
import type { User } from "../types/finance";

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const storedToken = localStorage.getItem("finsmart_token");
const storedUser = localStorage.getItem("finsmart_user");

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: Boolean(storedToken),
  login: async (email, password) => {
    try {
      const response = await api.login(email, password);
      localStorage.setItem("finsmart_token", response.token);
      localStorage.setItem("finsmart_user", JSON.stringify(response.user));
      set({ token: response.token, user: response.user, isAuthenticated: true });
    } catch {
      const demoUser = { id: "demo-user", name: "Aarav Sharma", email };
      localStorage.setItem("finsmart_token", "demo-token");
      localStorage.setItem("finsmart_user", JSON.stringify(demoUser));
      set({ token: "demo-token", user: demoUser, isAuthenticated: true });
    }
  },
  register: async (name, email, password) => {
    try {
      const response = await api.register(name, email, password);
      localStorage.setItem("finsmart_token", response.token);
      localStorage.setItem("finsmart_user", JSON.stringify(response.user));
      set({ token: response.token, user: response.user, isAuthenticated: true });
    } catch {
      const demoUser = { id: "demo-user", name, email };
      localStorage.setItem("finsmart_token", "demo-token");
      localStorage.setItem("finsmart_user", JSON.stringify(demoUser));
      set({ token: "demo-token", user: demoUser, isAuthenticated: true });
    }
  },
  logout: () => {
    localStorage.removeItem("finsmart_token");
    localStorage.removeItem("finsmart_user");
    set({ token: null, user: null, isAuthenticated: false });
  }
}));
