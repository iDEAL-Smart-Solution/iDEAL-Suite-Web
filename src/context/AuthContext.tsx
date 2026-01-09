import { createContext, useContext, useState } from "react";
import { getUser, login as loginService, logout as logoutService } from "../services/auth.service";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  demoLogin: () => void;
  demoRegisterSchool: () => { schoolId: string };
  demoCreateAdmin: (schoolId: string) => void;
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
      role: 1,
      name: "Demo Admin",
      email: "demo@ideal-suite.com",
    };

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify(demoUser));

    setUser(demoUser);
    setToken("demo-token");
  };

  const demoRegisterSchool = () => {
    const demoSchool = {
      schoolId: "demo-school-001",
      name: "Demo Academy",
      email: "demo-school@ideal-suite.com",
    };

    localStorage.setItem("demoSchool", JSON.stringify(demoSchool));
    return { schoolId: demoSchool.schoolId };
  };

  const demoCreateAdmin = (schoolId: string) => {
    const demoAdminUser = {
      role: 1,
      name: "Demo Principal",
      email: "demo-principal@ideal-suite.com",
      schoolId,
    };

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify(demoAdminUser));

    setUser(demoAdminUser);
    setToken("demo-token");
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        demoLogin,
        demoRegisterSchool,
        demoCreateAdmin,
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
