import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useProductStore } from "../../stores/useProductStore";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import BrandLoader from "../../components/ui/BrandLoader";

const PaymentInitialization = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { products, isLoading: isLoadingProducts, fetchProducts } = useProductStore();
  const {
    paymentInitInfo,
    isLoadingInitInfo,
    isInitializing,
    error,
    fetchPaymentInitializationInfo,
    initializePayment,
    clearMessages,
  } = usePaymentStore();

  const [slotCount, setSlotCount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [paystackFee, setPaystackFee] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(searchParams.get("productId") || "");
  const actionParam = searchParams.get("action") || undefined;

  const schoolId = user?.schoolId;
  const selectedProduct = useMemo(
    () => products.find((product) => product.productId === selectedProductId) || null,
    [products, selectedProductId]
  );
  const activeProducts = useMemo(() => products.filter((product) => product.isActive), [products]);

  useEffect(() => {
    if (schoolId) {
      fetchProducts(schoolId);
    }
  }, [schoolId, fetchProducts]);

  useEffect(() => {
    const queryProductId = searchParams.get("productId") || "";
    if (queryProductId && queryProductId !== selectedProductId) {
      setSelectedProductId(queryProductId);
    }
  }, [searchParams, selectedProductId]);

  useEffect(() => {
    setSlotCount("");
    setAmountError("");
    setPaystackFee(0);
    setFinalAmount(0);
  }, [selectedProductId]);

  useEffect(() => {
    if (!selectedProductId && activeProducts.length === 1) {
      setSelectedProductId(activeProducts[0].productId);
    }
  }, [activeProducts, selectedProductId]);

  useEffect(() => {
    if (schoolId && selectedProductId) {
      fetchPaymentInitializationInfo(schoolId, selectedProductId, actionParam);
    }
  }, [selectedProductId, schoolId, fetchPaymentInitializationInfo, actionParam]);

  // Calculate Paystack fees (1.5% + ₦100)
  const calculatePaystackFee = (amount: number) => {
    const fee = Math.round(amount * 0.015) + 100;
    return fee;
  };

  useEffect(() => {
    const slotValue = Number(slotCount) || 0;
    const minimumSlots = paymentInitInfo
      ? actionParam === "renew"
        ? Math.max(paymentInitInfo.activeStudentCount, paymentInitInfo.currentPaidSlots)
        : paymentInitInfo.isFirstTimeSubscription
          ? 20
          : paymentInitInfo.activeStudentCount
      : 0;
    const amount = slotValue * (paymentInitInfo?.costPerStudent || 0);

    if (amount > 0) {
      if (paymentInitInfo && slotValue > 0) {
        if (actionParam === "renew" && !paymentInitInfo.isRenewalAllowed) {
          setAmountError(paymentInitInfo.renewalMessage || "Renewal is not available yet.");
        } else if (slotValue < minimumSlots) {
          setAmountError(
            actionParam === "renew"
              ? `Minimum slot count for renewal is ${minimumSlots}.`
              : paymentInitInfo.isFirstTimeSubscription
                ? `For first-time payment, school must purchase minimum 20 student slots. You requested ${slotValue} students. Please increase to at least 20 students.`
                : `Minimum slot count is ${minimumSlots} for your current active students.`
          );
        } else {
          setAmountError("");
        }
      } else {
        setAmountError("");
      }

      const fee = calculatePaystackFee(amount);
      setPaystackFee(fee);
      setFinalAmount(amount + fee);
    } else {
      setPaystackFee(0);
      setFinalAmount(0);
      if (slotCount) {
        setAmountError("Please enter a valid number of slots");
      }
    }
  }, [slotCount, paymentInitInfo, actionParam]);

  const handleInitializePayment = async () => {
    if (!user?.schoolId || !paymentInitInfo || !selectedProductId) {
      clearMessages();
      setAmountError("Please select a product before making payment.");
      return;
    }

    const slotValue = Number(slotCount);
    const minimumSlots = actionParam === "renew"
      ? Math.max(paymentInitInfo.activeStudentCount, paymentInitInfo.currentPaidSlots)
      : paymentInitInfo.isFirstTimeSubscription
        ? 20
        : paymentInitInfo.activeStudentCount;

    if (!slotCount || slotValue <= 0) {
      setAmountError("Please enter a valid number of slots");
      return;
    }

    if (actionParam === "renew" && !paymentInitInfo.isRenewalAllowed) {
      setAmountError(paymentInitInfo.renewalMessage || "Renewal is not available yet.");
      return;
    }

    if (slotValue < minimumSlots) {
      setAmountError(
        actionParam === "renew"
          ? `Minimum slot count for renewal is ${minimumSlots}.`
          : paymentInitInfo.isFirstTimeSubscription
            ? `For first-time payment, school must purchase minimum 20 student slots. You requested ${slotValue} students. Please increase to at least 20 students.`
            : `You must select at least ${minimumSlots} slot(s) for the current active students.`
      );
      return;
    }

    if (!agreedToTerms) {
      setAmountError("Please agree to the terms and conditions");
      return;
    }

    if (amountError) {
      return;
    }

    try {
      const authUrl = await initializePayment({
        subscriptionId: "", // Will be created by backend
        schoolId: user.schoolId,
        productId: selectedProductId,
        amount: slotValue * paymentInitInfo.costPerStudent,
        intendedAmount: slotValue * paymentInitInfo.costPerStudent,
        email: user.email || "",
        action: actionParam,
      });

      if (authUrl) {
        // Redirect to Paystack payment portal
        window.location.href = authUrl;
      }
    } catch (err) {
      console.error("Payment initialization failed:", err);
    }
  };

  if (isLoadingInitInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <BrandLoader size="lg" />
        <p className="text-slate-400">
          {selectedProductId ? "Loading payment information..." : "Loading available products..."}
        </p>
      </div>
    );
  }

  if (!selectedProductId) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>

        <PageHeader title="Initialize Payment" subtitle="Choose the product you want to pay for" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="School & Admin" className="space-y-3">
            <div className="space-y-3 border-t border-surface-700 pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">School ID</span>
                <span className="text-white text-right font-medium">{schoolId || "N/A"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Admin</span>
                <span className="text-white text-right font-medium">{user?.fullName || "School Admin"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Email</span>
                <span className="text-white text-right font-medium">{user?.email || "N/A"}</span>
              </div>
            </div>
          </Card>

          <Card title="Select Product" className="space-y-4 lg:col-span-2">
            {isLoadingProducts ? (
              <div className="py-8 text-center text-slate-400">Loading products...</div>
            ) : activeProducts.length === 0 ? (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                No active products are available for payment at the moment.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full rounded-lg border border-surface-600 bg-surface-800 px-4 py-3 text-white focus:border-brand-400 focus:outline-none"
                  >
                    <option value="">Select a product</option>
                    {activeProducts.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.productName} ({product.productCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-surface-700 bg-surface-900/50 p-4 text-sm text-slate-300 gap-4">
                  <span>{selectedProduct ? `${selectedProduct.productName} selected` : "Choose a product to continue"}</span>
                  <Button
                    onClick={() => selectedProductId && fetchPaymentInitializationInfo(schoolId || "", selectedProductId, actionParam)}
                    disabled={!selectedProductId}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  if (!paymentInitInfo) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-3 text-red-400" size={40} />
          <p className="text-red-400 font-medium">
            {error || "Unable to load payment information. Please try again."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-800 transition-colors text-slate-300 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <PageHeader
        title="Initialize Payment"
        subtitle="Review payment details and proceed to checkout"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* School & Product Info Card */}
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Payment Details</h2>

            <div className="space-y-4 border-t border-surface-700 pt-4">
              <div className="flex justify-between items-start">
                <span className="text-slate-400">School Name</span>
                <span className="text-white font-medium">{paymentInitInfo.schoolName}</span>
              </div>

              <div className="flex justify-between items-start border-t border-surface-700 pt-4">
                <span className="text-slate-400">Product</span>
                <div className="text-right">
                  <p className="text-white font-medium">{paymentInitInfo.productName}</p>
                  <p className="text-xs text-slate-500">{paymentInitInfo.productCode}</p>
                </div>
              </div>

              <div className="flex justify-between items-start border-t border-surface-700 pt-4">
                <span className="text-slate-400">Pricing</span>
                <span className="text-white font-medium">
                  ₦{paymentInitInfo.costPerStudent.toLocaleString()} per student
                </span>
              </div>

              <div className="flex justify-between items-start border-t border-surface-700 pt-4">
                <span className="text-slate-400">
                  {paymentInitInfo.isFirstTimeSubscription
                    ? "Registered Students"
                    : "Active Students"}
                </span>
                <span className="text-white font-medium">
                  {paymentInitInfo.activeStudentCount} students
                </span>
              </div>

              {!paymentInitInfo.isFirstTimeSubscription && (
                <div className="flex justify-between items-start border-t border-surface-700 pt-4">
                  <span className="text-slate-400">Minimum Payment Required</span>
                  <span className="text-brand-400 font-semibold">
                    ₦{paymentInitInfo.minimumPayableAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {paymentInitInfo.currentPaidSlots > 0 && (
                <div className="flex justify-between items-start border-t border-surface-700 pt-4 text-yellow-600">
                  <span className="text-yellow-600/80">Current Paid Slots</span>
                  <span className="font-medium">{paymentInitInfo.currentPaidSlots} slots</span>
                </div>
              )}
            </div>

            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
              <p className="text-blue-400 text-sm">{paymentInitInfo.message}</p>
            </div>
          </Card>

          {/* Payment Amount Card */}
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Payment Amount</h2>

            <div className="space-y-4 border-t border-surface-700 pt-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Slots * {paymentInitInfo.isFirstTimeSubscription && <span className="text-yellow-400 text-xs">(Minimum: 20)</span>}
                </label>
                <input
                  type="number"
                  min={paymentInitInfo.isFirstTimeSubscription ? 20 : paymentInitInfo.activeStudentCount}
                  step={1}
                  value={slotCount}
                  onChange={(e) => setSlotCount(e.target.value)}
                  placeholder={
                    paymentInitInfo.isFirstTimeSubscription
                      ? "Enter number of slots (minimum 20)"
                      : `Minimum slots: ${paymentInitInfo.activeStudentCount}`
                  }
                  className="w-full px-4 py-3 bg-surface-800 border border-surface-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {paymentInitInfo.isFirstTimeSubscription
                    ? "First-time subscribers must purchase at least 20 slots. The amount will be calculated automatically."
                    : `You cannot select fewer than ${paymentInitInfo.activeStudentCount} slot(s). The amount will be calculated automatically.`}
                </p>
                {amountError && (
                  <p className="text-red-400 text-sm mt-2">{amountError}</p>
                )}
              </div>

              {finalAmount > 0 && (
                <div className="bg-surface-900/50 border border-surface-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Slots x Cost per Slot</span>
                    <span className="text-white font-medium">
                      {`${Number(slotCount).toLocaleString()} x ₦${paymentInitInfo.costPerStudent.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-surface-700 pt-3">
                    <span className="text-slate-400">Paystack Fee (1.5% + ₦100)</span>
                    <span className="text-white font-medium">₦{paystackFee.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-surface-700 pt-3">
                    <span className="text-slate-300 font-semibold">Total to Pay</span>
                    <span className="text-brand-400 font-bold text-lg">
                      ₦{finalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-surface-600 bg-surface-800 accent-brand-500 mt-0.5 cursor-pointer"
              />
              <span className="text-slate-300 text-sm">
                I understand that:
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                  <li>
                    {paymentInitInfo.isFirstTimeSubscription
                      ? `I am starting a new subscription. I have ${paymentInitInfo.activeStudentCount} registered student(s) and must purchase a minimum of 20 student slots`
                      : "The payment amount cannot be less than the minimum required for my current active students"}
                  </li>
                  <li>Paystack fees will be added to my payment amount</li>
                  <li>The payment will be processed securely through Paystack</li>
                </ul>
              </span>
            </label>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 space-y-4">
            <h3 className="font-semibold text-white">Payment Summary</h3>

            <div className="space-y-3 border-t border-surface-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Slots</span>
                <span className="text-white font-medium">
                  {slotCount ? Number(slotCount).toLocaleString() : "-"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Fees</span>
                <span className="text-white font-medium">
                  {finalAmount > 0 ? `₦${paystackFee.toLocaleString()}` : "-"}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-surface-700 pt-3">
                <span className="text-slate-300 text-sm font-semibold">Total</span>
                <span className="text-brand-400 font-bold text-lg">
                  {finalAmount > 0 ? `₦${finalAmount.toLocaleString()}` : "-"}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleInitializePayment}
              disabled={
                  !slotCount || Number(slotCount) <= 0 ||
                !agreedToTerms ||
                Boolean(amountError) ||
                (actionParam === "renew" && !paymentInitInfo.isRenewalAllowed) ||
                isInitializing
              }
              className="w-full mt-6"
            >
              {isInitializing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-300 border-t-transparent animate-spin" />
                  Processing...
                </div>
              ) : (
                "Proceed to Payment"
              )}
            </Button>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 text-xs">
                  {actionParam === "renew"
                    ? paymentInitInfo.isRenewalAllowed
                      ? "Renewal is open now. The minimum shown above will be enforced before checkout."
                      : paymentInitInfo.renewalMessage || "Renewal is not available yet."
                    : paymentInitInfo.isFirstTimeSubscription
                      ? "First-time subscription: You must purchase at least 20 student slots. You will be redirected to Paystack to complete your payment."
                      : "Renewal: You must pay at least the minimum shown above before Paystack opens."}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {actionParam === "renew" && !paymentInitInfo.isRenewalAllowed && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
          <p className="font-medium">Renewal is not open yet</p>
          <p className="text-sm mt-1">{paymentInitInfo.renewalMessage || "Renewal is not available yet."}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium mb-1">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={clearMessages}
            className="text-red-400 hover:text-red-300 font-medium text-sm"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentInitialization;
