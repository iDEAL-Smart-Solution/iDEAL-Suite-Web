import type { UserProfile } from "../types/profile";

export const mockUserProfile: UserProfile = {
  userId: "demo-user-001",
  firstName: "Demo",
  lastName: "Admin",
  email: "demo@ideal-suite.com",
  uin: "SCH-DEMO-001",
  role: 1,
  roleLabel: "SuperAdmin",
  phoneNumber: "+234 801 000 0001",
  schoolId: "demo-school-001",
  schoolName: "Demo Academy",
  avatar: undefined,
};

export const mockDashboardProfile = mockUserProfile;
