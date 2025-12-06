import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import * as authApi from "../services/auth/authApi";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContextDefinition";

export interface AuthContextProps {
  user: authApi.User | null;
  isAuth: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (data: authApi.LoginData) => Promise<authApi.ApiResponse>;
  register: (data: authApi.RegisterData) => Promise<authApi.ApiResponse>;
  logout: () => Promise<authApi.ApiResponse>;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<authApi.User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifySession = useCallback(async () => {
    try {
      const res = await authApi.checkAuth();
      console.log("res:", res);
      if (res.isAuthenticated) {
        const userRes = await authApi.getCurrentUser();
        console.log("user-getC:", res.user);
        if (userRes.success && (userRes.user?.rolInt === 2 || userRes.user?.rolInt === '2')) {
          setUser(userRes.user || null);
          setIsAuth(true);
          setIsAdmin(true);
        } else {
          // If user is not admin, clear auth state
          console.log("User is not admin", userRes.user?.rolInt);
          await authApi.logout();
          setIsAuth(false);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setIsAuth(false);
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error verificando sesión:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const handleLogin = async (data: authApi.LoginData) => {
    const res = await authApi.login(data);
    if (res.success && (res.user?.rolInt === 2 || res.user?.rolInt === '2')) {
      setUser(res.user || null);
      setIsAuth(true);
      setIsAdmin(true);
    } else if (res.success) {
      // If login successful but not admin, log them out
      await authApi.logout();
      return { ...res, success: false, message: 'Acceso denegado. Se requiere rol de administrador.' };
    }
    return res;
  };

  const handleRegister = async (data: authApi.RegisterData) => {
    // Force rolInt to be 2 (admin) for all registrations
    const res = await authApi.register({ ...data, rolInt: 2 });
    if (res.success) {
      setUser(res.user || null);
      setIsAuth(true);
      setIsAdmin(true);
    }
    return res;
  };

  const handleLogout = async () => {
    const res = await authApi.logout();
    setUser(null);
    setIsAuth(false);
    setIsAdmin(false);
    return res;
  };

  const value: AuthContextProps = {
    user,
    isAuth,
    isAdmin,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser: verifySession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
