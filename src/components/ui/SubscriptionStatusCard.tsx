import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SubscriptionStatusCardProps {
  planType: "Local" | "Remote";
  status: "Active" | "Pending" | "Deactivated";
  expiryDate: string;
  paymentMethod: string;
}

const SubscriptionStatusCard = ({
  planType,
  status,
  expiryDate,
  paymentMethod,
}: SubscriptionStatusCardProps) => {
  const expiryDateObj = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Active":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      case "Deactivated":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "Active":
        return <CheckCircle size={20} style={{ color: getStatusColor(s) }} />;
      case "Pending":
        return <Clock size={20} style={{ color: getStatusColor(s) }} />;
      case "Deactivated":
        return <AlertCircle size={20} style={{ color: getStatusColor(s) }} />;
      default:
        return null;
    }
  };

  const isExpiringWarning = daysUntilExpiry <= 30 && daysUntilExpiry > 7;
  const isExpiringAlert = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-md">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-slate-50">Subscription Status</h3>
        <div className="flex gap-2 items-center">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              planType === "Local"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-purple-500/20 text-purple-400"
            }`}
          >
            {planType}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Status:</span>
          <span className="flex gap-2 items-center">
            {getStatusIcon(status)}
            <strong className="text-slate-50">{status}</strong>
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Expires:</span>
          <span className="flex items-center gap-2">
            <span className="text-slate-50">
              {expiryDateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {isExpiringAlert && (
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400">
                Expires in {daysUntilExpiry} days
              </span>
            )}
            {isExpiringWarning && (
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                Expiring Soon
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Payment Method:</span>
          <span className="text-slate-50">{paymentMethod}</span>
        </div>
      </div>

      {isExpiringWarning || isExpiringAlert ? (
        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Renew Subscription
        </button>
      ) : null}
    </div>
  );
};

export default SubscriptionStatusCard;
