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

export interface UpdateSchoolPayload {
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
  deleteSchool: (id: string) => Promise<void>;
  updateSchool: (id: string, data: UpdateSchoolPayload) => Promise<void>;
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

  updateSchool: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/Admin/schools/${id}`, data);
      set((state) => ({
        schools: state.schools.map((s) =>
          s.id === id
            ? {
                ...s,
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                address: data.address,
                state: data.state,
                planType: data.planType === 1 ? "Local" : "Remote",
              }
            : s
        ),
        isLoading: false,
        successMessage: "School updated successfully.",
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update school",
        isLoading: false,
      });
      throw err;
    }
  },

  deleteSchool: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/Admin/schools/${id}`);
      set((state) => ({
        schools: state.schools.filter((s) => s.id !== id),
        totalSchools: Math.max(0, state.totalSchools - 1),
        isLoading: false,
        successMessage: "School deleted successfully.",
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete school",
        isLoading: false,
      });
      throw err;
    }
  },
}));
