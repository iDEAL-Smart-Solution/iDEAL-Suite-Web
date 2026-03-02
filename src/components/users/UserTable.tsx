import React from "react";
import { cn } from "../../lib/utils";
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
      return "bg-brand-500/20 text-brand-400";
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
      <div className="bg-surface-800 rounded-xl border border-surface-700 p-8 shadow-sm">
        <div className="text-center text-slate-400">Loading users...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-surface-800 rounded-xl border border-surface-700 p-8 shadow-sm">
        <div className="text-center">
          <p className="text-slate-400">No users found. Add your first user!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-surface-900 border-b border-surface-700">
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
              <tr key={user.id} className="border-b border-surface-700 hover:bg-surface-700/50 transition-colors duration-200">
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-semibold text-sm">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3 text-slate-400">{user.phoneNumber}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-block px-3 py-1 rounded-md text-xs font-semibold", getRoleColor(user.role))}>
                    {getRoleName(user.role)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-md text-xs font-semibold",
                    user.status === "active" 
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {user.status || "active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {canEdit && (
                      <button
                        className="bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 font-semibold py-1 px-3 rounded-lg text-sm transition-colors duration-200"
                        onClick={() => onEdit(user)}
                        title="Edit user"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold py-1 px-3 rounded-lg text-sm transition-colors duration-200"
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
