import React, { useState, useEffect } from "react";
import type { User, CreateUserRequest, UserRoleType } from "../../types/user";
import { UserRole } from "../../types/user";
import { userService } from "../../services/userService";
import { getUser } from "../../services/auth.service";
import UserTable from "../../components/users/UserTable";
import UserModal from "../../components/users/UserModal";
import FilterTabs from "../../components/users/FilterTabs";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<UserRoleType | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  const currentUser = getUser();
  const schoolId = currentUser?.schoolId;
  const userRole = currentUser?.role;

  // Check permissions
  const canAddUser = userRole === UserRole.SuperAdmin || userRole === UserRole.Staff;
  const canEditUser = userRole === UserRole.SuperAdmin;
  const canDeleteUser = userRole === UserRole.SuperAdmin;

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, activeFilter, currentPage]);

  const fetchUsers = async () => {
    if (!schoolId) return;

    try {
      setIsLoading(true);
      setError(null);

      let response;

      if (searchQuery.trim()) {
        response = await userService.searchUsers(
          schoolId,
          searchQuery,
          currentPage,
          ITEMS_PER_PAGE
        );
      } else {
        response = await userService.getUsers(
          schoolId,
          currentPage,
          ITEMS_PER_PAGE
        );
      }

      let filteredUsers = response.data;

      // Apply role filter
      if (activeFilter !== "all") {
        filteredUsers = filteredUsers.filter((u) => u.role === activeFilter);
      }

      setUsers(filteredUsers);
      setTotalUsers(response.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCounts = (): {
    all: number;
    staff: number;
    students: number;
    admins: number;
  } => {
    return {
      all: totalUsers,
      staff: users.filter((u) => u.role === UserRole.Staff).length,
      students: users.filter((u) => u.role === UserRole.Student).length,
      admins: users.filter((u) => u.role === UserRole.SuperAdmin).length,
    };
  };

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    if (!canEditUser) {
      setError("You don't have permission to edit users");
      return;
    }
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    if (!canDeleteUser) {
      setError("You don't have permission to delete users");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
    );

    if (confirmed) {
      deleteUserConfirmed(user.id);
    }
  };

  const deleteUserConfirmed = async (userId: string) => {
    try {
      setIsSubmitting(true);
      await userService.deleteUser(userId);
      setSuccessMessage("User deleted successfully");
      fetchUsers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleFormSubmit = async (userData: CreateUserRequest) => {
    try {
      setIsSubmitting(true);

      if (selectedUser) {
        // Edit mode - would need update endpoint
        // await userService.updateUser(selectedUser.id, userData);
        // setSuccessMessage("User updated successfully");
      } else {
        // Create new user
        await userService.createUser(userData);
        setSuccessMessage("User created successfully");
      }

      fetchUsers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save user";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: UserRoleType | "all") => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalUsers);

  if (!schoolId) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          Unable to load users. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex justify-between items-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="text-xl font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex justify-between items-center">
          {successMessage}
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xl font-bold hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        {canAddUser && (
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            onClick={handleAddUser}
          >
            + Add New User
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Filter Tabs */}
      <FilterTabs
        counts={calculateCounts()}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* User Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        canEdit={canEditUser}
        canDelete={canDeleteUser}
      />

      {/* Pagination Info */}
      {!isLoading && users.length > 0 && (
        <div className="flex justify-between items-center pt-6 border-t border-slate-700">
          <span className="text-slate-400">
            Showing {startItem}-{endItem} of {totalUsers} users
          </span>
          <div className="flex gap-4 items-center">
            <button
              className="px-4 py-2 bg-slate-700 text-slate-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-slate-700 text-slate-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        isLoading={isSubmitting}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        schoolId={schoolId}
      />
    </div>
  );
};

export default UserManagement;
