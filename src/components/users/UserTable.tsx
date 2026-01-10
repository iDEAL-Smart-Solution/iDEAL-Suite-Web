import React from "react";
import type { User, UserRoleType } from "../../types/user";
import { UserRole } from "../../types/user";

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const getRoleColor = (role: UserRoleType): string => {
  switch (role) {
    case UserRole.SuperAdmin:
      return "bg-red-500/20 text-red-400";
    case UserRole.Staff:
      return "bg-blue-500/20 text-blue-400";
    case UserRole.Student:
      return "bg-green-500/20 text-green-400";
    case UserRole.Dev:
      return "bg-purple-500/20 text-purple-400";
    default:
      return "bg-slate-500/20 text-slate-400";
  }
};

const getRoleName = (role: UserRoleType): string => {
  switch (role) {
    case UserRole.SuperAdmin:
      return "SuperAdmin";
    case UserRole.Staff:
      return "Staff";
    case UserRole.Student:
      return "Student";
    case UserRole.Dev:
      return "Dev";
    default:
      return "Unknown";
  }
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading = false,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <div className="text-center text-slate-400">Loading users...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <div className="text-center">
          <p className="text-slate-400">No users found. Add your first user!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Avatar</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Full Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Phone Number</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-50 font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3 text-slate-400">{user.phoneNumber}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {getRoleName(user.role)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === "active" 
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {user.status || "active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {canEdit && (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
                        onClick={() => onEdit(user)}
                        title="Edit user"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
                        onClick={() => onDelete(user)}
                        title="Delete user"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
