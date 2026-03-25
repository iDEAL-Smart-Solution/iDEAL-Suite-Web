import { create } from "zustand";
import api from "../services/api";
import type { Feedback } from "../types/feedback";

/** Extract the feedback array + total from any likely response shape */
const extractFeedbackPayload = (resData: any): { feedback: Feedback[]; total: number } => {
  if (!resData) return { feedback: [], total: 0 };

  // Shape: { data: [...] }  or  { data: { data: [...], total } }
  const inner = resData.data ?? resData;
  if (Array.isArray(inner)) {
    return { feedback: inner, total: resData.total ?? inner.length };
  }
  if (inner && Array.isArray(inner.data)) {
    return { feedback: inner.data, total: inner.total ?? inner.data.length };
  }
  // Shape: { items: [...] }
  if (inner && Array.isArray(inner.items)) {
    return { feedback: inner.items, total: inner.total ?? inner.items.length };
  }
  // Shape: plain array at top level
  if (Array.isArray(resData)) {
    return { feedback: resData, total: resData.length };
  }

  return { feedback: [], total: 0 };
};

interface FeedbackState {
  feedback: Feedback[];
  totalFeedback: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  submitFeedback: (payload: Partial<Feedback>) => Promise<boolean>;
  fetchFeedback: (page?: number, limit?: number) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  feedback: [],
  totalFeedback: 0,
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  submitFeedback: async (payload) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const res = await api.post("/Feedback/submit", payload);
      set({
        isSubmitting: false,
        successMessage: res.data?.message || "Feedback submitted successfully.",
      });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to submit feedback";
      set({ isSubmitting: false, error: message });
      return false;
    }
  },

  fetchFeedback: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/Feedback/all");
      if (res.status === 204 || !res.data) {
        set({ feedback: [], totalFeedback: 0, isLoading: false });
        return;
      }
      const { feedback: allFeedback, total } = extractFeedbackPayload(res.data);
      const start = (page - 1) * limit;
      const paginated = allFeedback.slice(start, start + limit);

      set({ feedback: paginated, totalFeedback: total, isLoading: false });
    } catch (err: any) {
      let message = "Failed to fetch feedback";
      if (err.response?.status === 404) {
        message = "Backend feedback endpoint is not available. Expected GET /api/Feedback/all.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      set({ isLoading: false, error: message, feedback: [], totalFeedback: 0 });
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),

  reset: () =>
    set({
      feedback: [],
      totalFeedback: 0,
      isLoading: false,
      isSubmitting: false,
      error: null,
      successMessage: null,
    }),
}));
