import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import type { UserProfile } from "../../types/profile";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import PersonalInfoForm from "../../components/profile/PersonalInfoForm";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    if (authUser?.userId) {
      fetchUserProfile();
    }
  }, [authUser?.userId]);

  const fetchUserProfile = async () => {
    if (!authUser?.userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const profile = await profileService.getUserProfile(authUser.userId);
      setUserProfile({
        ...profile,
        roleLabel: profileService.getRoleLabel(profile.role),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (
    firstName: string,
    lastName: string,
    phoneNumber?: string
  ) => {
    if (!authUser?.userId || !userProfile) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await profileService.updateProfile({
        userId: authUser.userId,
        firstName,
        lastName,
        phoneNumber,
      });

      setUserProfile({
        ...response.user,
        roleLabel: profileService.getRoleLabel(response.user.role),
      });

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!authUser?.userId) return;

    setIsLoading(true);
    setError(null);
    try {
      await profileService.changePassword({
        userId: authUser.userId,
        currentPassword,
        newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to change password. Please check your current password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!authUser?.userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileService.uploadAvatar(
        authUser.userId,
        file
      );

      setUserProfile({
        ...updatedProfile,
        roleLabel: profileService.getRoleLabel(updatedProfile.role),
      });

      setSuccessMessage("Avatar uploaded successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload avatar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    // Give the logout a moment to clear state before navigating
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };

  if (isLoading && !userProfile) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error || "Unable to load profile"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-slate-400">Manage your account and security settings</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400">
          {successMessage}
        </div>
      )}

      {/* Profile Content */}
      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="bg-slate-800 rounded-lg p-6">
          <ProfileAvatar
            user={userProfile}
            onAvatarUpload={handleAvatarUpload}
            isLoading={isLoading}
          />
        </div>

        {/* Personal Information */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
            <p className="text-slate-400">
              Update your profile information
            </p>
          </div>
          <PersonalInfoForm
            user={userProfile}
            onSubmit={handleUpdateProfile}
            isLoading={isLoading}
          />
        </div>

        {/* Change Password */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
            <p className="text-slate-400">
              Update your password to keep your account secure
            </p>
          </div>
          <ChangePasswordForm
            onSubmit={handleChangePassword}
            isLoading={isLoading}
          />
        </div>

        {/* Logout Section */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Logout</h2>
            <p className="text-slate-400">
              Sign out of your account on this device
            </p>
          </div>
          <button
            className="w-full bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-lg font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowLogoutConfirm(true)}
            disabled={isLoading}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-slate-800 rounded-lg shadow-lg w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Confirm Logout</h2>
              <button
                className="text-slate-400 hover:text-slate-50"
                onClick={() => setShowLogoutConfirm(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-50">Are you sure you want to logout?</p>
              <p className="text-slate-400">
                You will need to login again to access your account.
              </p>
            </div>

            <div className="flex gap-4 p-6 border-t border-slate-700">
              <button
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-50 rounded-lg hover:bg-slate-600 transition-colors"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
