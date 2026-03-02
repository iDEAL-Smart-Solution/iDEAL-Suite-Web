import { create } from "zustand";
import api from "../services/api";
import type {
  SystemConfiguration,
  CreateSystemConfigRequest,
  UpdateSystemConfigRequest,
  BulkCreateSystemConfigRequest,
} from "../types/system";

interface SystemConfigState {
  configurations: SystemConfiguration[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;

  fetchConfigurations: () => Promise<void>;
  createConfiguration: (data: CreateSystemConfigRequest) => Promise<void>;
  updateConfiguration: (id: string, data: UpdateSystemConfigRequest) => Promise<void>;
  deleteConfiguration: (id: string) => Promise<void>;
  bulkCreateConfigurations: (data: BulkCreateSystemConfigRequest) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

export const useSystemConfigStore = create<SystemConfigState>((set) => ({
  configurations: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,

  fetchConfigurations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/SystemConfigurations");
      if (res.status === 204 || !res.data) {
        set({ configurations: [], isLoading: false });
        return;
      }
      const configs = res.data?.data ?? res.data ?? [];
      set({
        configurations: Array.isArray(configs) ? configs : [],
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch system configurations",
        isLoading: false,
      });
    }
  },

  createConfiguration: async (data) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const res = await api.post("/SystemConfigurations", data);
      const newConfig: SystemConfiguration = res.data?.data ?? res.data;
      set((state) => ({
        configurations: [...state.configurations, newConfig],
        isSubmitting: false,
        successMessage: "System configuration created successfully",
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create system configuration",
        isSubmitting: false,
      });
      throw err;
    }
  },

  updateConfiguration: async (id, data) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const res = await api.put(`/SystemConfigurations/${id}`, data);
      const updatedConfig: SystemConfiguration = res.data?.data ?? res.data;
      set((state) => ({
        configurations: state.configurations.map((config) =>
          config.id === id ? updatedConfig : config
        ),
        isSubmitting: false,
        successMessage: "System configuration updated successfully",
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update system configuration",
        isSubmitting: false,
      });
      throw err;
    }
  },

  deleteConfiguration: async (id) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      await api.delete(`/SystemConfigurations/${id}`);
      set((state) => ({
        configurations: state.configurations.filter((config) => config.id !== id),
        isSubmitting: false,
        successMessage: "System configuration deleted successfully",
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete system configuration",
        isSubmitting: false,
      });
      throw err;
    }
  },

  bulkCreateConfigurations: async (data) => {
    set({ isSubmitting: true, error: null, successMessage: null });
    try {
      const res = await api.post("/SystemConfigurations/many", data);
      const newConfigs = res.data?.data ?? res.data ?? [];
      set((state) => ({
        configurations: [...state.configurations, ...newConfigs],
        isSubmitting: false,
        successMessage: `${newConfigs.length} system configurations created successfully`,
      }));
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to bulk create system configurations",
        isSubmitting: false,
      });
      throw err;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () =>
    set({
      configurations: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
      successMessage: null,
    }),
}));
