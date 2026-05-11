import React from "react";
import { Pencil, Trash2 } from "lucide-react";
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
  const getInitials = (firstName?: string, lastName?: string, fallbackName?: string): string => {
    const safeFirst = firstName?.trim();
    const safeLast = lastName?.trim();

    if (safeFirst || safeLast) {
      return `${safeFirst?.charAt(0) ?? ""}${safeLast?.charAt(0) ?? ""}`.toUpperCase();
    }

    const fallbackParts = fallbackName?.trim().split(/\s+/).filter(Boolean) ?? [];
    if (fallbackParts.length === 0) {
      return "?";
    }

    return `${fallbackParts[0]?.charAt(0) ?? ""}${fallbackParts[1]?.charAt(0) ?? ""}`.toUpperCase();
  };

  const getStatus = (status?: User["status"]): "active" | "inactive" => {
    return status === "inactive" ? "inactive" : "active";
  };

  if (isLoading) {
    return (
      <div className="bg-surface-800 rounded-xl border border-surface-700 p-4 md:p-6 shadow-sm">
        <div className="text-center text-slate-400">Loading users...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-surface-800 rounded-xl border border-surface-700 p-4 md:p-6 shadow-sm">
        <div className="text-center">
          <p className="text-slate-400">No users found. Add your first user!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px]">
          <thead>
            <tr className="bg-surface-900 border-b border-surface-700">
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Avatar</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Full Name</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</th>
              <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Phone Number</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Role</th>
              <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const status = getStatus(user.status);

              return (
                <tr key={user.id} className="border-b border-surface-700 hover:bg-surface-700/50 transition-colors duration-200">
                  <td className="px-3 sm:px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center font-semibold text-sm">
                      {getInitials(user.firstName, user.lastName, `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim())}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className="text-white font-semibold">
                      {user.firstName} {user.lastName}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-400">{user.email}</td>
                  <td className="hidden md:table-cell px-3 sm:px-4 py-3 text-slate-400">{user.phoneNumber}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className={cn("inline-block px-3 py-1 rounded-md text-xs font-semibold", getRoleColor(user.role))}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 py-3">
                    <span className={cn(
                      "inline-block px-3 py-1 rounded-md text-xs font-semibold",
                      status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    )}>
                      {status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {canEdit && (
                        <button
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 hover:text-brand-300 transition-colors duration-200"
                          onClick={() => onEdit(user)}
                          title="Edit user"
                          aria-label="Edit user"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
                          onClick={() => onDelete(user)}
                          title="Delete user"
                          aria-label="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
