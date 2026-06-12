import { create } from "zustand";
import api from "../services/api";
import type { LandingPageRequest, LandingPageResponse } from "../types/landingPage";

interface LandingPageState {
  landingPage: LandingPageResponse | null;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchLandingPage: () => Promise<void>;
  createLandingPage: (data: LandingPageRequest) => Promise<void>;
  updateLandingPage: (data: LandingPageRequest) => Promise<void>;
  deleteLandingPage: () => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useLandingPageStore = create<LandingPageState>((set) => ({
  landingPage: null,
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  successMessage: null,

  fetchLandingPage: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/LandingPage");
      set({ landingPage: res.data?.data ?? res.data, isLoading: false });
    } catch (err: any) {
      // 404 just means no landing page exists yet — not an error state
      if (err.response?.status === 404) {
        set({ landingPage: null, isLoading: false });
      } else {
        set({
          error: err.response?.data?.message || "Failed to fetch landing page.",
          isLoading: false,
        });
      }
    }
  },

  createLandingPage: async (data) => {
    set({ isSaving: true, error: null, successMessage: null });
    try {
      const res = await api.post("/LandingPage", data);
      set({
        landingPage: res.data?.data ?? res.data,
        isSaving: false,
        successMessage: res.data?.message || "Landing page created successfully!",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create landing page.",
        isSaving: false,
      });
      throw err;
    }
  },

  updateLandingPage: async (data) => {
    set({ isSaving: true, error: null, successMessage: null });
    try {
      const res = await api.put("/LandingPage", data);
      set({
        landingPage: res.data?.data ?? res.data,
        isSaving: false,
        successMessage: res.data?.message || "Landing page updated successfully!",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update landing page.",
        isSaving: false,
      });
      throw err;
    }
  },

  deleteLandingPage: async () => {
    set({ isDeleting: true, error: null, successMessage: null });
    try {
      await api.delete("/LandingPage");
      set({
        landingPage: null,
        isDeleting: false,
        successMessage: "Landing page deleted successfully.",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete landing page.",
        isDeleting: false,
      });
      throw err;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () =>
    set({
      landingPage: null,
      isLoading: false,
      isSaving: false,
      isDeleting: false,
      error: null,
      successMessage: null,
    }),
}));
