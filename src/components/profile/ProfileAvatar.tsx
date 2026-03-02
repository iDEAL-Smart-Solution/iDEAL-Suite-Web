import React, { useRef } from "react";
import type { UserProfile } from "../../types/profile";

interface ProfileAvatarProps {
  user: UserProfile;
  onAvatarUpload: (file: File) => void;
  isLoading?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  user,
  onAvatarUpload,
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = () => {
    const first = (user.firstName || "")[0]?.toUpperCase() || "";
    const last = (user.lastName || "")[0]?.toUpperCase() || "";
    return `${first}${last}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onAvatarUpload(file);
    } else if (file) {
      alert("Please select a valid image file");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="relative w-24 h-24">
        {user.avatar ? (
          <img src={user.avatar} alt={user.firstName} className="w-full h-full rounded-full object-cover ring-2 ring-surface-600" />
        ) : (
          <div className="w-full h-full rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-2xl font-bold">{getInitials()}</div>
        )}
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold text-white">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-slate-400">{user.roleLabel || "User"}</p>
        {user.schoolName && <p className="text-sm text-slate-500">{user.schoolName}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        className="bg-surface-700 hover:bg-surface-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "📷 Upload Photo"}
      </button>
    </div>
  );
};

export default ProfileAvatar;
