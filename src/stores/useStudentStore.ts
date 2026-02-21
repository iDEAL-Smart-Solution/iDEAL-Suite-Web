import { create } from "zustand";
import api from "../services/api";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  schoolId: string;
  uin?: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface StudentState {
  students: Student[];
  totalStudents: number;
  isLoading: boolean;
  error: string | null;

  fetchAllStudents: () => Promise<void>;
  reset: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  totalStudents: 0,
  isLoading: false,
  error: null,

  fetchAllStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/Student/all-in-system");
      const students = res.data.data ?? res.data ?? [];
      set({
        students,
        totalStudents: Array.isArray(students) ? students.length : 0,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch students",
        isLoading: false,
      });
    }
  },

  reset: () => set({ students: [], totalStudents: 0, error: null }),
}));
