import { create } from "zustand";
import api from "../services/api";

// --- Types ---
export interface School {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  state: string;
  city?: string;
  totalStudents?: number;
  subscriptionStatus?: string;
  planType?: string;
  joinedDate?: string;
  createdAt?: string;
}

export interface RegisterSchoolPayload {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  state: string;
  planType: number;
}

interface SchoolState {
  schools: School[];
  totalSchools: number;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  fetchAllSchools: (page?: number, limit?: number) => Promise<void>;
  registerSchool: (data: RegisterSchoolPayload) => Promise<string>; // returns schoolId
  clearMessages: () => void;
  reset: () => void;
}

// --- Store ---
export const useSchoolStore = create<SchoolState>((set) => ({
  schools: [],
  totalSchools: 0,
  isLoading: false,
  error: null,
  successMessage: null,

  fetchAllSchools: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/School/all", { params: { page, limit } });
      set({
        schools: res.data.data ?? res.data,
        totalSchools: res.data.total ?? res.data.length ?? 0,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch schools",
        isLoading: false,
      });
    }
  },

  registerSchool: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/School/register", data);
      set({ isLoading: false, successMessage: "School registered successfully!" });
      return res.data.schoolId ?? res.data.data?.schoolId ?? res.data.id;
    } catch (err: any) {
      const msg =
        err.response?.status === 409
          ? "This email is already registered. Please login."
          : err.response?.data?.message || "Failed to register school";
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () => set({ schools: [], totalSchools: 0, error: null, successMessage: null }),
}));
