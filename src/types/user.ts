export const UserRole = {
  SuperAdmin: 1,
  Staff: 2,
  Student: 3,
  Dev: 4,
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRoleType;
  schoolId: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRoleType;
  schoolId: string;
};

export type UpdateUserRequest = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRoleType;
};

export type UserFilterType = {
  all: boolean;
  staff: boolean;
  students: boolean;
  admins: boolean;
};

export type GetUsersResponse = {
  data: User[];
  total: number;
  page: number;
  limit: number;
};
