import type { Subscription } from "../types/subscription";

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub-001",
    schoolId: "demo-school-001",
    planType: "Local",
    status: 1, // Active
    paidStudentSlots: 500,
    startDate: "2024-01-01",
    expiryDate: "2025-12-31",
    paymentMethod: "Card",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "sub-002",
    schoolId: "demo-school-001",
    planType: "Local",
    status: 2, // Pending
    paidStudentSlots: 200,
    startDate: "2024-06-01",
    expiryDate: "2025-05-31",
    paymentMethod: "Bank Transfer",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
];

export const mockCurrentSubscription: Subscription = mockSubscriptions[0];

export const mockSubscriptionHistory = [
  {
    id: "sub-003",
    schoolId: "demo-school-001",
    planType: "Local",
    status: 3, // Deactivated
    paidStudentSlots: 100,
    startDate: "2023-01-01",
    expiryDate: "2023-12-31",
    paymentMethod: "Card",
    createdAt: "2023-01-01T10:00:00Z",
    updatedAt: "2023-12-31T10:00:00Z",
  },
  {
    id: "sub-004",
    schoolId: "demo-school-001",
    planType: "Remote",
    status: 3, // Deactivated
    paidStudentSlots: 400,
    startDate: "2022-01-01",
    expiryDate: "2022-12-31",
    paymentMethod: "PayStack",
    createdAt: "2022-01-01T10:00:00Z",
    updatedAt: "2022-12-31T10:00:00Z",
  },
];

export const mockDashboardSubscriptions = {
  currentSubscription: mockCurrentSubscription,
  history: mockSubscriptionHistory,
};
