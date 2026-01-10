export type UserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  uin: string;
  role: number;
  roleLabel: string;
  phoneNumber?: string;
  schoolId: string;
  schoolName?: string;
  avatar?: string;
};

export type UpdateProfileRequest = {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
};

export type UpdateProfileResponse = {
  success: boolean;
  user: UserProfile;
  message?: string;
};

export type ChangePasswordRequest = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message?: string;
};

export type PasswordStrength = "weak" | "medium" | "strong";

export type PasswordRequirements = {
  hasMinLength: boolean;
  hasMixedCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};
