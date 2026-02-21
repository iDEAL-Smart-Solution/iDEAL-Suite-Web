import { create } from "zustand";
import api from "../services/api";
import type { User, CreateUserRequest, GetUsersResponse } from "../types/user";

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
      const res = await api.get<GetUsersResponse>(`/User/school/${schoolId}`, {
        params: { page, limit },
      });
      set({
        users: res.data.data ?? res.data,
        totalUsers: res.data.total ?? 0,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch users",
        isLoading: false,
      });
    }
  },

  searchUsers: async (schoolId, query, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<GetUsersResponse>(`/User/school/${schoolId}/search`, {
        params: { q: query, page, limit },
      });
      set({
        users: res.data.data ?? res.data,
        totalUsers: res.data.total ?? 0,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to search users",
        isLoading: false,
      });
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
