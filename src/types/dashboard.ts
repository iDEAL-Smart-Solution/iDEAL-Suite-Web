export interface DashboardStats {
  schoolName: string;
  schoolEmail: string;
  planType: "Local" | "Remote";
  totalStudents: number;
  totalStaff: number;
  totalUsers: number;
  subscribedSlots: number;
  totalRegisteredStudents: number;
  paymentMethod: string;
  expiryDate: string;
  subscriptionStatus: "Active" | "Pending" | "Deactivated";
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  usageCount: number;
  status: "Active" | "Inactive";
  lastUsed?: string;
}

export interface UsageChartData {
  name: string;
  count: number;
}

export interface ReportingSubscriptionOverview {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  deactivatedSubscriptions: number;
  expiringSoon: number;
}
