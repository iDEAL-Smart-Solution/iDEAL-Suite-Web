import { createContext, useContext, useState } from "react";
import { getUser, login as loginService, logout as logoutService } from "../services/auth.service";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  demoLogin: () => void;
  demoLoginAsDev: () => void;
  demoLoginAsStaff: () => void;
  demoLoginAsStudent: () => void;
  demoCreateAdmin: (schoolId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const res = await loginService({ email, password });
    setUser(res.user);
  };

  const demoLogin = () => {
    const demoUser = {
      userId: "demo-user-001",
      firstName: "Demo",
      lastName: "Admin",
      role: 1,
      email: "demo@ideal-suite.com",
      schoolId: "demo-school-001",
      schoolName: "Demo Academy",
    };

    localStorage.setItem("ideal_token", "demo-token");
    localStorage.setItem("ideal_user", JSON.stringify(demoUser));

    setUser(demoUser);
    setToken("demo-token");
  };

  const demoLoginAsDev = () => {
    const demoDevUser = {
      userId: "dev-admin-001",
      firstName: "Platform",
      lastName: "Admin",
      role: 0, // Dev/Platform admin role
      email: "dev@ideal-suite.com",
      name: "Platform Admin",
    };

    localStorage.setItem("ideal_token", "dev-demo-token");
    localStorage.setItem("ideal_user", JSON.stringify(demoDevUser));

    setUser(demoDevUser);
    setToken("dev-demo-token");
  };

  const demoLoginAsStaff = () => {
    const demoStaffUser = {
      userId: "demo-staff-002",
      firstName: "Demo",
      lastName: "Staff",
      role: 2,
      email: "demo-staff@ideal-suite.com",
      schoolId: "demo-school-001",
      schoolName: "Demo Academy",
    };

    localStorage.setItem("ideal_token", "demo-token");
    localStorage.setItem("ideal_user", JSON.stringify(demoStaffUser));

    setUser(demoStaffUser);
    setToken("demo-token");
  };

  const demoLoginAsStudent = () => {
    const demoStudentUser = {
      userId: "demo-student-003",
      firstName: "Demo",
      lastName: "Student",
      role: 3,
      email: "demo-student@ideal-suite.com",
      schoolId: "demo-school-001",
      schoolName: "Demo Academy",
    };

    localStorage.setItem("ideal_token", "demo-token");
    localStorage.setItem("ideal_user", JSON.stringify(demoStudentUser));

    setUser(demoStudentUser);
    setToken("demo-token");
  };

  const demoCreateAdmin = async (schoolId: string) => {
    const demoAdminUser = {
      role: 1,
      name: "Demo Principal",
      email: "demo-principal@ideal-suite.com",
      schoolId,
    };

    localStorage.setItem("ideal_token", "demo-token");
    localStorage.setItem("ideal_user", JSON.stringify(demoAdminUser));

    setUser(demoAdminUser);
    setToken("demo-token");
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        demoLogin,
        demoLoginAsDev,
        demoCreateAdmin,
        demoLoginAsStaff,
        demoLoginAsStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
