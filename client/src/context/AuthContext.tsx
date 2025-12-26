import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { User, AuthState, UserRole } from "../data/types";
import { apiService } from "../services/apiService";
import { toast } from "sonner";

interface AuthContextType {
  authState: AuthState;
  login: (
    email: string,
    password: string,
    role: UserRole,
    secretCode?: string
  ) => Promise<void>;
  signup: (
    email: string,
    fullName: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // keep axios interceptor in sync (it reads "token")
        localStorage.setItem("token", token);

        setAuthState({
          user: JSON.parse(storedUser),
          accessToken: token,
          refreshToken: localStorage.getItem("refreshToken"),
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };
    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole,
    _secretCode?: string
  ) => {
    const response = await apiService.login(email, password);
    const { token, user } = response;

    const normalize = (raw: any) => ({
      id: String(raw.id),
      email: raw.email,
      fullName: raw.full_name ?? raw.fullName ?? "",
      role: raw.role,
      isActive: raw.is_active ?? raw.isActive ?? true,
      avatarUrl: raw.avatar_url ?? raw.avatarUrl ?? null,
      createdAt: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
      points: raw.points ?? 0,
      badges: raw.badges ?? [],
      skills: raw.skills ?? {},
    });

    const normalizedUser = normalize(user);

    // store token under BOTH keys: "accessToken" (your state) and "token" (axios)
    localStorage.setItem("accessToken", token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setAuthState({
      user: normalizedUser,
      accessToken: token,
      refreshToken: (response as any).refreshToken || null,
      isAuthenticated: true,
      loading: false,
    });

    if (user.role === UserRole.ADMIN) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const signup = async (
    email: string,
    fullName: string,
    password: string,
    role: UserRole
  ) => {
    try {
      await apiService.signup(email, fullName, password, role);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      let msg = "Signup failed";
      if (Array.isArray(detail)) {
        msg = detail
          .map((d: any) => (d?.msg ? d.msg : JSON.stringify(d)))
          .join("; ");
      } else if (typeof detail === "string") {
        msg = detail;
      } else if (typeof detail === "object" && detail !== null) {
        msg = JSON.stringify(detail);
      } else if (error?.message) {
        msg = error.message;
      }
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token"); // clear interceptor token too
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
    });
    navigate("/login");
  };

  const updateUser = (user: User) => {
    const raw = user as any;
    const normalized = {
      id: String(raw.id),
      email: raw.email,
      fullName: raw.full_name ?? raw.fullName ?? "",
      role: raw.role,
      isActive: raw.is_active ?? raw.isActive ?? true,
      avatarUrl: raw.avatar_url ?? raw.avatarUrl ?? null,
      department: raw.department ?? raw.department,
      createdAt: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
      points: raw.points ?? 0,
      badges: raw.badges ?? [],
      skills: raw.skills ?? {},
    } as User;
    localStorage.setItem("user", JSON.stringify(normalized));
    setAuthState((prev) => ({ ...prev, user: normalized }));
  };

  return (
    <AuthContext.Provider
      value={{ authState, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
