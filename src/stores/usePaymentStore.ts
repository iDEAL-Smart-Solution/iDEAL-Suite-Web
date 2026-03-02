import { create } from "zustand";
import api from "../services/api";
import type {
  InitializePaymentRequest,
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
    console.log("usePaymentStore.initializePayment called with:", data);
    
    try {
      const res = await api.post("/SubscriptionPayment/initialize", data);
      console.log("Payment initialization response:", res);
      console.log("Response data:", res.data);

      // Handle 204 No Content
      if (res.status === 204 || !res.data) {
        console.error("204 No Content or empty response");
        set({
          isInitializing: false,
          error: "Payment service returned no content. Please try again.",
        });
        return null;
      }

      const payload = res.data?.data ?? res.data;
      console.log("Extracted payload:", payload);
      
      const authUrl = payload?.authorizationUrl;
      console.log("Authorization URL:", authUrl);

      if (!authUrl) {
        console.error("No authorizationUrl in payload:", payload);
        set({
          isInitializing: false,
          error: "No payment URL received from server. Response: " + JSON.stringify(payload),
        });
        return null;
      }

      set({
        isInitializing: false,
        successMessage: res.data?.message || "Payment initialized successfully!",
      });

      return authUrl;
    } catch (err: any) {
      console.error("Payment initialization error:", err);
      console.error("Error response:", err.response?.data);
      
      let message = "Failed to initialize payment";
      if (err.response?.status === 404) {
        message = "⚠️ Payment endpoint not found. Ensure /api/SubscriptionPayment/initialize exists.";
      } else if (err.response?.status === 500) {
        message = `⚠️ Server error: ${err.response?.data?.message || err.response?.data?.title || "Internal server error"}`;  
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.title) {
        message = err.response.data.title;
      } else if (err.message) {
        message = err.message;
      }
      
      set({ error: message, isInitializing: false });
      throw err;
    }
  },

  fetchPayments: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/SubscriptionPayment/school/${schoolId}`);

      // Handle 204 No Content
      if (res.status === 204 || !res.data) {
        set({ payments: [], isLoading: false });
        return;
      }

      const payload = res.data?.data ?? res.data;
      const data = Array.isArray(payload) ? payload : [];
      set({ payments: data, isLoading: false });
    } catch (err: any) {
      console.error("fetchPayments error:", err);
      let message = "Failed to fetch payments";
      if (err.response?.status === 404) {
        message = "⚠️ Backend API Missing: The endpoint GET /api/SubscriptionPayment/school/{schoolId} is not implemented. Please add this endpoint to your backend to view payment history.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      set({ payments: [], error: message, isLoading: false });
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
