import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProfileStore } from "../../stores/useProfileStore";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import PersonalInfoForm from "../../components/profile/PersonalInfoForm";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import PageHeader from "../../components/layout/PageHeader";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    profile,
    isLoading,
    error,
    successMessage,
    fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    clearMessages,
  } = useProfileStore();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (user?.id) fetchProfile(user.id);
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(clearMessages, 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, clearMessages]);

  const handleUpdateProfile = async (firstName: string, lastName: string, phoneNumber?: string) => {
    if (!user?.id) return;
    await updateProfile({ userId: user.id, firstName, lastName, phoneNumber });
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.id) return;
    await changePassword(user.id, currentPassword, newPassword);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user?.id) return;
    await uploadAvatar(user.id, file);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    setTimeout(() => navigate("/login", { replace: true }), 100);
  };

  if (isLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-surface-700 border-t-brand-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error || "Unable to load profile"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your account and security settings"
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">{error}</div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400">{successMessage}</div>
      )}

      <div className="space-y-8">
        <div className="bg-surface-800 rounded-xl p-4 md:p-6">
          <ProfileAvatar user={profile} onAvatarUpload={handleAvatarUpload} isLoading={isLoading} />
        </div>

        <div className="bg-surface-800 rounded-xl p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Personal Information</h2>
            <p className="text-slate-400">Update your profile information</p>
          </div>
          <PersonalInfoForm user={profile} onSubmit={handleUpdateProfile} isLoading={isLoading} />
        </div>

        <div className="bg-surface-800 rounded-xl p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Change Password</h2>
            <p className="text-slate-400">Update your password to keep your account secure</p>
          </div>
          <ChangePasswordForm onSubmit={handleChangePassword} isLoading={isLoading} />
        </div>

        <div className="bg-surface-800 rounded-xl p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Logout</h2>
            <p className="text-slate-400">Sign out of your account on this device</p>
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

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-surface-800 rounded-xl shadow-lg w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-surface-700">
              <h2 className="text-lg md:text-2xl font-bold text-white">Confirm Logout</h2>
              <button className="text-slate-400 hover:text-slate-50" onClick={() => setShowLogoutConfirm(false)}>✕</button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <p className="text-slate-50">Are you sure you want to logout?</p>
              <p className="text-slate-400">You will need to login again to access your account.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 p-4 md:p-6 border-t border-surface-700">
              <button className="w-full sm:flex-1 px-4 py-2 bg-surface-700 text-slate-200 rounded-lg hover:bg-surface-600 transition-colors" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button className="w-full sm:flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
