import { create } from "zustand";
import api from "../services/api";
import type { DashboardStats } from "../types/dashboard";

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;

  fetchStats: (schoolId: string) => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<DashboardStats>(`/Dashboard/school/${schoolId}`);
      set({ stats: res.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to load dashboard data",
        isLoading: false,
      });
    }
  },

  reset: () => set({ stats: null, error: null }),
}));
