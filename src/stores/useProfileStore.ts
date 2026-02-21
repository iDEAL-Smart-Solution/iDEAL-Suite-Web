import { create } from "zustand";
import api from "../services/api";
import type { UserProfile, UpdateProfileRequest } from "../types/profile";

const getRoleLabel = (role: number): string => {
  const map: Record<number, string> = {
    0: "Developer",
    1: "SuperAdmin",
    2: "Staff",
    3: "Student",
  };
  return map[role] || "Unknown";
};

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<void>;
  uploadAvatar: (userId: string, file: File) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  successMessage: null,

  fetchProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<UserProfile>(`/User/profile/${userId}`);
      set({
        profile: { ...res.data, roleLabel: getRoleLabel(res.data.role) },
        isLoading: false,
      });
    } catch (err: any) {
      // Try from session if API fails
      const raw = sessionStorage.getItem("ideal_user");
      if (raw) {
        const u = JSON.parse(raw);
        set({
          profile: {
            userId: u.id,
            firstName: u.fullName?.split(" ")[0] || "",
            lastName: u.fullName?.split(" ").slice(1).join(" ") || "",
            email: u.email,
            uin: u.uin || "",
            role: u.role,
            roleLabel: getRoleLabel(u.role),
            schoolId: u.schoolId || "",
          },
          isLoading: false,
        });
      } else {
        set({
          error: err.response?.data?.message || "Failed to load profile",
          isLoading: false,
        });
      }
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/User/profile/${data.userId}`, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });
      const user = res.data.user ?? res.data;
      set({
        profile: { ...user, roleLabel: getRoleLabel(user.role) },
        isLoading: false,
        successMessage: "Profile updated successfully!",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update profile",
        isLoading: false,
      });
    }
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await api.put("/User/change-password", { userId, currentPassword, newPassword });
      set({ isLoading: false, successMessage: "Password changed successfully!" });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to change password",
        isLoading: false,
      });
    }
  },

  uploadAvatar: async (userId, file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/User/avatar/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const user = res.data;
      set({
        profile: { ...user, roleLabel: getRoleLabel(user.role) },
        isLoading: false,
        successMessage: "Avatar uploaded successfully!",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to upload avatar",
        isLoading: false,
      });
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () => set({ profile: null, error: null, successMessage: null }),
}));
