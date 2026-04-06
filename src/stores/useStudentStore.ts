import { create } from "zustand";
import api from "../services/api";
import type { Student as DisplayStudent } from "../types/student";

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
  displayStudents: DisplayStudent[];
  totalStudents: number;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  successMessage: string | null;

  fetchAllStudents: () => Promise<void>;
  fetchMySchoolStudents: () => Promise<void>;
  fetchDisplayStudents: (page?: number, limit?: number) => Promise<void>;
  syncStudent: (studentData: Partial<Student>) => Promise<void>;
  bulkSyncStudents: (studentsData: Partial<Student>[]) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  displayStudents: [],
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

  fetchDisplayStudents: async (page = 1, limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/Student/all-in-system", {
        params: { page, limit },
      });

      console.log("fetchDisplayStudents response:", res.data);

      if (res.status === 204 || !res.data) {
        set({ displayStudents: [], totalStudents: 0, isLoading: false });
        return;
      }

      const data = res.data.data ?? res.data ?? [];
      const displayStudents = Array.isArray(data)
        ? data.map((student: any) => ({
            schoolName: String(student?.schoolName ?? "N/A"),
            uin: String(student?.uin ?? "N/A"),
            firstName: String(student?.firstName ?? ""),
            lastName: String(student?.lastName ?? ""),
            middleName: String(student?.middleName ?? ""),
            gender: String(student?.gender ?? "N/A"),
            email: String(student?.email ?? "N/A"),
            dateOfBirth: student?.dateOfBirth ?? "",
            className: String(student?.className ?? "N/A"),
            phoneNumber: String(student?.phoneNumber ?? "N/A"),
            sourceSystem: String(student?.sourceSystem ?? "N/A"),
          }))
        : [];

      set({
        displayStudents,
        totalStudents: displayStudents.length,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("fetchDisplayStudents error:", err);
      let message = "Failed to fetch students";

      if (err.response?.status === 404) {
        message =
          "⚠️ Backend API Missing: The endpoint GET /api/Student/all-in-system is not implemented. Please add this endpoint to your backend to view students.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      set({ displayStudents: [], totalStudents: 0, error: message, isLoading: false });
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
  reset: () => set({ students: [], displayStudents: [], totalStudents: 0, error: null, successMessage: null }),
}));
