import { create } from "zustand";
import api from "../services/api";

// --- Types ---
interface BackendLoginData {
  token: string;
  userId: string;
  uin: string;
  fullName: string;
  email: string;
  role: string;
  schoolId: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: number;
  schoolId?: string;
  fullName?: string;
  uin?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

// --- Helpers ---
const TOKEN_KEY = "ideal_token";
const USER_KEY = "ideal_user";

const roleMap: Record<string, number> = {
  Dev: 0,
  SchoolAdmin: 1,
  Staff: 2,
  Student: 3,
};

const mapRole = (role: string): number => roleMap[role] ?? 1;

// --- Store ---
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<{ success: boolean; message: string; data: BackendLoginData }>(
        "/Auth/login",
        { email, password }
      );

      const d = res.data.data;
      const user: AuthUser = {
        id: d.userId,
        email: d.email,
        role: mapRole(d.role),
        schoolId: d.schoolId,
        fullName: d.fullName,
        uin: d.uin,
      };

      sessionStorage.setItem(TOKEN_KEY, d.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));

      set({ user, token: d.token, isLoading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Incorrect email or password";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    set({ user: null, token: null });
  },

  hydrate: () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const raw = sessionStorage.getItem(USER_KEY);
    if (token && raw) {
      set({ token, user: JSON.parse(raw) });
    }
  },
}));
