import React, { useState, useEffect } from "react";
import type {
  Subscription,
  CreateSubscriptionRequest,
} from "../../types/subscription";
import { subscriptionService } from "../../services/subscriptionService";
import { getUser } from "../../services/auth.service";
import CurrentSubscriptionCard from "../../components/subscriptions/CurrentSubscriptionCard";
import CreateSubscriptionModal from "../../components/subscriptions/CreateSubscriptionModal";
import SubscriptionHistoryTable from "../../components/subscriptions/SubscriptionHistoryTable";

const SubscriptionManagement: React.FC = () => {
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<
    Subscription[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenewalMode, setIsRenewalMode] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentUser = getUser();
  const schoolId = currentUser?.schoolId;

  useEffect(() => {
    if (schoolId) {
      fetchSubscriptionData();
    }
  }, [schoolId]);

  const fetchSubscriptionData = async () => {
    if (!schoolId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch current subscription
      const current = await subscriptionService.getCurrentSubscription(schoolId);
      setCurrentSubscription(current);

      // Calculate days remaining
      if (current) {
        const expiryDate = new Date(current.expiryDate);
        const today = new Date();
        const remaining = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        setDaysRemaining(remaining);
      }

      // Fetch subscription history
      const history = await subscriptionService.getSubscriptionHistory(
        schoolId
      );
      setSubscriptionHistory(history.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch subscription data";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubscription = async (
    data: CreateSubscriptionRequest
  ) => {
    try {
      setIsSubmitting(true);

      const response = await subscriptionService.createSubscription(data);

      setSuccessMessage(
        response.message || "Subscription created successfully!"
      );

      // Refresh data
      fetchSubscriptionData();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create subscription";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenRenewalModal = () => {
    setIsRenewalMode(true);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setIsRenewalMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRenewalMode(false);
  };

  const handleUpgradePlan = () => {
    handleOpenCreateModal();
  };

  if (!schoolId) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Unable to load subscription data. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex justify-between items-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="text-xl font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex justify-between items-center">
          {successMessage}
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xl font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          onClick={handleOpenCreateModal}
        >
          + Create New Subscription
        </button>
      </div>

      {/* Current Subscription Card */}
      <div>
        <CurrentSubscriptionCard
          subscription={currentSubscription}
          usedSlots={0}
          daysRemaining={daysRemaining}
          onRenew={handleOpenRenewalModal}
          onUpgrade={handleUpgradePlan}
          isLoading={isLoading}
        />
      </div>

      {/* Subscription History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Subscription History</h2>
        <SubscriptionHistoryTable
          subscriptions={subscriptionHistory}
          isLoading={isLoading}
        />
      </div>

      {/* Create/Renew Subscription Modal */}
      <CreateSubscriptionModal
        isOpen={isModalOpen}
        isLoading={isSubmitting}
        onClose={handleCloseModal}
        onSubmit={handleCreateSubscription}
        schoolId={schoolId}
        isRenewal={isRenewalMode}
        prefilledSlots={currentSubscription?.paidStudentSlots}
      />
    </div>
  );
};

export default SubscriptionManagement;
