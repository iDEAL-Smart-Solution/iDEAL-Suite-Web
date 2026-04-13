export const SubscriptionStatus = {
  Active: 1,
  Pending: 2,
  Deactivated: 3,
} as const;

export type SubscriptionStatusType = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const PaymentMethod = {
  Card: "Card",
  BankTransfer: "Bank Transfer",
  PayStack: "PayStack",
  Cash: "Cash",
} as const;

export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PlanType = {
  Local: "Local",
  Remote: "Remote",
} as const;

export type PlanTypeValue = (typeof PlanType)[keyof typeof PlanType];

export type Subscription = {
  id: string;
  schoolId: string;
  paidStudentSlots: number;
  startDate: string;
  expiryDate: string;
  paymentMethod: PaymentMethodType;
  status: SubscriptionStatusType;
  planType?: PlanTypeValue;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSubscriptionRequest = {
  schoolId: string;
  paidStudentSlots: number;
  startDate: string;
  expiryDate: string;
  paymentMethod: PaymentMethodType;
  status: SubscriptionStatusType;
};

export type SubscriptionResponse = {
  subscription: Subscription;
  message?: string;
};

export type SubscriptionHistoryResponse = {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
};

/* ── Payment types ─────────────────────────────── */

export type InitializePaymentRequest = {
  subscriptionId: string;
  schoolId: string;
  amount: number;
  email: string;
  callbackUrl?: string;
};

export type InitializePaymentResponse = {
  success: boolean;
  message: string;
  data: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
};

export type PaymentRecord = {
  id: string;
  subscriptionId: string;
  schoolId: string;
  amount: number;
  reference: string;
  status: "pending" | "success" | "failed";
  paymentMethod: string;
  paidAt?: string;
  createdAt: string;
};

export type BillingSummary = {
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalPaidAmount: number;
};

export type PaymentReferenceResponse = {
  payment: PaymentRecord | null;
  message?: string;
};
