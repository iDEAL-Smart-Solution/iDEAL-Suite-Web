import api from "./api";
import type {
  Subscription,
  CreateSubscriptionRequest,
  SubscriptionResponse,
  SubscriptionHistoryResponse,
} from "../types/subscription";
import { mockDashboardSubscriptions } from "../mocks/subscriptions.mock";

// Check if we're in demo mode
const isDemoMode = () => localStorage.getItem("token") === "demo-token";

export const subscriptionService = {
  /**
   * Create a new subscription
   */
  createSubscription: async (
    data: CreateSubscriptionRequest
  ): Promise<SubscriptionResponse> => {
    try {
      // Return mock response in demo mode
      if (isDemoMode()) {
        const newSubscription: Subscription = {
          id: "sub-new-" + Date.now(),
          schoolId: data.schoolId,
          paidStudentSlots: data.paidStudentSlots,
          startDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: data.status,
          paymentMethod: data.paymentMethod,
          createdAt: new Date().toISOString(),
        };

        return {
          subscription: newSubscription,
          message: "Subscription created successfully",
        };
      }

      const response = await api.post<SubscriptionResponse>(
        "/subscription/create",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  },

  /**
   * Get subscription history for a school
   */
  getSubscriptionHistory: async (
    schoolId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<SubscriptionHistoryResponse> => {
    try {
      // Return mock data in demo mode
      if (isDemoMode()) {
        return { data: mockDashboardSubscriptions.history } as SubscriptionHistoryResponse;
      }

      const response = await api.get<SubscriptionHistoryResponse>(
        `/subscription/history/${schoolId}`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      throw error;
    }
  },

  /**
   * Get current active subscription for a school
   */
  getCurrentSubscription: async (
    schoolId: string
  ): Promise<Subscription | null> => {
    try {
      // Return mock data in demo mode
      if (isDemoMode()) {
        return mockDashboardSubscriptions.currentSubscription;
      }

      const response = await api.get<Subscription>(
        `/subscription/current/${schoolId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      // Return null if no active subscription exists
      return null;
    }
  },

  /**
   * Renew subscription (create new one with new expiry date)
   */
  renewSubscription: async (
    schoolId: string,
    slots: number,
    paymentMethod: string
  ): Promise<SubscriptionResponse> => {
    try {
      const today = new Date();
      const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

      const data: CreateSubscriptionRequest = {
        schoolId,
        paidStudentSlots: slots,
        startDate: today.toISOString(),
        expiryDate: nextYear.toISOString(),
        paymentMethod: paymentMethod as any,
        status: 1,
      };

      return subscriptionService.createSubscription(data);
    } catch (error) {
      console.error("Error renewing subscription:", error);
      throw error;
    }
  },

  /**
   * Check subscription status and warnings
   */
  getSubscriptionStatus: async (
    schoolId: string
  ): Promise<{
    subscription: Subscription | null;
    daysRemaining: number;
    slotUsagePercent: number;
    isExpiringSoon: boolean;
    isNearCapacity: boolean;
  } | null> => {
    try {
      const subscription = await subscriptionService.getCurrentSubscription(
        schoolId
      );

      if (!subscription) {
        return null;
      }

      const expiryDate = new Date(subscription.expiryDate);
      const today = new Date();
      const daysRemaining = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      const slotUsagePercent = (0 / subscription.paidStudentSlots) * 100; // Will be updated with actual data

      return {
        subscription,
        daysRemaining,
        slotUsagePercent,
        isExpiringSoon: daysRemaining <= 30 && daysRemaining > 0,
        isNearCapacity: slotUsagePercent > 90,
      };
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return null;
    }
  },
};
