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
  isSyncing: boolean;
  error: string | null;
  successMessage: string | null;

  fetchAllStudents: () => Promise<void>;
  fetchMySchoolStudents: () => Promise<void>;
  syncStudent: (studentData: Partial<Student>) => Promise<void>;
  bulkSyncStudents: (studentsData: Partial<Student>[]) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  totalStudents: 0,
  isLoading: false,
  isSyncing: false,
  error: null,
  successMessage: null,

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

  fetchMySchoolStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/Student/my-school");
      const students = res.data.data ?? res.data ?? [];
      set({
        students,
        totalStudents: Array.isArray(students) ? students.length : 0,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch school students",
        isLoading: false,
      });
    }
  },

  syncStudent: async (studentData) => {
    set({ isSyncing: true, error: null, successMessage: null });
    try {
      const res = await api.post("/Student/sync", studentData);
      set({
        isSyncing: false,
        successMessage: res.data?.message || "Student synced successfully",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to sync student",
        isSyncing: false,
      });
      throw err;
    }
  },

  bulkSyncStudents: async (studentsData) => {
    set({ isSyncing: true, error: null, successMessage: null });
    try {
      const res = await api.post("/Student/bulk-sync", studentsData);
      set({
        isSyncing: false,
        successMessage: res.data?.message || `${studentsData.length} students synced successfully`,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to bulk sync students",
        isSyncing: false,
      });
      throw err;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () => set({ students: [], totalStudents: 0, error: null, successMessage: null }),
}));
