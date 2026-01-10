import api from "./api";
import type { DashboardStats } from "../types/dashboard";
import { mockDashboardStats } from "../mocks/dashboard.mock";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  } catch (error) {
    // Return mock data if API fails (for development)
    console.warn("Using mock dashboard data (backend not available)");
    return mockDashboardStats;
  }
};
