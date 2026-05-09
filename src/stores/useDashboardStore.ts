import { create } from "zustand";
import api from "../services/api";
import type {
  DashboardStats,
  Product,
  ReportingSubscriptionOverview,
  UsageChartData,
} from "../types/dashboard";

const DASHBOARD_SCHOOL_METRICS_ENDPOINT = "/Dashboard/school";

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

const getReportingErrorMessage = (label: string, err: any) => {
  if (err.response?.status === 403) {
    return `${label} is blocked by the backend (403 Forbidden).`;
  }

  if (err.response?.status === 429) {
    return `${label} is rate limited by the backend (429 Too Many Requests).`;
  }

  return err.response?.data?.message || `Failed to load ${label.toLowerCase()}`;
};

interface DashboardState {
  stats: DashboardStats | null;
  usageData: UsageChartData[];
  productEngagementMySchool: Product[];
  productEngagementAll: Product[];
  subscriptionOverview: ReportingSubscriptionOverview | null;
  isLoading: boolean;
  error: string | null;
  errors: Record<string, string | null>;
  loadingState: Record<string, boolean>;

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
  errors: {},
  loadingState: {},

  fetchStats: async (schoolId) => {
    set((state) => ({
      loadingState: { ...state.loadingState, stats: true },
      error: null,
    }));
    try {
      const res = await api.get(`${DASHBOARD_SCHOOL_METRICS_ENDPOINT}/${schoolId}`);
      const stats: DashboardStats = res.data?.data ?? res.data;
      if (!stats || res.status === 204) {
        set((state) => ({
          stats: null,
          loadingState: { ...state.loadingState, stats: false },
          errors: { ...state.errors, stats: "No dashboard data available" },
        }));
        return;
      }
      set((state) => ({
        stats,
        loadingState: { ...state.loadingState, stats: false },
        errors: { ...state.errors, stats: null },
      }));
    } catch (err: any) {
      const errorMsg =
        err.response?.status === 403
          ? "You don't have permission to view dashboard data"
          : err.response?.data?.message || "Failed to load dashboard data";
      set((state) => ({
        loadingState: { ...state.loadingState, stats: false },
        errors: { ...state.errors, stats: errorMsg },
      }));
    }
  },

  fetchUinUsage: async () => {
    set((state) => ({
      loadingState: { ...state.loadingState, usage: true },
    }));
    try {
      const res = await api.get("/Reporting/uin-usage");
      set((state) => ({
        usageData: normalizeUsageChartData(res.data),
        loadingState: { ...state.loadingState, usage: false },
        errors: { ...state.errors, usage: null },
      }));
    } catch (err: any) {
      set((state) => ({
        loadingState: { ...state.loadingState, usage: false },
        errors: { ...state.errors, usage: getReportingErrorMessage("UIN usage report", err) },
      }));
    }
  },

  fetchProductEngagementMySchool: async () => {
    set((state) => ({
      loadingState: { ...state.loadingState, engagement: true },
    }));
    try {
      const res = await api.get("/Reporting/product-engagement/my-school");
      set((state) => ({
        productEngagementMySchool: normalizeProductEngagement(res.data),
        loadingState: { ...state.loadingState, engagement: false },
        errors: { ...state.errors, engagement: null },
      }));
    } catch (err: any) {
      set((state) => ({
        loadingState: { ...state.loadingState, engagement: false },
        errors: {
          ...state.errors,
          engagement: getReportingErrorMessage("Product engagement report", err),
        },
      }));
    }
  },

  fetchProductEngagementAll: async () => {
    set((state) => ({
      loadingState: { ...state.loadingState, engagementAll: true },
    }));
    try {
      const res = await api.get("/Reporting/product-engagement/all");
      set((state) => ({
        productEngagementAll: normalizeProductEngagement(res.data),
        loadingState: { ...state.loadingState, engagementAll: false },
        errors: { ...state.errors, engagementAll: null },
      }));
    } catch (err: any) {
      set((state) => ({
        loadingState: { ...state.loadingState, engagementAll: false },
        errors: {
          ...state.errors,
          engagementAll: getReportingErrorMessage("Platform product engagement report", err),
        },
      }));
    }
  },

  fetchSubscriptionOverview: async () => {
    set((state) => ({
      loadingState: { ...state.loadingState, subscriptions: true },
    }));
    try {
      const res = await api.get("/Reporting/subscriptions");
      set((state) => ({
        subscriptionOverview: normalizeSubscriptionOverview(res.data),
        loadingState: { ...state.loadingState, subscriptions: false },
        errors: { ...state.errors, subscriptions: null },
      }));
    } catch (err: any) {
      set((state) => ({
        loadingState: { ...state.loadingState, subscriptions: false },
        errors: {
          ...state.errors,
          subscriptions: getReportingErrorMessage("Subscriptions report", err),
        },
      }));
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
      errors: {},
      loadingState: {},
    }),
}));
