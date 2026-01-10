import api from "./api";
import type {
  User,
  CreateUserRequest,
  GetUsersResponse,
} from "../types/user";
import { mockDashboardUsers, mockUsers } from "../mocks/users.mock";

// Check if we're in demo mode
const isDemoMode = () => localStorage.getItem("token") === "demo-token";

export const userService = {
  /**
   * Fetch all users for a school
   */
  getUsers: async (
    schoolId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<GetUsersResponse> => {
    try {
      // Return mock data in demo mode
      if (isDemoMode()) {
        return mockDashboardUsers as GetUsersResponse;
      }

      const response = await api.get<GetUsersResponse>(
        `/user/school/${schoolId}`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post<User>("/user/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  /**
   * Get a single user by ID
   */
  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  /**
   * Update a user
   */
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<User>(`/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  /**
   * Delete a user
   */
  deleteUser: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/user/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  /**
   * Search users by name, email, or UIN
   */
  searchUsers: async (
    schoolId: string,
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<GetUsersResponse> => {
    try {
      // Return mock data in demo mode
      if (isDemoMode()) {
        const lowerQuery = query.toLowerCase();
        const filtered = mockUsers.filter(
          (u) =>
            u.firstName.toLowerCase().includes(lowerQuery) ||
            u.lastName.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery)
        );

        const startIndex = (page - 1) * limit;
        const paginatedData = filtered.slice(startIndex, startIndex + limit);

        return {
          data: paginatedData,
          total: filtered.length,
          page,
          limit,
        };
      }

      const response = await api.get<GetUsersResponse>(
        `/user/school/${schoolId}/search`,
        {
          params: { q: query, page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },
};
