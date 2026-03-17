import { create } from "zustand";
import api from "../services/api";
import type {
  Subscription,
  CreateSubscriptionRequest,
} from "../types/subscription";

const normalizeSubscriptionStatus = (value: unknown): 1 | 2 | 3 => {
  const numeric = Number(value);
  if (numeric === 1 || numeric === 2 || numeric === 3) return numeric;

  const label = String(value ?? "").toLowerCase();
  if (label === "active") return 1;
  if (label === "deactivated" || label === "inactive") return 3;
  return 2;
};

const normalizeReportingSubscriptions = (payload: unknown): Subscription[] => {
  const value = (payload as any)?.data ?? payload;
  const list = Array.isArray(value)
    ? value
    : Array.isArray((value as any)?.subscriptions)
      ? (value as any).subscriptions
      : Array.isArray((value as any)?.items)
        ? (value as any).items
        : [];

  return list.map((sub: any, index: number) => {
    const status = normalizeSubscriptionStatus(
      sub?.status ?? sub?.subscriptionStatus ?? sub?.statusCode
    );

    return {
      id: String(sub?.id ?? sub?.subscriptionId ?? `report-sub-${index}`),
      schoolId: String(sub?.schoolId ?? sub?.schoolName ?? "N/A"),
      paidStudentSlots: Number(
        sub?.paidStudentSlots ?? sub?.studentSlots ?? sub?.subscribedSlots ?? 0
      ),
      startDate:
        sub?.startDate ?? sub?.createdAt ?? new Date().toISOString(),
      expiryDate:
        sub?.expiryDate ?? sub?.endDate ?? new Date().toISOString(),
      paymentMethod: String(sub?.paymentMethod ?? "Card") as
        | "Card"
        | "Bank Transfer"
        | "PayStack"
        | "Cash",
      status,
      planType:
        String(sub?.planType ?? "Local").toLowerCase() === "remote"
          ? "Remote"
          : "Local",
      createdAt: sub?.createdAt,
      updatedAt: sub?.updatedAt,
    };
  });
};

interface SubscriptionState {
  currentSubscription: Subscription | null;
  subscriptionHistory: Subscription[];
  daysRemaining: number;
  hasActive: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchCurrentSubscription: (schoolId: string) => Promise<void>;
  fetchSubscriptionHistory: (schoolId: string, page?: number, limit?: number) => Promise<void>;
  fetchReportingSubscriptions: () => Promise<void>;
  checkHasActive: (schoolId: string) => Promise<boolean>;
  createSubscription: (data: CreateSubscriptionRequest) => Promise<void>;
  fetchExpiringSubscriptions: (daysThreshold?: number) => Promise<void>;
  markExpiredSubscriptions: () => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  currentSubscription: null,
  subscriptionHistory: [],
  daysRemaining: 0,
  hasActive: false,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  fetchCurrentSubscription: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/Subscription/active/${schoolId}`);
      const sub: Subscription | null = res.data?.data ?? res.data ?? null;
      // Handle 204 No Content or empty response
      if (!sub || typeof sub !== "object" || res.status === 204) {
        set({ currentSubscription: null, daysRemaining: 0, hasActive: false, isLoading: false });
        return;
      }
      let remaining = 0;
      if (sub.expiryDate) {
        const expiry = new Date(sub.expiryDate);
        remaining = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      }
      set({
        currentSubscription: sub,
        daysRemaining: remaining,
        hasActive: !!sub,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("fetchCurrentSubscription error:", err);
      const message = err.response?.data?.message || err.message || "Failed to fetch subscription";
      set({ currentSubscription: null, error: message, isLoading: false });
    }
  },

  fetchSubscriptionHistory: async (schoolId, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/Subscription/history/${schoolId}`, {
        params: { page, limit },
      });
      console.log("fetchSubscriptionHistory response:", res.data);
      
      if (res.status === 204 || !res.data) {
        set({ subscriptionHistory: [], isLoading: false });
        return;
      }
      const list = res.data?.data ?? res.data;
      const history = Array.isArray(list) ? list : [];
      console.log("subscription history extracted:", history);
      
      set({ subscriptionHistory: history, isLoading: false });
    } catch (err: any) {
      console.error("fetchSubscriptionHistory error:", err);
      let message = "Failed to fetch subscription history";
      if (err.response?.status === 404) {
        message = "⚠️ Backend API Missing: The endpoint GET /api/Subscription/history/{schoolId} is not implemented. Please add this endpoint to your backend to view subscription history.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      set({ subscriptionHistory: [], error: message, isLoading: false });
    }
  },

  fetchReportingSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/Reporting/subscriptions");
      set({
        subscriptionHistory: normalizeReportingSubscriptions(res.data),
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch subscriptions report",
        isLoading: false,
      });
    }
  },

  checkHasActive: async (schoolId) => {
    try {
      const res = await api.get(`/Subscription/has-active/${schoolId}`);
      const payload = res.data?.data ?? res.data;
      const active = payload?.hasActive ?? false;
      set({ hasActive: active });
      return active;
    } catch {
      return false;
    }
  },

  createSubscription: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      console.log("Creating subscription with data:", data);
      const res = await api.post("/Subscription/create", data);
      const payload = res.data?.data ?? res.data;
      set({
        isSubmitting: false,
        successMessage:
          res.data?.message || payload?.message || "Subscription created successfully!",
      });
    } catch (err: any) {
      console.error("createSubscription error:", err);
      console.error("Error response:", err.response?.data);
      
      let message = "Failed to create subscription";
      if (err.response?.status === 500) {
        message = `⚠️ Server Error: ${err.response?.data?.message || err.response?.data?.title || "Internal server error while creating subscription. Please check your backend logs."}`;
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.title) {
        message = err.response.data.title;
      } else if (err.message) {
        message = err.message;
      }
      
      set({ error: message, isSubmitting: false });
      throw err;
    }
  },

  fetchExpiringSubscriptions: async (daysThreshold = 30) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/Subscription/expiring", {
        params: { daysThreshold },
      });
      if (res.status === 204 || !res.data) {
        set({ subscriptionHistory: [], isLoading: false });
        return;
      }
      const list = res.data?.data ?? res.data;
      set({
        subscriptionHistory: Array.isArray(list) ? list : [],
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch expiring subscriptions",
        isLoading: false,
      });
    }
  },

  markExpiredSubscriptions: async () => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const res = await api.post("/Subscription/mark-expired");
      const message = res.data?.message || "Expired subscriptions marked successfully";
      set({
        isSubmitting: false,
        successMessage: message,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to mark expired subscriptions",
        isSubmitting: false,
      });
      throw err;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () =>
    set({
      currentSubscription: null,
      subscriptionHistory: [],
      daysRemaining: 0,
      hasActive: false,
      error: null,
      successMessage: null,
    }),
}));
