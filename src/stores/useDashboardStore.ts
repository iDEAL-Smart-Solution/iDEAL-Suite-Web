import { create } from "zustand";
import api from "../services/api";
import type {
  DashboardStats,
  Product,
  ReportingSubscriptionOverview,
  UsageChartData,
} from "../types/dashboard";

const normalizeUsageChartData = (payload: unknown): UsageChartData[] => {
  const value = (payload as any)?.data ?? payload;

  if (Array.isArray(value)) {
    return value
      .map((entry: any) => ({
        name: String(entry?.name ?? entry?.label ?? entry?.productName ?? "Unknown"),
        count: Number(entry?.count ?? entry?.value ?? entry?.usageCount ?? 0),
      }))
      .filter((entry) => Number.isFinite(entry.count));
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).map(([name, count]) => ({
      name,
      count: Number(count ?? 0),
    }));
  }

  return [];
};

const normalizeProductEngagement = (payload: unknown): Product[] => {
  const value = (payload as any)?.data ?? payload;
  const list = Array.isArray(value)
    ? value
    : Array.isArray((value as any)?.products)
      ? (value as any).products
      : Array.isArray((value as any)?.items)
        ? (value as any).items
        : [];

  return list.map((product: any, index: number) => {
    const isActive =
      typeof product?.isActive === "boolean"
        ? product.isActive
        : String(product?.status ?? "active").toLowerCase() === "active";

    return {
      id: String(product?.id ?? product?.productId ?? product?.code ?? index),
      name: String(product?.name ?? product?.productName ?? "Unnamed Product"),
      usageCount: Number(product?.usageCount ?? product?.engagementCount ?? 0),
      status: isActive ? "Active" : "Inactive",
      lastUsed: product?.lastUsed ?? product?.lastUsedAt,
    };
  });
};

const normalizeSubscriptionOverview = (payload: unknown): ReportingSubscriptionOverview => {
  const value = (payload as any)?.data ?? payload ?? {};

  return {
    totalSubscriptions: Number(
      (value as any)?.totalSubscriptions ?? (value as any)?.total ?? 0
    ),
    activeSubscriptions: Number(
      (value as any)?.activeSubscriptions ?? (value as any)?.active ?? 0
    ),
    pendingSubscriptions: Number(
      (value as any)?.pendingSubscriptions ?? (value as any)?.pending ?? 0
    ),
    deactivatedSubscriptions: Number(
      (value as any)?.deactivatedSubscriptions ?? (value as any)?.deactivated ?? 0
    ),
    expiringSoon: Number((value as any)?.expiringSoon ?? (value as any)?.expiring ?? 0),
  };
};

interface DashboardState {
  stats: DashboardStats | null;
  usageData: UsageChartData[];
  productEngagementMySchool: Product[];
  productEngagementAll: Product[];
  subscriptionOverview: ReportingSubscriptionOverview | null;
  isLoading: boolean;
  error: string | null;

  fetchStats: (schoolId: string) => Promise<void>;
  fetchUinUsage: () => Promise<void>;
  fetchProductEngagementMySchool: () => Promise<void>;
  fetchProductEngagementAll: () => Promise<void>;
  fetchSubscriptionOverview: () => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  usageData: [],
  productEngagementMySchool: [],
  productEngagementAll: [],
  subscriptionOverview: null,
  isLoading: false,
  error: null,

  fetchStats: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/Dashboard/school/${schoolId}`);
      const stats: DashboardStats = res.data?.data ?? res.data;
      if (!stats || res.status === 204) {
        set({ stats: null, error: "No dashboard data available", isLoading: false });
        return;
      }
      set({ stats, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to load dashboard data",
        isLoading: false,
      });
    }
  },

  fetchUinUsage: async () => {
    try {
      const res = await api.get("/Reporting/uin-usage");
      set({ usageData: normalizeUsageChartData(res.data) });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to load UIN usage report",
      });
    }
  },

  fetchProductEngagementMySchool: async () => {
    try {
      const res = await api.get("/Reporting/product-engagement/my-school");
      set({ productEngagementMySchool: normalizeProductEngagement(res.data) });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Failed to load product engagement report",
      });
    }
  },

  fetchProductEngagementAll: async () => {
    try {
      const res = await api.get("/Reporting/product-engagement/all");
      set({ productEngagementAll: normalizeProductEngagement(res.data) });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to load platform product engagement report",
      });
    }
  },

  fetchSubscriptionOverview: async () => {
    try {
      const res = await api.get("/Reporting/subscriptions");
      set({ subscriptionOverview: normalizeSubscriptionOverview(res.data) });
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Failed to load subscriptions report",
      });
    }
  },

  reset: () =>
    set({
      stats: null,
      usageData: [],
      productEngagementMySchool: [],
      productEngagementAll: [],
      subscriptionOverview: null,
      error: null,
    }),
}));
