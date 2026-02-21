import React from "react";
import { cn } from "../../lib/utils";
import type { UserRoleType } from "../../types/user";
import { UserRole } from "../../types/user";

interface FilterTabsProps {
  counts: {
    all: number;
    staff: number;
    students: number;
    admins: number;
  };
  activeFilter: UserRoleType | "all";
  onFilterChange: (filter: UserRoleType | "all") => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  counts,
  activeFilter,
  onFilterChange,
}) => {
  const filters = [
    { label: "All Users", value: "all" as const, count: counts.all },
    { label: "Staff", value: UserRole.Staff, count: counts.staff },
    { label: "Students", value: UserRole.Student, count: counts.students },
    { label: "Admins", value: UserRole.SuperAdmin, count: counts.admins },
  ];

  return (
    <div className="flex gap-3 mb-6 border-b border-surface-700 overflow-x-auto">
      {filters.map((filter) => (
        <button
          key={filter.value === "all" ? "all" : filter.value}
          className={cn(
            "px-4 py-3 font-semibold transition-colors duration-200 whitespace-nowrap border-b-2",
            activeFilter === filter.value
              ? "border-brand-400 text-brand-400"
              : "border-transparent text-slate-400 hover:text-white"
          )}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
          <span className="ml-2 text-xs bg-surface-700 text-slate-300 px-2 py-1 rounded-full">
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
