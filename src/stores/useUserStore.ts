import { create } from "zustand";
import api from "../services/api";
import type { User, CreateUserRequest, UserRoleType } from "../types/user";
import { UserRole } from "../types/user";

/** Backend returns roles as strings – map them to the numeric UserRole values */
const roleStringToNumber: Record<string, UserRoleType> = {
  SuperAdmin: UserRole.SuperAdmin,
  SchoolAdmin: UserRole.SuperAdmin,
  Staff: UserRole.Staff,
  Student: UserRole.Student,
  Dev: UserRole.Dev,
};

const normalizeRole = (role: unknown): UserRoleType => {
  if (typeof role === "number") return role as UserRoleType;
  if (typeof role === "string") return roleStringToNumber[role] ?? UserRole.Student;
  return UserRole.Student;
};

/** Ensure every user object coming from the API has a numeric role */
const normalizeUsers = (raw: any[]): User[] => {
  if (!Array.isArray(raw)) {
    console.warn("normalizeUsers: expected array, got:", raw);
    return [];
  }
  return raw.map((u) => ({ ...u, role: normalizeRole(u.role) }));
};

/** Extract the users array + total from any likely response shape */
const extractUsersPayload = (resData: any): { users: User[]; total: number } => {
  console.log("extractUsersPayload received:", resData);
  
  if (!resData) return { users: [], total: 0 };

  // Shape: { data: [...] }  or  { data: { data: [...], total } }
  const inner = resData.data ?? resData;
  if (Array.isArray(inner)) {
    const users = normalizeUsers(inner);
    return { users, total: resData.total ?? users.length };
  }
  if (inner && Array.isArray(inner.data)) {
    const users = normalizeUsers(inner.data);
    return { users, total: inner.total ?? users.length };
  }
  // Shape: plain array at top level
  if (Array.isArray(resData)) {
    const users = normalizeUsers(resData);
    return { users, total: users.length };
  }
  
  console.warn("extractUsersPayload: unexpected shape, returning empty");
  return { users: [], total: 0 };
};

interface UserState {
  users: User[];
  totalUsers: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchUsers: (schoolId: string, page?: number, limit?: number) => Promise<void>;
  searchUsers: (schoolId: string, query: string, page?: number, limit?: number) => Promise<void>;
  createUser: (data: CreateUserRequest) => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  registerUser: (data: CreateUserRequest) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  totalUsers: 0,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  fetchUsers: async (schoolId, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/User/school/${schoolId}`, {
        params: { page, limit },
      });
      if (res.status === 204 || !res.data) {
        set({ users: [], totalUsers: 0, isLoading: false });
        return;
      }
      const { users, total } = extractUsersPayload(res.data);
      set({ users, totalUsers: total, isLoading: false });
    } catch (err: any) {
      console.error("fetchUsers error:", err);
      let message = "Failed to fetch users";
      if (err.response?.status === 404) {
        message = "⚠️ Backend API Missing: The endpoint GET /api/User/school/{schoolId} is not implemented. Please add this endpoint to your backend to enable user management.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      set({ users: [], totalUsers: 0, error: message, isLoading: false });
    }
  },

  searchUsers: async (schoolId, query, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/User/school/${schoolId}/search`, {
        params: { q: query, page, limit },
      });
      if (res.status === 204 || !res.data) {
        set({ users: [], totalUsers: 0, isLoading: false });
        return;
      }
      const { users, total } = extractUsersPayload(res.data);
      set({ users, totalUsers: total, isLoading: false });
    } catch (err: any) {
      console.error("searchUsers error:", err);
      let message = "Failed to search users";
      if (err.response?.status === 404) {
        message = "⚠️ Backend API Missing: The endpoint GET /api/User/school/{schoolId}/search is not implemented.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      set({ users: [], totalUsers: 0, error: message, isLoading: false });
    }
  },

  createUser: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      await api.post("/User/register", data);
      set({ isSubmitting: false, successMessage: "User created successfully" });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create user",
        isSubmitting: false,
      });
      throw err;
    }
  },

  registerUser: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      await api.post("/User/register", data);
      set({ isSubmitting: false, successMessage: "Admin account created successfully!" });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Account creation failed",
        isSubmitting: false,
      });
      throw err;
    }
  },

  updateUser: async (userId, data) => {
    set({ isSubmitting: true, error: null });
    try {
      await api.put(`/User/${userId}`, data);
      set({ isSubmitting: false, successMessage: "User updated successfully" });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update user",
        isSubmitting: false,
      });
      throw err;
    }
  },

  deleteUser: async (userId) => {
    set({ isSubmitting: true, error: null });
    try {
      await api.delete(`/User/${userId}`);
      // Remove from local list
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
        totalUsers: state.totalUsers - 1,
        isSubmitting: false,
        successMessage: "User deleted successfully",
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete user",
        isSubmitting: false,
      });
      throw err;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () => set({ users: [], totalUsers: 0, error: null, successMessage: null }),
}));
