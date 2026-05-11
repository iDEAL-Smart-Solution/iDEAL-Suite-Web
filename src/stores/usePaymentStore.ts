import { create } from "zustand";
import api from "../services/api";
import { useAuthStore } from "./useAuthStore";
import type {
  BillingSummary,
  InitializePaymentRequest,
  PaystackVerificationResult,
  PaymentRecord,
  PaymentInitializationInfo,
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
let verifyPaystackRequestSeq = 0;

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
  schoolName: String(record?.schoolName ?? record?.school?.name ?? "").trim() || undefined,
  amount: Number.isFinite(Number(record?.amount ?? record?.intendedAmount ?? record?.IntendedAmount)) ? Number(record?.amount ?? record?.intendedAmount ?? record?.IntendedAmount) : 0,
  reference: String(record?.reference ?? record?.paymentReference ?? ""),
  productCode: String(record?.productCode ?? record?.ProductCode ?? record?.product?.code ?? "").trim() || undefined,
  productId: String(record?.productId ?? record?.ProductId ?? record?.product?.id ?? "").trim() || undefined,
  status: (record?.isProcessed ?? record?.IsProcessed) === true ? "success" : (record?.status ? normalizePaymentStatus(record?.status) : "pending"),
  paymentMethod: String(record?.paymentMethod ?? record?.method ?? "PayStack"),
  paidAt: record?.paidAt ?? record?.paymentDate,
  createdAt: String(record?.createdAt ?? record?.CreatedAt ?? record?.paidAt ?? new Date().toISOString()),
});

const summarizePayments = (payments: PaymentRecord[]): BillingSummary =>
  payments.reduce(
    (summary, payment) => ({
      totalPayments: summary.totalPayments + 1,
      successfulPayments:
        summary.successfulPayments + (payment.status === "success" ? 1 : 0),
      pendingPayments:
        summary.pendingPayments + (payment.status === "pending" ? 1 : 0),
      failedPayments: summary.failedPayments + (payment.status === "failed" ? 1 : 0),
      totalPaidAmount: summary.totalPaidAmount + (payment.status === "success" ? payment.amount : 0),
      totalPendingAmount: summary.totalPendingAmount + (payment.status === "pending" ? payment.amount : 0),
    }),
    { ...emptyBillingSummary }
  );

const normalizePaymentRecords = (payload: any): PaymentRecord[] =>
  extractPaymentRecords(payload).map((record, index) =>
    normalizePaymentRecord(record, index)
  );

const emptyBillingSummary: BillingSummary = {
  totalPayments: 0,
  successfulPayments: 0,
  pendingPayments: 0,
  failedPayments: 0,
  totalPaidAmount: 0,
  totalPendingAmount: 0,
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
      value?.totalPaidAmount ?? value?.totalPaid ?? value?.amountPaid ?? value?.TotalAmountPaid ?? 0
    ),
    totalPendingAmount: Number(
      value?.totalPendingAmount ?? value?.totalPending ?? value?.amountPending ?? value?.TotalAmountPending ?? 0
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
    // Could be a network failure or blocked by CORS (no Access-Control-Allow-Origin header).
    // Provide actionable guidance for developers and users.
    const msg =
      (err?.message && String(err.message)) ||
      "Network error. Please check your connection and try again.";
    if (String(msg).toLowerCase().includes("cors") || String(msg).toLowerCase().includes("network error")) {
      return (
        "Request blocked or network error. If you're developing locally, enable a dev proxy or ask the API team to add your origin to CORS (Access-Control-Allow-Origin). Otherwise check your network and retry."
      );
    }

    return "Network error. Please check your connection and try again.";
  }

  if (status === 500) {
    return (
      payloadMessage ||
      `${endpointLabel} is temporarily unavailable. Please try again in a moment.`
    );
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
  paymentInitInfo: PaymentInitializationInfo | null;
  isLoading: boolean;
  isInitializing: boolean;
  isVerifyingReference: boolean;
  isLoadingInitInfo: boolean;
  error: string | null;
  successMessage: string | null;
  lastInitializedReference: string | null;
  lastVerifiedReference: string | null;

  initializePayment: (data: InitializePaymentRequest) => Promise<string | null>;
  fetchPayments: (schoolId?: string) => Promise<void>;
  fetchReportingPayments: () => Promise<void>;
  fetchBillingSummary: (schoolId?: string) => Promise<void>;
  fetchPaymentByReference: (reference: string, action?: string) => Promise<PaymentRecord | null>;
  verifyPaymentWithPaystack: (reference: string, action?: string) => Promise<PaystackVerificationResult | null>;
  fetchPaymentInitializationInfo: (schoolId: string, productId: string, action?: string) => Promise<PaymentInitializationInfo | null>;
  clearMessages: () => void;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  billingSummary: emptyBillingSummary,
  paymentByReference: null,
  paymentInitInfo: null,
  isLoading: false,
  isInitializing: false,
  isVerifyingReference: false,
  isLoadingInitInfo: false,
  error: null,
  successMessage: null,
  lastInitializedReference: null,
  lastVerifiedReference: null,

  initializePayment: async (data) => {
    const payloadSchoolId = data?.schoolId?.trim();
    const payloadEmail = data?.email?.trim();
    const requestedAmount = Number(data?.intendedAmount ?? data?.amount ?? 0);

    if (!isValidSchoolId(payloadSchoolId)) {
      set({ error: "School context is missing. Please log in again." });
      return null;
    }

    if (!payloadEmail) {
      set({ error: "Payment email is required." });
      return null;
    }

    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      set({ error: "Payment amount must be greater than zero." });
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

  fetchReportingPayments: async () => {
    const requestId = ++paymentsRequestSeq;
    set({ isLoading: true, error: null });

    try {
      const endpoint = "/Payments/dev/all-schools/history";
      const res = await api.get(endpoint);

      if (requestId !== paymentsRequestSeq) {
        return;
      }

      if (res.status === 204 || !res.data) {
        set({ payments: [], billingSummary: emptyBillingSummary, isLoading: false, error: null });
        return;
      }

      const data = normalizePaymentRecords(res.data);
      set({
        payments: data,
        billingSummary: summarizePayments(data),
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      if (requestId !== paymentsRequestSeq) {
        return;
      }

      const message = resolveErrorMessage(err, "Failed to fetch payments report.", "Payments report");
      set({ payments: [], billingSummary: emptyBillingSummary, error: message, isLoading: false });
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

  fetchPaymentByReference: async (reference: string, action?: string) => {
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
      // The read-only payment-by-reference endpoint was removed; use the verify endpoint
      // and map the verification result into a PaymentRecord for UI consumption.
      const endpoint = `/Payments/reference/${encodeURIComponent(normalizedReference)}/verify` + (action ? `?action=${encodeURIComponent(action)}` : "");
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

      const verification = res.data?.data ?? res.data;

      const payment: PaymentRecord = {
        id: `payment-${normalizedReference}`,
        subscriptionId: "",
        schoolId: "",
        schoolName: undefined,
        productId: undefined,
        productCode: undefined,
        amount: Number.isFinite(Number((verification?.amountInKobo ?? 0) / 100)) ? Number((verification?.amountInKobo ?? 0) / 100) : 0,
        reference: String(verification?.reference ?? normalizedReference),
        status: (verification?.localPaymentProcessed ?? false) ? "success" : (String(verification?.transactionStatus ?? "").toLowerCase() === "success" ? "success" : "pending"),
        paymentMethod: "PayStack",
        paidAt: verification?.paidAt ?? undefined,
        createdAt: new Date().toISOString(),
      };

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

  verifyPaymentWithPaystack: async (reference: string, action?: string) => {
    const normalizedReference = reference?.trim();

    if (!normalizedReference) {
      set({ paymentByReference: null });
      return null;
    }

    const requestId = ++verifyPaystackRequestSeq;
    set({ isVerifyingReference: true, error: null });

    try {
      const endpoint = `/Payments/reference/${encodeURIComponent(normalizedReference)}/verify` + (action ? `?action=${encodeURIComponent(action)}` : "");
      const res = await api.get(endpoint);

      if (requestId !== verifyPaystackRequestSeq) {
        return null;
      }

      if (res.status === 204 || !res.data) {
        set({
          paymentByReference: null,
          isVerifyingReference: false,
        });
        return null;
      }

      const verification = res.data?.data ?? res.data;
      const result: PaystackVerificationResult = {
        reference: String(verification?.reference ?? normalizedReference),
        paystackResponseStatus: Boolean(verification?.paystackResponseStatus ?? verification?.PaystackResponseStatus ?? false),
        paystackMessage: String(verification?.paystackMessage ?? verification?.PaystackMessage ?? ""),
        transactionStatus: String(verification?.transactionStatus ?? verification?.TransactionStatus ?? "unknown"),
        amountInKobo: Number(verification?.amountInKobo ?? verification?.AmountInKobo ?? 0),
        paidAt: verification?.paidAt ?? verification?.PaidAt ?? undefined,
        localPaymentProcessed: Boolean(verification?.localPaymentProcessed ?? verification?.LocalPaymentProcessed ?? false),
      };

      set({
        isVerifyingReference: false,
        error: null,
      });
      return result;
    } catch (err: any) {
      if (requestId !== verifyPaystackRequestSeq) {
        return null;
      }

      const message = resolveErrorMessage(
        err,
        "Failed to verify payment with Paystack.",
        "Paystack verification"
      );

      set({ paymentByReference: null, error: message, isVerifyingReference: false });
      return null;
    }
  },

  fetchPaymentInitializationInfo: async (schoolId, productId, action) => {
    const normalizedSchoolId = schoolId?.trim();
    const normalizedProductId = productId?.trim();

    if (!normalizedSchoolId || !normalizedProductId) {
      set({ error: "School and product information is required." });
      return null;
    }

    set({ isLoadingInitInfo: true, error: null, paymentInitInfo: null });

    try {
      const res = await api.get("/SubscriptionPayment/initialize-info", {
        params: {
          schoolId: normalizedSchoolId,
          productId: normalizedProductId,
          action,
        },
      });

      if (res.status === 204 || !res.data) {
        set({
          paymentInitInfo: null,
          error: "No payment information available.",
          isLoadingInitInfo: false,
        });
        return null;
      }

      const data = res.data?.data ?? res.data;
      const normalizedInfo: PaymentInitializationInfo = {
        costPerStudent: Number(data?.costPerStudent ?? 0),
        activeStudentCount: Number(data?.activeStudentCount ?? 0),
        minimumPayableAmount: Number(data?.minimumPayableAmount ?? 0),
        isFirstTimeSubscription: Boolean(data?.isFirstTimeSubscription ?? false),
        isRenewalAllowed: Boolean(data?.isRenewalAllowed ?? true),
        productName: String(data?.productName ?? ""),
        productCode: String(data?.productCode ?? ""),
        schoolName: String(data?.schoolName ?? ""),
        currentPaidSlots: Number(data?.currentPaidSlots ?? 0),
        renewalMessage: data?.renewalMessage ? String(data.renewalMessage) : undefined,
        message: String(data?.message ?? ""),
      };

      set({
        paymentInitInfo: normalizedInfo,
        isLoadingInitInfo: false,
        error: null,
      });

      return normalizedInfo;
    } catch (err: any) {
      const message = resolveErrorMessage(
        err,
        "Failed to load payment information.",
        "Payment initialization"
      );
      set({
        paymentInitInfo: null,
        error: message,
        isLoadingInitInfo: false,
      });
      return null;
    }
  },

  clearMessages: () => set({ error: null, successMessage: null }),
  reset: () =>
    set({
      payments: [],
      billingSummary: emptyBillingSummary,
      paymentByReference: null,
      paymentInitInfo: null,
      isLoading: false,
      isInitializing: false,
      isVerifyingReference: false,
      isLoadingInitInfo: false,
      error: null,
      successMessage: null,
      lastInitializedReference: null,
      lastVerifiedReference: null,
    }),
}));
