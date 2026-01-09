export const mockMetrics = [
  { title: "Total Users", value: 175 },
  { title: "Total Staff", value: 25 },
  { title: "Total Students", value: 150 },
  { title: "Slots Used", value: "145/200" },
];

export const mockStudentGrowth = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 180 },
  { month: "Mar", students: 260 },
  { month: "Apr", students: 340 },
  { month: "May", students: 420 },
];

export const mockUsage = [
  { name: "Students", count: 820 },
  { name: "Staff", count: 64 },
  { name: "Admins", count: 8 },
];

export const mockDashboardStats = {
  schoolName: "Grace Academy",
  schoolEmail: "admin@graceacademy.com",
  planType: "Local" as const,
  totalStudents: 150,
  totalStaff: 25,
  totalUsers: 175,
  subscribedSlots: 200,
  totalRegisteredStudents: 145,
  paymentMethod: "Card",
  expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
  subscriptionStatus: "Active" as const,
  products: [
    {
      id: "1",
      name: "Attendance System",
      usageCount: 1250,
      status: "Active",
      lastUsed: "2025-01-09",
    },
    {
      id: "2",
      name: "Grade Management",
      usageCount: 890,
      status: "Active",
      lastUsed: "2025-01-09",
    },
    {
      id: "3",
      name: "Library Management",
      usageCount: 0,
      status: "Inactive",
      lastUsed: undefined,
    },
  ],
};
