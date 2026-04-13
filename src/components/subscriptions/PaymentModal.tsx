import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { CreditCard, Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import { usePaymentStore } from "../../stores/usePaymentStore";
import type { Subscription } from "../../types/subscription";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  schoolId: string;
  email: string;
}

const PLAN_PRICES: Record<string, number> = {
  Local: 50000,
  Remote: 100000,
};

const isTrustedPaymentUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      parsed.protocol === "https:" &&
      (host === "paystack.com" ||
        host.endsWith(".paystack.com") ||
        host === "checkout.paystack.com")
    );
  } catch {
    return false;
  }
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  subscription,
  schoolId,
  email,
}) => {
  const { isInitializing, error, initializePayment, clearMessages } =
    usePaymentStore();

  const [amount, setAmount] = useState<number>(
    subscription
      ? PLAN_PRICES[subscription.planType || "Local"] || 50000
      : 50000
  );
  const [paymentError, setPaymentError] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "redirect">("form");
  const redirectTimeoutRef = useRef<number | null>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
      isSubmittingRef.current = false;
    };
  }, []);

  const handlePay = async () => {
    if (isSubmittingRef.current || step !== "form") {
      return;
    }
    
    if (!subscription) {
      setPaymentError("No subscription found. Please create a subscription first.");
      return;
    }

    if (!schoolId?.trim()) {
      setPaymentError("School context is missing. Please log in again.");
      return;
    }

    if (!email?.trim()) {
      setPaymentError("A valid payment email is required.");
      return;
    }

    if (amount < 1000) {
      setPaymentError("Minimum amount is ₦1,000");
      return;
    }

    setPaymentError("");
    clearMessages();
    isSubmittingRef.current = true;
    setStep("processing");

    try {
      const authorizationUrl = await initializePayment({
        subscriptionId: subscription.id,
        schoolId,
        amount,
        email: email.trim(),
        callbackUrl: `${window.location.origin}/payments/success`,
      });

      if (!authorizationUrl) {
        setStep("form");
        setPaymentError("Unable to start payment. Please try again.");
        return;
      }

      if (!isTrustedPaymentUrl(authorizationUrl)) {
        setStep("form");
        setPaymentError("Received an invalid payment gateway URL. Please contact support.");
        return;
      }

      setStep("redirect");
      redirectTimeoutRef.current = window.setTimeout(() => {
        window.location.assign(authorizationUrl);
      }, 700);
    } catch {
      setStep("form");
      setPaymentError("Payment initialization failed. Please try again.");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleClose = () => {
    if (step === "processing") return; // Don't close while processing
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    setStep("form");
    setPaymentError("");
    clearMessages();
    onClose();
  };

  if (!isOpen) return null;

  const displayError = paymentError || error;
  const canPay = subscription && !isInitializing && step === "form" && amount >= 1000;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-surface-800 border border-surface-700 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-surface-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Make Payment</h2>
              <p className="text-xs text-slate-400">Secure payment via PayStack</p>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
            onClick={handleClose}
            disabled={step === "processing"}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6">
          {step === "redirect" && (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <ExternalLink className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Redirecting to Payment Gateway...</h3>
              <p className="text-sm text-slate-400">
                You will be redirected to PayStack to complete your payment securely.
              </p>
              <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full animate-pulse" />
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin mx-auto" />
              <h3 className="text-lg font-semibold text-white">Initializing Payment...</h3>
              <p className="text-sm text-slate-400">
                Please wait while we connect to the payment gateway.
              </p>
            </div>
          )}

          {step === "form" && (
            <div className="space-y-5">
              {displayError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {displayError}
                </div>
              )}

              {/* Subscription Summary */}
              {subscription && (
                <div className="bg-surface-700/50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-slate-300">Subscription Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Plan</span>
                    <span className="text-white font-medium">
                      {subscription.planType || "Local"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Student Slots</span>
                    <span className="text-white font-medium">
                      {subscription.paidStudentSlots}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Period</span>
                    <span className="text-white font-medium">
                      {new Date(subscription.startDate).toLocaleDateString()} –{" "}
                      {new Date(subscription.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div>
                <label
                  htmlFor="paymentAmount"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Amount (₦) *
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  min="1000"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className={cn(
                    "w-full h-12 px-4 rounded-lg bg-surface-800 border text-white text-lg font-semibold focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                    paymentError ? "border-red-500" : "border-surface-600"
                  )}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Minimum ₦1,000
                </p>
              </div>

              {/* Email display */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Payment Email
                </label>
                <div className="w-full h-10 px-3 rounded-lg bg-surface-700/50 border border-surface-600 text-slate-400 text-sm flex items-center">
                  {email}
                </div>
              </div>

              {/* Security notice */}
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
                <span>
                  Your payment is processed securely through PayStack. We do not store your card details.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "form" && (
          <div className="p-4 md:p-6 border-t border-surface-700">
            {!subscription && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                ⚠️ No subscription available. Please create a subscription before making payment.
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-surface-700 hover:bg-surface-600 text-slate-200 font-medium transition-colors duration-200"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                onClick={handlePay}
                disabled={!canPay}
                title={!subscription ? "No subscription available" : !canPay ? "Please fix errors above" : ""}
              >
                <CreditCard className="w-4 h-4" />
                Pay ₦{amount.toLocaleString()}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
