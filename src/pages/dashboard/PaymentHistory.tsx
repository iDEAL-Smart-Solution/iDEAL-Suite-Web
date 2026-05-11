import React, { useEffect, useRef, useState } from "react";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useSubscriptionStore } from "../../stores/useSubscriptionStore";
import PageHeader from "../../components/layout/PageHeader";
import BrandLoader from "../../components/ui/BrandLoader";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-500/20 text-green-400";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400";
    case "failed":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-slate-500/20 text-slate-400";
  }
};

const PaymentHistory: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isDevDashboard = user?.role === 4;
  const {
    payments,
    billingSummary,
    isLoading,
    isInitializing,
    error,
    fetchPayments,
    fetchReportingPayments,
    fetchBillingSummary,
    clearMessages,
  } =
    usePaymentStore();
  const { currentSubscription, fetchCurrentSubscription } =
    useSubscriptionStore();

  const initialLoadKeyRef = useRef<string | null>(null);

  const schoolId = user?.schoolId;
  const initialLoadKey = isDevDashboard ? "dev-payments" : schoolId ?? null;

  useEffect(() => {
    if (!initialLoadKey) return;

    // Prevent duplicate development requests from React StrictMode.
    if (initialLoadKeyRef.current === initialLoadKey) {
      return;
    }

    initialLoadKeyRef.current = initialLoadKey;
    if (isDevDashboard) {
      fetchReportingPayments();
      return;
    }

    if (schoolId) {
      fetchPayments(schoolId);
      fetchBillingSummary(schoolId);
      fetchCurrentSubscription(schoolId);
    }
  }, [
    isDevDashboard,
    initialLoadKey,
    schoolId,
    fetchPayments,
    fetchReportingPayments,
    fetchBillingSummary,
    fetchCurrentSubscription,
  ]);

  if (!schoolId) {
    if (!isDevDashboard) {
      return (
        <div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
            Unable to load payment data. Please login again.
          </div>
        </div>
      );
    }
  }

  const handleRefresh = () => {
    if (isDevDashboard) {
      fetchReportingPayments();
      return;
    }

    if (!schoolId) return;
    fetchPayments(schoolId);
    fetchBillingSummary(schoolId);
    fetchCurrentSubscription(schoolId);
  };

  const handleRowClick = (payment: typeof payments[number]) => {
    if (payment.status === "pending") {
      navigate(`/payments/success?reference=${encodeURIComponent(payment.reference)}`);
    }
  };

  // Filters for dev dashboard
  const [filterSchool, setFilterSchool] = useState<string>("");
  const [filterProduct, setFilterProduct] = useState<string>("");

  const schoolOptions = Array.from(
    payments.reduce((m, p) => m.set(p.schoolId, p.schoolName ?? p.schoolId), new Map<string, string>()),
    ([id, name]) => ({ id, name })
  );

  const productOptions = Array.from(new Set(payments.map((p) => p.productCode).filter(Boolean))).map((c) => ({ code: String(c) }));

  const filteredPayments = payments.filter((p) => {
    if (filterSchool && p.schoolId !== filterSchool) return false;
    if (filterProduct && String(p.productCode) !== filterProduct) return false;
    return true;
  });

  const computeSummary = (list: typeof payments) =>
    list.reduce(
      (s, payment) => ({
        totalPayments: s.totalPayments + 1,
        successfulPayments: s.successfulPayments + (payment.status === "success" ? 1 : 0),
        pendingPayments: s.pendingPayments + (payment.status === "pending" ? 1 : 0),
        failedPayments: s.failedPayments + (payment.status === "failed" ? 1 : 0),
        totalPaidAmount: s.totalPaidAmount + (payment.status === "success" ? payment.amount : 0),
        totalPendingAmount: s.totalPendingAmount + (payment.status === "pending" ? payment.amount : 0),
      }),
      { totalPayments: 0, successfulPayments: 0, pendingPayments: 0, failedPayments: 0, totalPaidAmount: 0, totalPendingAmount: 0 }
    );

  // Compute summary from the displayed payments so the summary cards always
  // reflect the table rows (including filters). Fall back to billingSummary
  // only when there are no payments to show.
  const displaySummary =
    filteredPayments.length > 0 ? computeSummary(filteredPayments) : billingSummary;

  const pageTitle = isDevDashboard ? "Payments Report" : "Payments";
  const pageSubtitle = isDevDashboard
    ? "View payments made by other schools across the platform."
    : "View payment history and make new payments";

  const visibleColumns = isDevDashboard ? 7 : 6;

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 md:p-5 text-amber-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-amber-50">Payments service unavailable</p>
              <p className="text-sm text-amber-100/90">{error}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300"
              >
                Retry
              </button>
              <button
                onClick={clearMessages}
                className="rounded-lg border border-amber-400/30 px-3 py-2 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-500/10"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        action={
          !isDevDashboard ? (
            <button
              className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                const productId = currentSubscription?.productId;
                navigate(
                  productId
                    ? `/payments/initialize?productId=${encodeURIComponent(productId)}`
                    : "/payments/initialize"
                );
              }}
              disabled={isInitializing}
            >
              <CreditCard className="w-4 h-4" />
              {isInitializing ? "Preparing payment..." : "Make Payment"}
            </button>
          ) : undefined
        }
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh data"}
        </button>
      </div>

      {isDevDashboard && (
        <div className="flex flex-wrap gap-3 justify-end items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">School</label>
            <select
              className="bg-surface-800 border border-surface-700 text-sm text-white rounded-lg px-3 py-1"
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
            >
              <option value="">All schools</option>
              {schoolOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Product</label>
            <select
              className="bg-surface-800 border border-surface-700 text-sm text-white rounded-lg px-3 py-1"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
            >
              <option value="">All products</option>
              {productOptions.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Total Payments</p>
          <p className="text-2xl font-bold text-white">{displaySummary.totalPayments}</p>
        </div>
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Successful</p>
          <p className="text-2xl font-bold text-green-400">
            {displaySummary.successfulPayments}
          </p>
        </div>
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-brand-400">
            ₦{displaySummary.totalPaidAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Pending Amount</p>
          <p className="text-2xl font-bold text-yellow-400">
            ₦{displaySummary.totalPendingAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-surface-800 rounded-xl border border-surface-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="bg-surface-900 border-b border-surface-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Reference
                </th>
                {isDevDashboard && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    School
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={visibleColumns}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <BrandLoader size="sm" />
                      Loading payments...
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    {error ? (
                      <div className="space-y-2">
                        <CreditCard className="w-10 h-10 mx-auto text-amber-400/70" />
                        <p className="font-medium text-amber-100">Unable to load payment history</p>
                        <p className="text-sm text-slate-500">
                          The service returned an error. Try again in a moment or contact support if it persists.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <CreditCard className="w-10 h-10 mx-auto text-slate-600" />
                        <p className="font-medium">
                          {isDevDashboard ? "No payments reported yet" : "No payments yet"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {isDevDashboard
                            ? "Payments from schools will appear here after they are processed."
                            : "Payments will appear here after you make a payment."}
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    onClick={() => handleRowClick(payment)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && payment.status === "pending") {
                        handleRowClick(payment);
                      }
                    }}
                    role={payment.status === "pending" ? "button" : undefined}
                    tabIndex={payment.status === "pending" ? 0 : undefined}
                    className={`border-b border-surface-700 transition-colors duration-200 ${
                      payment.status === "pending" ? "hover:bg-surface-700/50 cursor-pointer" : "hover:bg-surface-700/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-white font-mono text-sm">
                        {payment.reference}
                      </span>
                    </td>
                    {isDevDashboard && (
                      <td className="px-4 py-3 text-slate-300 text-sm">
                        {payment.schoolName || payment.schoolId || "Unknown school"}
                      </td>
                    )}
                    <td className="px-4 py-3 text-white font-semibold tabular-nums">
                      ₦{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {payment.paymentMethod || "PayStack"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-xs font-semibold capitalize ${getStatusBadge(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : new Date(payment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                    </td>
                    <td className="px-4 py-3">
                      {payment.status === "pending" ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payments/success?reference=${encodeURIComponent(payment.reference)}`);
                          }}
                          className="inline-flex items-center gap-2 bg-surface-700 hover:bg-surface-600 text-slate-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                        >
                          Verify
                        </button>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
