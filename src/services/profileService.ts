import api from "./api";
import type {
  UserProfile,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/profile";
import { mockUserProfile } from "../mocks/profile.mock";

// Check if we're in demo mode
const isDemoMode = () => localStorage.getItem("token") === "demo-token";

export const profileService = {
  /**
   * Get user profile from localStorage or API
   */
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    try {
      // Return mock data in demo mode
      if (isDemoMode()) {
        return mockUserProfile;
      }

      // First try to get from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }

      // If not in localStorage, fetch from API
      const response = await api.get<UserProfile>(`/user/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    try {
      const response = await api.put<UpdateProfileResponse>(
        `/user/profile/${data.userId}`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
        }
      );

      // Update localStorage with new user info
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  /**
   * Change password
   */
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> => {
    try {
      const response = await api.put<ChangePasswordResponse>(
        `/user/change-password`,
        {
          userId: data.userId,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (userId: string, file: File): Promise<UserProfile> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<UserProfile>(
        `/user/avatar/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update localStorage
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  /**
   * Get role label from role number
   */
  getRoleLabel: (role: number): string => {
    const roleMap: { [key: number]: string } = {
      1: "SuperAdmin",
      2: "Staff",
      3: "Student",
      4: "Developer",
    };
    return roleMap[role] || "Unknown";
  },
};
