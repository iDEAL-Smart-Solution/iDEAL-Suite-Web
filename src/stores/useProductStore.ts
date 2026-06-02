import { create } from "zustand";
import api from "../services/api";
import { useAuthStore } from "./useAuthStore";
import type {
  Product,
  GetProductsResponse,
  CreateProductRequest,
} from "../types/product";

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  searchQuery: string;
  filterOption: "all" | "active" | "inactive" | "subscription";
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;

  fetchProducts: (schoolId?: string) => Promise<void>;
  setSearch: (query: string) => void;
  setFilter: (filter: "all" | "active" | "inactive" | "subscription") => void;
  selectProduct: (product: Product | null) => void;
  createProduct: (data: CreateProductRequest) => Promise<void>;
  toggleProductStatus: (productId: string, currentStatus: boolean) => Promise<void>;
  launchProduct: (productId: string) => Promise<void>;
  clearMessages: () => void;
  reset: () => void;
}

const applyFilters = (
  products: Product[],
  search: string,
  filter: string
): Product[] => {
  let filtered = [...products];

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q)
    );
  }

  if (filter === "active") filtered = filtered.filter((p) => p.isActive);
  else if (filter === "inactive") filtered = filtered.filter((p) => !p.isActive);
  else if (filter === "subscription") filtered = filtered.filter((p) => p.requiresSubscription);

  return filtered;
};

const mapBackendProductToProduct = (p: any): Product => ({
  productId: String(p?.id ?? p?.Id ?? p?.productId ?? p?.ProductId ?? "").trim(),
  productName: String(p?.name ?? p?.Name ?? p?.productName ?? p?.ProductName ?? "").trim(),
  productCode: String(p?.code ?? p?.Code ?? p?.productCode ?? p?.ProductCode ?? "").trim(),
  description: String(p?.description ?? p?.Description ?? "").trim(),
  isActive:
    typeof p?.isActive === "boolean"
      ? p.isActive
      : typeof p?.IsActive === "boolean"
        ? p.IsActive
        : true,
  requiresSubscription:
    typeof p?.requiresSubscription === "boolean"
      ? p.requiresSubscription
      : typeof p?.RequiresSubscription === "boolean"
        ? p.RequiresSubscription
        : false,
  usageCount: Number.isFinite(Number(p?.usageCount ?? p?.UsageCount ?? 0))
    ? Number(p?.usageCount ?? p?.UsageCount ?? 0)
    : 0,
  lastUsed: p?.lastUsed ?? p?.LastUsed ?? undefined,
  activeSince: p?.activeSince ?? p?.ActiveSince ?? undefined,
  category: p?.category ?? p?.Category ?? undefined,
  version: p?.version ?? p?.Version ?? undefined,
  features: Array.isArray(p?.features)
    ? p.features
    : Array.isArray(p?.Features)
      ? p.Features
      : undefined,
});

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  searchQuery: "",
  filterOption: "all",
  isLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null,

  fetchProducts: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const auth = useAuthStore.getState().user;
      const authSchoolId = auth?.schoolId;
      const resolvedSchoolId = schoolId || authSchoolId;

      // If the logged-in user is a dev (role === 4), fetch master product list directly
      let payload: any;
      if (auth?.role === 4) {
        console.debug("fetchProducts: dev user detected, fetching master product list");
        const allRes = await api.get(`/Product/all`);
        payload = allRes?.data;
      } else {
        if (!resolvedSchoolId) {
          console.error("fetchProducts aborted: schoolId is missing", {
            schoolIdArg: schoolId,
            authSchoolId,
          });
          set({
            products: [],
            filteredProducts: [],
            error: "School context is missing. Please log in again.",
            isLoading: false,
          });
          return;
        }

        const endpoint = `/ProductMonitoring/school/${resolvedSchoolId}`;
        const res = await api.get<GetProductsResponse>(endpoint);
        console.debug("fetchProducts response", res?.data);

        payload = res?.data;
      }
      let rawProducts: any[] = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.products)
          ? payload.products
          : Array.isArray(payload)
            ? payload
            : [];

      // Fallback: if we fetched a school-specific list and it's empty, fetch master product list
      if ((auth?.role !== 4) && (!rawProducts || rawProducts.length === 0)) {
        try {
          const allRes = await api.get(`/Product/all`);
          const allPayload: any = allRes?.data;
          console.debug("fetchProducts fallback /Product/all response", allPayload);
          rawProducts = Array.isArray(allPayload?.data)
            ? allPayload.data
            : Array.isArray(allPayload?.products)
              ? allPayload.products
              : Array.isArray(allPayload)
                ? allPayload
                : [];
        } catch (fallbackErr) {
          console.warn("Fallback fetch /Product/all failed", fallbackErr);
        }
      }

      // Normalize incoming product shapes to frontend `Product` type
      const products: Product[] = (rawProducts || []).map((p: any) => ({
        productId: String(p?.id ?? p?.Id ?? p?.productId ?? p?.ProductId ?? "").trim(),
        productName: String(p?.name ?? p?.Name ?? p?.productName ?? p?.ProductName ?? p?.productName ?? "").trim(),
        productCode: String(p?.code ?? p?.Code ?? p?.productCode ?? p?.ProductCode ?? "").trim(),
        description: String(p?.description ?? p?.Description ?? "").trim(),
        isActive: typeof p?.isActive === "boolean" ? p.isActive : (typeof p?.IsActive === "boolean" ? p.IsActive : true),
        requiresSubscription: typeof p?.requiresSubscription === "boolean" ? p.requiresSubscription : (typeof p?.RequiresSubscription === "boolean" ? p.RequiresSubscription : false),
        usageCount: Number.isFinite(Number(p?.usageCount ?? p?.UsageCount ?? 0)) ? Number(p?.usageCount ?? p?.UsageCount ?? 0) : 0,
        lastUsed: p?.lastUsed ?? p?.LastUsed ?? undefined,
        activeSince: p?.activeSince ?? p?.ActiveSince ?? undefined,
        category: p?.category ?? p?.Category ?? undefined,
        version: p?.version ?? p?.Version ?? undefined,
        features: Array.isArray(p?.features) ? p.features : Array.isArray(p?.Features) ? p.Features : undefined,
      }));

      const { searchQuery, filterOption } = get();
      set({
        products,
        filteredProducts: applyFilters(products, searchQuery, filterOption),
        error: null,
        isLoading: false,
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const backendMessage =
        err?.response?.data?.message || err?.response?.data?.error;
      const fallbackMessage =
        !err?.response || err?.code === "ERR_NETWORK"
          ? "Network error while loading products"
          : "Failed to load products";

      console.error("fetchProducts error", {
        status,
        code: err?.code,
        message: err?.message,
        backendResponse: err?.response?.data,
      });

      set({
        error: backendMessage || fallbackMessage,
        isLoading: false,
      });
    }
  },

  setSearch: (query) => {
    const { products, filterOption } = get();
    set({
      searchQuery: query,
      filteredProducts: applyFilters(products, query, filterOption),
    });
  },

  setFilter: (filter) => {
    const { products, searchQuery } = get();
    set({
      filterOption: filter,
      filteredProducts: applyFilters(products, searchQuery, filter),
    });
  },

  selectProduct: (product) => set({ selectedProduct: product }),

  createProduct: async (data) => {
    set({ actionLoading: true, error: null });
    try {
      const payload = {
        Name: data.productName.trim(),
        Description: data.description.trim(),
        Code: data.productCode.trim(),
        RequiresSubscription: data.requiresSubscription,
        IsActive: true,
      };

      const res = await api.post("/Product/create", payload);
      const createdProduct = mapBackendProductToProduct(res.data?.data ?? res.data);
      const updated = [createdProduct, ...get().products];
      const { searchQuery, filterOption } = get();
      set({
        products: updated,
        filteredProducts: applyFilters(updated, searchQuery, filterOption),
        actionLoading: false,
        successMessage: "Product created successfully!",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create product",
        actionLoading: false,
      });
      throw err;
    }
  },

  toggleProductStatus: async (productId, currentStatus) => {
    set({ actionLoading: true, error: null });
    try {
      await api.put(`/ProductMonitoring/product/${productId}/status`, {
        isActive: !currentStatus,
      });
      const updated = get().products.map((p) =>
        p.productId === productId ? { ...p, isActive: !currentStatus } : p
      );
      const { searchQuery, filterOption, selectedProduct } = get();
      set({
        products: updated,
        filteredProducts: applyFilters(updated, searchQuery, filterOption),
        selectedProduct:
          selectedProduct?.productId === productId
            ? { ...selectedProduct, isActive: !currentStatus }
            : selectedProduct,
        actionLoading: false,
        successMessage: `Product ${!currentStatus ? "activated" : "deactivated"} successfully!`,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update product status",
        actionLoading: false,
      });
    }
  },

  launchProduct: async (productId) => {
    set({ actionLoading: true, error: null });
    try {
      await api.post(`/ProductMonitoring/product/${productId}/launch`, {});
      const updated = get().products.map((p) =>
        p.productId === productId
          ? { ...p, usageCount: (p.usageCount || 0) + 1, lastUsed: new Date().toISOString() }
          : p
      );
      const { searchQuery, filterOption } = get();
      set({
        products: updated,
        filteredProducts: applyFilters(updated, searchQuery, filterOption),
        actionLoading: false,
        successMessage: "Product launched successfully!",
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to launch product",
        actionLoading: false,
      });
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () =>
    set({
      products: [],
      filteredProducts: [],
      selectedProduct: null,
      searchQuery: "",
      filterOption: "all",
      error: null,
      successMessage: null,
    }),
}));
