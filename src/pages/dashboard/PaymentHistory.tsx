import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useSubscriptionStore } from "../../stores/useSubscriptionStore";
import PaymentModal from "../../components/subscriptions/PaymentModal";

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
  const user = useAuthStore((s) => s.user);
  const { payments, isLoading, error, fetchPayments, clearMessages } =
    usePaymentStore();
  const { currentSubscription, fetchCurrentSubscription } =
    useSubscriptionStore();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const schoolId = user?.schoolId;

  useEffect(() => {
    if (schoolId) {
      fetchPayments(schoolId);
      fetchCurrentSubscription(schoolId);
    }
  }, [schoolId, fetchPayments, fetchCurrentSubscription]);

  if (!schoolId) {
    return (
      <div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Unable to load payment data. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex justify-between items-center">
          {error}
          <button
            onClick={clearMessages}
            className="text-xl font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Payments</h1>
          <p className="text-slate-400 mt-1">
            View payment history and make new payments
          </p>
        </div>
        <button
          className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
          onClick={() => setIsPaymentOpen(true)}
        >
          <CreditCard className="w-4 h-4" />
          Make Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Total Payments</p>
          <p className="text-2xl font-bold text-white">{payments.length}</p>
        </div>
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Successful</p>
          <p className="text-2xl font-bold text-green-400">
            {payments.filter((p) => p.status === "success").length}
          </p>
        </div>
        <div className="bg-surface-800 border border-surface-700 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-brand-400">
            ₦
            {payments
              .filter((p) => p.status === "success")
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-surface-800 rounded-xl border border-surface-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-surface-900 border-b border-surface-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Reference
                </th>
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
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-4 border-surface-700 border-t-brand-500 rounded-full animate-spin" />
                      Loading payments...
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    <div className="space-y-2">
                      <CreditCard className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="font-medium">No payments yet</p>
                      <p className="text-sm text-slate-500">
                        Payments will appear here after you make a payment.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-surface-700 hover:bg-surface-700/50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">
                      <span className="text-white font-mono text-sm">
                        {payment.reference}
                      </span>
                    </td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        subscription={currentSubscription}
        schoolId={schoolId}
        email={user?.email || ""}
      />
    </div>
  );
};

export default PaymentHistory;
