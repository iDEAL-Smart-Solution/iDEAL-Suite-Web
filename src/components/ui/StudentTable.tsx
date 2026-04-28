import type { Student } from "../../types/student";
import BrandLoader from "./BrandLoader";

interface StudentTableProps {
  students: Student[];
  isLoading?: boolean;
}

const StudentTable = ({ students = [], isLoading = false }: StudentTableProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-surface-800 border border-surface-700 rounded-xl shadow-lg overflow-hidden">
      {students.length === 0 && !isLoading ? (
        <div className="px-6 py-12 text-center">
          <p className="text-slate-400 text-lg">No students found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="bg-surface-900 border-b border-surface-700">
                <th className="hidden sm:table-cell text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  School Name
                </th>
                <th className="text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  UIN
                </th>
                <th className="text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  First Name
                </th>
                <th className="text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Last Name
                </th>
                <th className="hidden md:table-cell text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Middle Name
                </th>
                <th className="hidden lg:table-cell text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Gender
                </th>
                <th className="text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Email
                </th>
                <th className="hidden lg:table-cell text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Date of Birth
                </th>
                <th className="text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Class Name
                </th>
                <th className="hidden md:table-cell text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Phone Number
                </th>
                <th className="hidden xl:table-cell text-left px-3 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Source System
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <BrandLoader size="md" />
                      <p className="text-slate-400">Loading students...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr
                    key={`${student.uin}-${index}`}
                    className="hover:bg-surface-700/50 transition-colors duration-200"
                  >
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-sm font-medium text-white">
                      {student.schoolName}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-slate-300">
                      {student.uin}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-slate-300">
                      {student.firstName}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-slate-300">
                      {student.lastName}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm text-slate-300">
                      {student.middleName || "-"}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm text-slate-300">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400">
                        {student.gender}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-slate-300 truncate">
                      {student.email}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm text-slate-300">
                      {formatDate(student.dateOfBirth)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-slate-300">
                      {student.className}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm text-slate-300">
                      {student.phoneNumber}
                    </td>
                    <td className="hidden xl:table-cell px-3 sm:px-6 py-4 text-sm text-slate-300">
                      {student.sourceSystem}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
