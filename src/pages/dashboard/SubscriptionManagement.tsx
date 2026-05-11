import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useSubscriptionStore } from "../../stores/useSubscriptionStore";
import CurrentSubscriptionCard from "../../components/subscriptions/CurrentSubscriptionCard";
import PageHeader from "../../components/layout/PageHeader";

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    currentSubscription,
    daysRemaining,
    isLoading,
    error,
    successMessage,
    fetchCurrentSubscription,
    clearMessages,
  } = useSubscriptionStore();

  const schoolId = user?.schoolId;

  useEffect(() => {
    if (schoolId) {
      fetchCurrentSubscription(schoolId);
    }
  }, [schoolId, fetchCurrentSubscription]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(clearMessages, 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, clearMessages]);

  // Subscription creation is now handled automatically on verified payment.
  // Manual creation UI has been removed to avoid inconsistent state.

  if (!schoolId) {
    return (
      <div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Unable to load subscription data. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex justify-between items-center">
          {error}
          <button onClick={clearMessages} className="text-xl font-bold hover:opacity-70">×</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex justify-between items-center">
          {successMessage}
          <button onClick={clearMessages} className="text-xl font-bold hover:opacity-70">×</button>
        </div>
      )}

      <PageHeader title="Subscription Management" />

      <CurrentSubscriptionCard
        subscription={currentSubscription}
        usedSlots={0}
        daysRemaining={daysRemaining}
        onRenew={() => {
          const productId = currentSubscription?.productId;
          navigate(
            productId
              ? `/payments/initialize?productId=${encodeURIComponent(productId)}&action=renew`
              : "/payments/initialize?action=renew"
          );
        }}
        onUpgrade={() => {
          const productId = currentSubscription?.productId;
          navigate(
            productId
              ? `/payments/initialize?productId=${encodeURIComponent(productId)}&action=upgrade`
              : "/payments/initialize?action=upgrade"
          );
        }}
        onMakePayment={() => {
          const productId = currentSubscription?.productId;
          navigate(
            productId
              ? `/payments/initialize?productId=${encodeURIComponent(productId)}`
              : "/payments/initialize"
          );
        }}
        isLoading={isLoading}
      />

      {/* Manual subscription modal removed. Subscriptions are created automatically on verified payments. */}
    </div>
  );
};

export default SubscriptionManagement;
