import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import PageHeader from "../../components/layout/PageHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import CreateAdminModal from "../../components/users/CreateAdminModal";
import { useSchoolStore } from "../../stores/useSchoolStore";
import api from "../../services/api";

const SchoolAdminsManagement = () => {
  const { schools, fetchAllSchools } = useSchoolStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminsError, setAdminsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    void fetchAllSchools();
  }, [fetchAllSchools]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => setSuccessMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const handleCreateSuccess = (msg?: string) => {
    setSuccessMessage(msg ?? "School admin created successfully.");
    void loadAdmins();
  };

  const normalizeUsersResp = (resData: any) => {
    if (!resData) return [];
    // try several shapes
    const inner = resData.data ?? resData;
    if (Array.isArray(inner)) return inner;
    if (inner && Array.isArray(inner.data)) return inner.data;
    if (inner && Array.isArray(inner.Data)) return inner.Data;
    return [];
  };

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    setAdminsError(null);
    try {
      await fetchAllSchools();
      const collected: any[] = [];
      await Promise.all(
        (schools ?? []).map(async (school) => {
          try {
            const res = await api.get(`/User/school/${school.id}`, { params: { page: 1, limit: 1000 } });
            const users = normalizeUsersResp(res.data);
            users.forEach((u: any) => {
              const role = (u.role ?? u.Role ?? "").toString();
              if (role.toLowerCase().includes("superadmin") || role.toLowerCase().includes("schooladmin")) {
                collected.push({
                  id: u.id ?? u.Id ?? u.userId,
                  fullName: u.fullName ?? u.FullName ?? `${u.firstName ?? ''} ${u.lastName ?? ''}`,
                  email: u.email ?? u.Email,
                  uin: u.uin ?? u.UIN,
                  schoolName: school.name,
                });
              }
            });
          } catch (err) {
            // ignore per-school failure
          }
        })
      );
      setAdmins(collected);
    } catch (err: any) {
      setAdminsError(err?.message || "Failed to load admins");
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    void loadAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredAdmins = admins.filter((a) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (a.fullName || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q) ||
      (a.schoolName || "").toLowerCase().includes(q) ||
      (a.uin || "").toString().toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / pageSize));
  const pagedAdmins = filteredAdmins.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Admins"
        subtitle="Manage school administrator accounts"
        action={
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsModalOpen(true)}>Add</Button>
          </div>
        }
      />

      <div>
        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-sm font-medium text-slate-200">All Admin Users</h3>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => void loadAdmins()} disabled={loadingAdmins}>
              {loadingAdmins ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="w-1/2">
            <Input value={searchQuery} onChange={onSearchChange} placeholder="Search name, email, school or UIN" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Per page:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md bg-surface-900/50 text-sm text-slate-200 px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-surface-700 bg-surface-800/80 p-4">
          {adminsError && <div className="text-red-300">{adminsError}</div>}
          {!loadingAdmins && admins.length === 0 && !adminsError && (
            <p className="text-slate-400">No admin users found.</p>
          )}

          {loadingAdmins && <p className="text-slate-400">Loading admins...</p>}

          {!loadingAdmins && filteredAdmins.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-slate-400">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">School</th>
                    <th className="px-3 py-2">UIN</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedAdmins.map((a) => (
                    <tr key={a.id} className="border-t border-surface-700">
                      <td className="px-3 py-3 text-sm text-slate-200">{a.fullName}</td>
                      <td className="px-3 py-3 text-sm text-slate-400">{a.email}</td>
                      <td className="px-3 py-3 text-sm text-slate-400">{a.schoolName}</td>
                      <td className="px-3 py-3 text-sm text-slate-400">{a.uin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {!loadingAdmins && filteredAdmins.length > 0 && (
            <div className="mt-3 flex items-center justify-end gap-3">
              <div className="text-sm text-slate-400">Page {currentPage} of {totalPages}</div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Prev
                </Button>
                <Button variant="secondary" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={handleCreateSuccess} />
    </div>
  );
};

export default SchoolAdminsManagement;