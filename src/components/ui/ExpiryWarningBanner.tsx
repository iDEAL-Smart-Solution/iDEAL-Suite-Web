import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface ExpiryWarningBannerProps {
  expiryDate: string;
}

const ExpiryWarningBanner = ({ expiryDate }: ExpiryWarningBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  const expiryDateObj = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Only show if expires in less than 30 days
  if (daysUntilExpiry > 30 || daysUntilExpiry <= 0 || dismissed) {
    return null;
  }

  const isAlert = daysUntilExpiry <= 7;

  return (
    <div
      className={`flex items-center gap-3 p-4 mb-6 rounded-lg border ${
        isAlert
          ? "bg-red-500/10 border-red-500/30"
          : "bg-yellow-500/10 border-yellow-500/30"
      }`}
    >
      <AlertTriangle
        size={20}
        className={isAlert ? "text-red-400 flex-shrink-0" : "text-yellow-400 flex-shrink-0"}
      />
      <div className="flex-1">
        <strong className={isAlert ? "text-red-400" : "text-yellow-400"}>
          Your subscription expires in {daysUntilExpiry} day
          {daysUntilExpiry !== 1 ? "s" : ""}
        </strong>
        <p className={`text-sm mt-1 ${isAlert ? "text-red-400" : "text-yellow-400"}`}>
          Renew now to avoid interruption.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className={`bg-transparent border-none cursor-pointer p-1 flex items-center flex-shrink-0 hover:opacity-75 transition-opacity`}
        aria-label="Dismiss warning"
      >
        <X size={18} className={isAlert ? "text-red-400" : "text-yellow-400"} />
      </button>
    </div>
  );
};

export default ExpiryWarningBanner;
