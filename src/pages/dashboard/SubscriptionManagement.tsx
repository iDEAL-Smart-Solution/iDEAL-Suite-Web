import React, { useState, useEffect } from "react";
import type { CreateSubscriptionRequest } from "../../types/subscription";
import { useAuthStore } from "../../stores/useAuthStore";
import { useSubscriptionStore } from "../../stores/useSubscriptionStore";
import CurrentSubscriptionCard from "../../components/subscriptions/CurrentSubscriptionCard";
import CreateSubscriptionModal from "../../components/subscriptions/CreateSubscriptionModal";
import SubscriptionHistoryTable from "../../components/subscriptions/SubscriptionHistoryTable";
import PaymentModal from "../../components/subscriptions/PaymentModal";
import PageHeader from "../../components/layout/PageHeader";

const SubscriptionManagement: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const {
    currentSubscription,
    subscriptionHistory,
    daysRemaining,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    fetchCurrentSubscription,
    fetchSubscriptionHistory,
    createSubscription,
    clearMessages,
  } = useSubscriptionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenewalMode, setIsRenewalMode] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const schoolId = user?.schoolId;

  useEffect(() => {
    if (schoolId) {
      fetchCurrentSubscription(schoolId);
      fetchSubscriptionHistory(schoolId);
    }
  }, [schoolId, fetchCurrentSubscription, fetchSubscriptionHistory]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(clearMessages, 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, clearMessages]);

  const handleCreateSubscription = async (data: CreateSubscriptionRequest) => {
    await createSubscription(data);
    setIsModalOpen(false);
    if (schoolId) {
      fetchCurrentSubscription(schoolId);
      fetchSubscriptionHistory(schoolId);
    }
  };

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

      <PageHeader
        title="Subscription Management"
        action={
          <button
            className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-all"
            onClick={() => { setIsRenewalMode(false); setIsModalOpen(true); }}
          >
            + Create New Subscription
          </button>
        }
      />

      <CurrentSubscriptionCard
        subscription={currentSubscription}
        usedSlots={0}
        daysRemaining={daysRemaining}
        onRenew={() => { setIsRenewalMode(true); setIsModalOpen(true); }}
        onUpgrade={() => { setIsRenewalMode(false); setIsModalOpen(true); }}
        onMakePayment={() => setIsPaymentOpen(true)}
        isLoading={isLoading}
      />

      <div className="space-y-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white">Subscription History</h2>
        <SubscriptionHistoryTable subscriptions={subscriptionHistory} isLoading={isLoading} />
      </div>

      <CreateSubscriptionModal
        isOpen={isModalOpen}
        isLoading={isSubmitting}
        onClose={() => { setIsModalOpen(false); setIsRenewalMode(false); }}
        onSubmit={handleCreateSubscription}
        schoolId={schoolId}
        isRenewal={isRenewalMode}
        prefilledSlots={currentSubscription?.paidStudentSlots}
      />

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

export default SubscriptionManagement;
