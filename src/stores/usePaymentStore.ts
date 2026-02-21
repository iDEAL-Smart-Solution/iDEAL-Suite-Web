import { create } from "zustand";
import api from "../services/api";
import type {
  InitializePaymentRequest,
  InitializePaymentResponse,
  PaymentRecord,
} from "../types/subscription";

interface PaymentState {
  payments: PaymentRecord[];
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  successMessage: string | null;

  initializePayment: (data: InitializePaymentRequest) => Promise<string | null>;
  fetchPayments: (schoolId: string) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  isLoading: false,
  isInitializing: false,
  error: null,
  successMessage: null,

  initializePayment: async (data) => {
    set({ isInitializing: true, error: null });
    try {
      const res = await api.post<InitializePaymentResponse>(
        "/SubscriptionPayment/initialize",
        data
      );

      const authUrl = res.data?.data?.authorizationUrl;

      set({
        isInitializing: false,
        successMessage: res.data?.message || "Payment initialized successfully!",
      });

      return authUrl || null;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Failed to initialize payment";
      set({ error: message, isInitializing: false });
      throw err;
    }
  },

  fetchPayments: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<PaymentRecord[] | { data: PaymentRecord[] }>(
        `/SubscriptionPayment/school/${schoolId}`
      );
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data as { data: PaymentRecord[] }).data ?? [];
      set({ payments: data, isLoading: false });
    } catch (err: any) {
      set({
        payments: [],
        error: err.response?.data?.message || "Failed to fetch payments",
        isLoading: false,
      });
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () =>
    set({
      payments: [],
      isLoading: false,
      isInitializing: false,
      error: null,
      successMessage: null,
    }),
}));
