import React, { useState, useEffect } from "react";
import type { User, CreateUserRequest, UserRoleType } from "../../types/user";
import { UserRole } from "../../types/user";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUserStore } from "../../stores/useUserStore";
import UserTable from "../../components/users/UserTable";
import UserModal from "../../components/users/UserModal";
import FilterTabs from "../../components/users/FilterTabs";

const UserManagement: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const {
    users,
    totalUsers,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    fetchUsers,
    searchUsers,
    createUser,
    deleteUser,
    clearMessages,
  } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<UserRoleType | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const schoolId = user?.schoolId;
  const userRole = user?.role;

  const canAddUser = userRole === 0 || userRole === 1 || userRole === 2;
  const canEditUser = userRole === 0 || userRole === 1;
  const canDeleteUser = userRole === 0 || userRole === 1;

  useEffect(() => {
    if (!schoolId) return;
    if (searchQuery.trim()) {
      searchUsers(schoolId, searchQuery, currentPage, ITEMS_PER_PAGE);
    } else {
      fetchUsers(schoolId, currentPage, ITEMS_PER_PAGE);
    }
  }, [schoolId, searchQuery, currentPage, fetchUsers, searchUsers]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(clearMessages, 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, clearMessages]);

  const filteredUsers =
    activeFilter === "all"
      ? users
      : users.filter((u) => u.role === activeFilter);

  const calculateCounts = () => ({
    all: totalUsers,
    staff: users.filter((u) => u.role === UserRole.Staff).length,
    students: users.filter((u) => u.role === UserRole.Student).length,
    admins: users.filter((u) => u.role === UserRole.SuperAdmin).length,
  });

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (u: User) => {
    if (!canEditUser) return;
    setSelectedUser(u);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (u: User) => {
    if (!canDeleteUser) return;
    if (window.confirm(`Are you sure you want to delete ${u.firstName} ${u.lastName}?`)) {
      deleteUser(u.id);
    }
  };

  const handleFormSubmit = async (userData: CreateUserRequest) => {
    await createUser(userData);
    setIsModalOpen(false);
    if (schoolId) fetchUsers(schoolId, currentPage, ITEMS_PER_PAGE);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalUsers);

  if (!schoolId) {
    return (
      <div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Unable to load users. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex justify-between items-center">
          {error}
          <button onClick={clearMessages} className="text-xl font-bold hover:opacity-70">×</button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex justify-between items-center">
          {successMessage}
          <button onClick={clearMessages} className="text-xl font-bold hover:opacity-70">×</button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        {canAddUser && (
          <button
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
            onClick={handleAddUser}
          >
            + Add New User
          </button>
        )}
      </div>

      <div>
        <input
          type="text"
          className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <FilterTabs
        counts={calculateCounts()}
        activeFilter={activeFilter}
        onFilterChange={(f) => { setActiveFilter(f); setCurrentPage(1); }}
      />

      <UserTable
        users={filteredUsers}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        canEdit={canEditUser}
        canDelete={canDeleteUser}
      />

      {!isLoading && filteredUsers.length > 0 && (
        <div className="flex justify-between items-center pt-6 border-t border-surface-700">
          <span className="text-slate-400">
            Showing {startItem}-{endItem} of {totalUsers} users
          </span>
          <div className="flex gap-4 items-center">
            <button
              className="px-4 py-2 bg-surface-700 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-600 transition-colors"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-slate-400">Page {currentPage} of {totalPages}</span>
            <button
              className="px-4 py-2 bg-surface-700 text-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-600 transition-colors"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        isLoading={isSubmitting}
        onClose={() => { setIsModalOpen(false); setSelectedUser(undefined); }}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        schoolId={schoolId}
      />
    </div>
  );
};

export default UserManagement;
