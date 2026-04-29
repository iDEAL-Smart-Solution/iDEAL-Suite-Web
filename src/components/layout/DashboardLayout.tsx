import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Container from "./Container";
import { cn } from "../../lib/utils";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isTabletSidebarCollapsed, setIsTabletSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((s) => !s);
      return;
    }
    if (window.innerWidth < 1024) {
      setIsTabletSidebarCollapsed((s) => !s);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-950 overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        isCollapsed={isTabletSidebarCollapsed}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isTabletSidebarCollapsed ? "md:pl-20" : "md:pl-64",
          "lg:pl-64"
        )}
      >
        {/* Topbar */}
        <Topbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isTabletSidebarCollapsed}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto mt-16 bg-surface-950">
          <Container className="p-4 md:p-6">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
