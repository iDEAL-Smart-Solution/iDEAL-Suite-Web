import { create } from "zustand";
import api from "../services/api";
import type { Feedback } from "../types/feedback";

/** Extract the feedback array + total from any likely response shape */
const extractFeedbackPayload = (resData: any): { feedback: Feedback[]; total: number } => {
  console.log("extractFeedbackPayload received:", resData);
  
  if (!resData) return { feedback: [], total: 0 };

  // Shape: { data: [...] }  or  { data: { data: [...], total } }
  const inner = resData.data ?? resData;
  if (Array.isArray(inner)) {
    return { feedback: inner, total: resData.total ?? inner.length };
  }
  if (inner && Array.isArray(inner.data)) {
    return { feedback: inner.data, total: inner.total ?? inner.data.length };
  }
  // Shape: plain array at top level
  if (Array.isArray(resData)) {
    return { feedback: resData, total: resData.length };
  }
  
  console.warn("extractFeedbackPayload: unexpected shape, returning empty");
  return { feedback: [], total: 0 };
};

interface FeedbackState {
  feedback: Feedback[];
  totalFeedback: number;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  fetchFeedback: (page?: number, limit?: number) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  feedback: [],
  totalFeedback: 0,
  isLoading: false,
  error: null,
  successMessage: null,

  fetchFeedback: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/feedback", {
        params: { page, limit },
      });
      if (res.status === 204 || !res.data) {
        set({ feedback: [], totalFeedback: 0, isLoading: false });
        return;
      }
      const { feedback, total } = extractFeedbackPayload(res.data);
      set({ feedback, totalFeedback: total, isLoading: false });
    } catch (err: any) {
      console.error("fetchFeedback error:", err);
      let message = "Failed to fetch feedback";
      if (err.response?.status === 404) {
        message = "⚠️ Backend API Missing: The endpoint GET /api/feedback is not implemented. Please add this endpoint to your backend to enable feedback viewing.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = `Error: ${err.message}`;
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
      error: null,
      successMessage: null,
    }),
}));
