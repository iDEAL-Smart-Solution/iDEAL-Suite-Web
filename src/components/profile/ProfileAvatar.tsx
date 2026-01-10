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
    <div className="profile-avatar-section">
      <div className="avatar-container">
        {user.avatar ? (
          <img src={user.avatar} alt={user.firstName} className="avatar-image" />
        ) : (
          <div className="avatar-initials">{getInitials()}</div>
        )}
      </div>

      <div className="avatar-info">
        <h3 className="avatar-name">
          {user.firstName} {user.lastName}
        </h3>
        <p className="avatar-role">{user.roleLabel || "User"}</p>
        {user.schoolName && <p className="avatar-school">{user.schoolName}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden-file-input"
      />

      <button
        className="btn btn-secondary avatar-upload-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "📷 Upload Photo"}
      </button>
    </div>
  );
};

export default ProfileAvatar;
