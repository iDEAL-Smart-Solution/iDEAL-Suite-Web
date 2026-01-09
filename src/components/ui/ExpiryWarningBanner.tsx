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
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        marginBottom: "24px",
        borderRadius: "8px",
        backgroundColor: isAlert ? "#fee2e2" : "#fef3c7",
        border: `1px solid ${isAlert ? "#fca5a5" : "#fde047"}`,
      }}
    >
      <AlertTriangle
        size={20}
        style={{ color: isAlert ? "#991b1b" : "#92400e", flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <strong style={{ color: isAlert ? "#991b1b" : "#92400e" }}>
          Your subscription expires in {daysUntilExpiry} day
          {daysUntilExpiry !== 1 ? "s" : ""}
        </strong>
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: "14px",
            color: isAlert ? "#991b1b" : "#92400e",
          }}
        >
          Renew now to avoid interruption.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
        aria-label="Dismiss warning"
      >
        <X size={18} style={{ color: isAlert ? "#991b1b" : "#92400e" }} />
      </button>
    </div>
  );
};

export default ExpiryWarningBanner;
