import { apiFetch } from "./api";
import type { DashboardStats } from "../types/dashboard";

export const getDashboardStats = () => {
  return apiFetch<DashboardStats>("/dashboard/stats");
};
