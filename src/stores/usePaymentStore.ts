import { create } from "zustand";
import api from "../services/api";
import { useAuthStore } from "./useAuthStore";
import type {
  BillingSummary,
  InitializePaymentRequest,
  PaymentRecord,
} from "../types/subscription";

type StoreError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      title?: string;
    };
  };
  code?: string;
  message?: string;
};

let initializeRequestSeq = 0;
let paymentsRequestSeq = 0;
let billingRequestSeq = 0;
let referenceRequestSeq = 0;

const extractAuthorizationUrl = (payload: any): string | null => {
  const value = payload?.data ?? payload;

  if (!value) return null;
  if (typeof value === "string") return value;

  return (
    value.authorizationUrl ??
    value.authorization_url ??
    value.authUrl ??
    value.url ??
    null
  );
};

const extractPaymentRecords = (payload: any): PaymentRecord[] => {
  const value = payload?.data ?? payload;

  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.payments)) return value.payments;
  if (Array.isArray(value.items)) return value.items;
  if (Array.isArray(value.records)) return value.records;

  return [];
};

const normalizePaymentStatus = (
  status: unknown
): "pending" | "success" | "failed" => {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized === "success" || normalized === "successful") return "success";
  if (normalized === "failed" || normalized === "failure") return "failed";
  return "pending";
};

const normalizePaymentRecord = (record: any, index = 0): PaymentRecord => ({
  id: String(record?.id ?? record?.paymentId ?? `payment-${index}`),
  subscriptionId: String(record?.subscriptionId ?? ""),
  schoolId: String(record?.schoolId ?? ""),
  amount: Number.isFinite(Number(record?.amount)) ? Number(record?.amount) : 0,
  reference: String(record?.reference ?? record?.paymentReference ?? ""),
  status: normalizePaymentStatus(record?.status),
  paymentMethod: String(record?.paymentMethod ?? record?.method ?? "PayStack"),
  paidAt: record?.paidAt ?? record?.paymentDate,
  createdAt: String(record?.createdAt ?? record?.paidAt ?? new Date().toISOString()),
});

const normalizePaymentRecords = (payload: any): PaymentRecord[] =>
  extractPaymentRecords(payload).map((record, index) =>
    normalizePaymentRecord(record, index)
  );

const extractSinglePaymentRecord = (payload: any): PaymentRecord | null => {
  const value = payload?.data ?? payload;
  if (!value) return null;

  if (Array.isArray(value)) {
    return value.length > 0 ? normalizePaymentRecord(value[0], 0) : null;
  }

  if (value.payment && typeof value.payment === "object") {
    return normalizePaymentRecord(value.payment, 0);
  }

  if (typeof value === "object") {
    return normalizePaymentRecord(value, 0);
  }

  return null;
};

const emptyBillingSummary: BillingSummary = {
  totalPayments: 0,
  successfulPayments: 0,
  pendingPayments: 0,
  failedPayments: 0,
  totalPaidAmount: 0,
};

const normalizeBillingSummary = (payload: any): BillingSummary => {
  const value = payload?.data ?? payload ?? {};

  return {
    totalPayments: Number(
      value?.totalPayments ?? value?.paymentsCount ?? value?.totalCount ?? 0
    ),
    successfulPayments: Number(
      value?.successfulPayments ?? value?.successCount ?? value?.successfulCount ?? 0
    ),
    pendingPayments: Number(
      value?.pendingPayments ?? value?.pendingCount ?? 0
    ),
    failedPayments: Number(value?.failedPayments ?? value?.failedCount ?? 0),
    totalPaidAmount: Number(
      value?.totalPaidAmount ?? value?.totalPaid ?? value?.amountPaid ?? 0
    ),
  };
};

const resolveErrorMessage = (
  err: StoreError,
  fallbackMessage: string,
  endpointLabel: string
): string => {
  const status = err?.response?.status;
  const payloadMessage =
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    err?.response?.data?.title;

  if (status === 408 || err?.code === "ECONNABORTED") {
    return `${endpointLabel} timed out. Please try again.`;
  }

  if (!err?.response || err?.code === "ERR_NETWORK") {
    return "Network error. Please check your connection and try again.";
  }

  if (status === 500) {
    return payloadMessage || `${endpointLabel} failed due to a server error.`;
  }

  if (status === 404) {
    return `${endpointLabel} endpoint is unavailable. Please contact support.`;
  }

  if (status === 400 || status === 422) {
    return payloadMessage || `${endpointLabel} request is invalid.`;
  }

  return payloadMessage || err?.message || fallbackMessage;
};

const isValidSchoolId = (schoolId?: string): schoolId is string =>
  typeof schoolId === "string" && schoolId.trim().length > 0;

interface PaymentState {
  payments: PaymentRecord[];
  billingSummary: BillingSummary;
  paymentByReference: PaymentRecord | null;
  isLoading: boolean;
  isInitializing: boolean;
  isVerifyingReference: boolean;
  error: string | null;
  successMessage: string | null;
  lastInitializedReference: string | null;
  lastVerifiedReference: string | null;

  initializePayment: (data: InitializePaymentRequest) => Promise<string | null>;
  fetchPayments: (schoolId?: string) => Promise<void>;
  fetchBillingSummary: (schoolId?: string) => Promise<void>;
  fetchPaymentByReference: (reference: string) => Promise<PaymentRecord | null>;
  clearMessages: () => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  billingSummary: emptyBillingSummary,
  paymentByReference: null,
  isLoading: false,
  isInitializing: false,
  isVerifyingReference: false,
  error: null,
  successMessage: null,
  lastInitializedReference: null,
  lastVerifiedReference: null,

  initializePayment: async (data) => {
    const payloadSchoolId = data?.schoolId?.trim();
    const payloadEmail = data?.email?.trim();

    if (!isValidSchoolId(payloadSchoolId)) {
      set({ error: "School context is missing. Please log in again." });
      return null;
    }

    if (!payloadEmail) {
      set({ error: "Payment email is required." });
      return null;
    }

    if (!Number.isFinite(data?.amount) || data.amount < 1000) {
      set({ error: "Payment amount must be at least N1,000." });
      return null;
    }

    if (get().isInitializing) {
      return null;
    }

    const requestId = ++initializeRequestSeq;
    set({ isInitializing: true, error: null, successMessage: null });

    try {
      const res = await api.post("/SubscriptionPayment/initialize", data);

      if (requestId !== initializeRequestSeq) {
        return null;
      }

      if (res.status === 204 || !res.data) {
        set({
          isInitializing: false,
          error: "Payment service returned no content. Please try again.",
        });
        return null;
      }

      const authUrl = extractAuthorizationUrl(res.data);
      const responseData = res.data?.data ?? res.data;
      const reference = String(responseData?.reference ?? "").trim() || null;

      if (!authUrl) {
        set({
          isInitializing: false,
          error: "No payment URL received from server. Please try again.",
        });
        return null;
      }

      set({
        isInitializing: false,
        lastInitializedReference: reference,
        successMessage: res.data?.message || "Payment initialized successfully.",
      });

      return authUrl;
    } catch (err: any) {
      const message = resolveErrorMessage(
        err,
        "Failed to initialize payment.",
        "Payment initialization"
      );

      if (requestId === initializeRequestSeq) {
        set({ error: message, isInitializing: false });
      }

      return null;
    }
  },

  fetchPayments: async (schoolId) => {
    const resolvedSchoolId = (schoolId || useAuthStore.getState().user?.schoolId)?.trim();

    if (!isValidSchoolId(resolvedSchoolId)) {
      set({
        payments: [],
        error: "School context is missing. Please log in again.",
        isLoading: false,
      });
      return;
    }

    const requestId = ++paymentsRequestSeq;
    set({ isLoading: true, error: null });
    try {
      const endpoint = `/Payments/school/${resolvedSchoolId}/history`;
      const res = await api.get(endpoint);

      if (requestId !== paymentsRequestSeq) {
        return;
      }

      if (res.status === 204 || !res.data) {
        set({ payments: [], isLoading: false });
        return;
      }

      const data = normalizePaymentRecords(res.data);
      set({ payments: data, isLoading: false, error: null });
    } catch (err: any) {
      if (requestId !== paymentsRequestSeq) {
        return;
      }

      const message = resolveErrorMessage(
        err,
        "Failed to fetch payments.",
        "Payment history"
      );
      set({ payments: [], error: message, isLoading: false });
    }
  },

  fetchBillingSummary: async (schoolId) => {
    const resolvedSchoolId = (schoolId || useAuthStore.getState().user?.schoolId)?.trim();

    if (!isValidSchoolId(resolvedSchoolId)) {
      set({
        billingSummary: emptyBillingSummary,
        error: "School context is missing. Please log in again.",
      });
      return;
    }

    const requestId = ++billingRequestSeq;
    try {
      const endpoint = `/Payments/school/${resolvedSchoolId}/billing-summary`;
      const res = await api.get(endpoint);

      if (requestId !== billingRequestSeq) {
        return;
      }

      if (res.status === 204 || !res.data) {
        set({ billingSummary: emptyBillingSummary });
        return;
      }

      set({ billingSummary: normalizeBillingSummary(res.data), error: null });
    } catch (err: any) {
      if (requestId !== billingRequestSeq) {
        return;
      }

      const message = resolveErrorMessage(
        err,
        "Failed to fetch billing summary.",
        "Billing summary"
      );

      set({ billingSummary: emptyBillingSummary, error: message });
    }
  },

  fetchPaymentByReference: async (reference) => {
    const normalizedReference = reference?.trim();

    if (!normalizedReference) {
      set({ paymentByReference: null });
      return null;
    }

    if (get().isVerifyingReference && get().lastVerifiedReference === normalizedReference) {
      return get().paymentByReference;
    }

    const requestId = ++referenceRequestSeq;
    set({ isVerifyingReference: true, error: null });

    try {
      const endpoint = `/Payments/reference/${encodeURIComponent(normalizedReference)}`;
      const res = await api.get(endpoint);

      if (requestId !== referenceRequestSeq) {
        return null;
      }

      if (res.status === 204 || !res.data) {
        set({
          paymentByReference: null,
          lastVerifiedReference: normalizedReference,
          isVerifyingReference: false,
        });
        return null;
      }

      const payment = extractSinglePaymentRecord(res.data);
      set({
        paymentByReference: payment,
        lastVerifiedReference: normalizedReference,
        isVerifyingReference: false,
        error: null,
      });
      return payment;
    } catch (err: any) {
      if (requestId !== referenceRequestSeq) {
        return null;
      }

      const message = resolveErrorMessage(
        err,
        "Failed to fetch payment by reference.",
        "Payment verification"
      );

      set({ paymentByReference: null, error: message, isVerifyingReference: false });
      return null;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () =>
    set({
      payments: [],
      billingSummary: emptyBillingSummary,
      paymentByReference: null,
      isLoading: false,
      isInitializing: false,
      isVerifyingReference: false,
      error: null,
      successMessage: null,
      lastInitializedReference: null,
      lastVerifiedReference: null,
    }),
}));
