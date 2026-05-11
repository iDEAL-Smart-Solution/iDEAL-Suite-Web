import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useSubscriptionStore } from "../../stores/useSubscriptionStore";

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    payments,
    paymentByReference,
    isLoading,
    isVerifyingReference,
    error,
    fetchPayments,
    fetchBillingSummary,
    fetchPaymentByReference,
    verifyPaymentWithPaystack,
    clearMessages,
  } = usePaymentStore();
  const { currentSubscription, fetchCurrentSubscription } = useSubscriptionStore();

  const schoolId = user?.schoolId;
  const searchParams = new URLSearchParams(location.search);
  const reference = useMemo(
    () => (searchParams.get("reference") || searchParams.get("trxref") || "").trim(),
    [location.search]
  );
  const status = searchParams.get("status") || "success";
  const action = searchParams.get("action") || undefined;
  const amount = searchParams.get("amount");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [verificationNote, setVerificationNote] = useState<string>("Verifying your payment with the backend...");
  const verificationStartedRef = useRef<string | null>(null);
  const redirectTimerRef = useRef<number | null>(null);

  const runPostPaymentRefresh = async () => {
    if (!schoolId) return;

    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchPayments(schoolId),
        fetchBillingSummary(schoolId),
        fetchCurrentSubscription(schoolId),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (schoolId) {
      void runPostPaymentRefresh();
    }
  }, [schoolId, fetchPayments, fetchBillingSummary, fetchCurrentSubscription]);

  useEffect(() => {
    let isMounted = true;

    const verifyOnce = async () => {
      if (!reference || verificationStartedRef.current === reference || !schoolId) return;

      verificationStartedRef.current = reference;
      setVerificationStatus("verifying");

      const localPayment = await fetchPaymentByReference(reference);
      if (!isMounted) return;

      if (localPayment?.status === "success") {
        setVerificationStatus("success");
        setVerificationNote("Payment verified successfully. Redirecting to payment history...");
        return;
      }

      const verificationResult = await verifyPaymentWithPaystack(reference, action);
      if (!isMounted) return;

      const backendConfirmed = Boolean(
        verificationResult?.localPaymentProcessed ||
        (verificationResult?.paystackResponseStatus && verificationResult?.transactionStatus?.toLowerCase() === "success")
      );

      if (backendConfirmed) {
        await fetchPayments(schoolId);
        await fetchBillingSummary(schoolId);
        await fetchCurrentSubscription(schoolId);

        const refreshedPayment = await fetchPaymentByReference(reference);
        if (!isMounted) return;

        if (refreshedPayment?.status === "success") {
          setVerificationStatus("success");
          setVerificationNote("Payment verified successfully. Redirecting to payment history...");
          return;
        }
      }

      setVerificationStatus("failed");
      setVerificationNote("Payment is still being confirmed. Please refresh payment history in a moment.");
    };

    void verifyOnce();

    return () => {
      isMounted = false;
    };
  }, [reference, schoolId, fetchPaymentByReference, verifyPaymentWithPaystack, fetchPayments, fetchBillingSummary, fetchCurrentSubscription]);

  useEffect(() => {
    if (verificationStatus !== "success") {
      return;
    }

    if (redirectTimerRef.current) {
      window.clearTimeout(redirectTimerRef.current);
    }

    redirectTimerRef.current = window.setTimeout(() => {
      navigate("/payments", { replace: true });
    }, 1400);

    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, [verificationStatus, navigate]);

  if (!schoolId) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Unable to confirm payment because your school context is missing. Please log in again.
        </div>
        <Link
          to="/payments"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-lg font-medium transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          Go to Payments
        </Link>
      </div>
    );
  }

  const latestPayment = (reference && paymentByReference?.reference === reference)
    ? paymentByReference
    : payments[0];
  const resolvedStatus = verificationStatus === "success"
    ? "success"
    : latestPayment?.status || status;
  const isFailed = String(resolvedStatus).toLowerCase() === "failed";
  const isVerifying = verificationStatus === "verifying" || (resolvedStatus === "pending" && verificationStatus !== "success");
  const titleText = verificationStatus === "success"
    ? "Payment successful"
    : isFailed
      ? "Payment failed"
      : "Payment verifying";
  const descriptionText = verificationStatus === "success"
    ? "Your payment has been verified by the backend. Redirecting to payment history..."
    : isFailed
      ? "Your payment did not complete successfully. You can refresh the status or review your payment history below."
      : verificationNote;

  return (
    <div className="space-y-8">
      <div className={`${isFailed ? "bg-red-500/10 border-red-500/30" : "bg-green-500/10 border-green-500/30"} border rounded-2xl p-6 sm:p-8`}>
        <div className="flex items-start gap-4">
          <div className={`${isFailed ? "bg-red-500/20" : "bg-green-500/20"} w-12 h-12 rounded-full flex items-center justify-center shrink-0`}>
            <CheckCircle2 className={`w-7 h-7 ${isFailed ? "text-red-400" : "text-green-400"}`} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {titleText}
            </h1>
            <p className="text-slate-300 max-w-2xl">
              {descriptionText}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-surface-800/70 border border-surface-700 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Status</p>
            <p className="text-white font-semibold capitalize">
              {isVerifying ? "Verifying" : resolvedStatus}
            </p>
          </div>
          <div className="bg-surface-800/70 border border-surface-700 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Reference</p>
            <p className="text-white font-mono text-sm break-all">{reference || "Pending webhook confirmation"}</p>
          </div>
          <div className="bg-surface-800/70 border border-surface-700 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Amount</p>
            <p className="text-white font-semibold">
              {amount
                ? `₦${Number(amount).toLocaleString()}`
                : latestPayment
                  ? `₦${latestPayment.amount.toLocaleString()}`
                  : "Not available"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            to="/payments"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-lg font-medium transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            View payment history
          </Link>
          <button
            type="button"
            onClick={async () => {
              clearMessages();
              await runPostPaymentRefresh();
              if (reference) {
                await fetchPaymentByReference(reference);
              }
            }}
            disabled={isRefreshing || isLoading || isVerifyingReference}
            className="inline-flex items-center gap-2 bg-surface-700 hover:bg-surface-600 text-slate-100 px-5 py-3 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${(isRefreshing || isLoading || isVerifyingReference) ? "animate-spin" : ""}`} />
            {isRefreshing || isLoading || isVerifyingReference ? "Verifying..." : "Refresh status"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Latest payment record</h2>
          {isLoading || isVerifyingReference ? (
            <p className="text-slate-400">Loading payment history...</p>
          ) : latestPayment ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Reference</span>
                <span className="text-white font-mono break-all text-right">{latestPayment.reference}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Amount</span>
                <span className="text-white">₦{latestPayment.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Status</span>
                <span className="text-green-400 capitalize">{latestPayment.status}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Method</span>
                <span className="text-white">{latestPayment.paymentMethod || "PayStack"}</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">No payment record is available yet. The webhook may still be processing.</p>
          )}
        </div>

        <div className="bg-surface-800 rounded-xl border border-surface-700 p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Current subscription</h2>
          {currentSubscription ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Plan</span>
                <span className="text-white">{currentSubscription.planType || "Local"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Slots</span>
                <span className="text-white">{currentSubscription.paidStudentSlots}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Status</span>
                <span className="text-white">{verificationStatus === "success" ? "Updated" : "Verifying"}</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Current subscription is loading or waiting for webhook confirmation.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
