import { create } from "zustand";
import api from "../services/api";
import type {
  Subscription,
  CreateSubscriptionRequest,
  SubscriptionResponse,
  SubscriptionHistoryResponse,
} from "../types/subscription";

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
  checkHasActive: (schoolId: string) => Promise<boolean>;
  createSubscription: (data: CreateSubscriptionRequest) => Promise<void>;
  fetchExpiringSubscriptions: (daysThreshold?: number) => Promise<void>;
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
      const res = await api.get<Subscription>(`/Subscription/active/${schoolId}`);
      const sub = res.data;
      let remaining = 0;
      if (sub) {
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
      set({
        currentSubscription: null,
        error: err.response?.data?.message || "Failed to fetch subscription",
        isLoading: false,
      });
    }
  },

  fetchSubscriptionHistory: async (schoolId, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<SubscriptionHistoryResponse>(
        `/Subscription/history/${schoolId}`,
        { params: { page, limit } }
      );
      set({
        subscriptionHistory: res.data.data ?? res.data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch subscription history",
        isLoading: false,
      });
    }
  },

  checkHasActive: async (schoolId) => {
    try {
      const res = await api.get<{ hasActive: boolean }>(
        `/Subscription/has-active/${schoolId}`
      );
      const active = res.data.hasActive;
      set({ hasActive: active });
      return active;
    } catch {
      return false;
    }
  },

  createSubscription: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await api.post<SubscriptionResponse>("/Subscription/create", data);
      set({
        isSubmitting: false,
        successMessage: res.data.message || "Subscription created successfully!",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create subscription",
        isSubmitting: false,
      });
      throw err;
    }
  },

  fetchExpiringSubscriptions: async (daysThreshold = 30) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<SubscriptionHistoryResponse>("/Subscription/expiring", {
        params: { daysThreshold },
      });
      set({
        subscriptionHistory: res.data.data ?? res.data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch expiring subscriptions",
        isLoading: false,
      });
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
