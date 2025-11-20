// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { message } from "antd";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "asha_worker" | "volunteer" | "healthcare_worker" | "district_health_official" | "government_body" | "community_user";
  avatar?: string;
  organization?: string;
  location?: string;
  phone?: string;
  permissions?: string[];
  district?: string;
  village?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  authHeaders: () => Record<string, string>;
  fetchProfile: () => Promise<User | null>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: User["role"];
  organization?: string;
  location?: string;
  phone?: string;
  district?: string;
  village?: string;
  specialization?: string;
  confirmPassword?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

interface AuthResponseUser {
  id?: string;
  full_name?: string;
  email?: string;
  role?: string;
  organization?: string;
  location?: string;
  phone?: string;
  created_at?: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem("paanicare-user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // helper to build auth headers
  const authHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("paanicare-token");
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
  };

  // centralized profile fetch
  const fetchProfile = async (): Promise<User | null> => {
    const token = localStorage.getItem("paanicare-token");
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: authHeaders()
      });
      if (!res.ok) {
        // token invalid or endpoint not available
        return null;
      }
      const profile = await res.json();
      const mapped = mapBackendUserToClient(profile);
      // persist
      setUser(mapped);
      localStorage.setItem("paanicare-user", JSON.stringify(mapped));
      return mapped;
    } catch (err) {
      console.warn("fetchProfile error:", err);
      return null;
    }
  };

  // on mount: if token exists but user missing, try to fetch /api/auth/me
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("paanicare-token");
      const stored = localStorage.getItem("paanicare-user");
      if (token && !stored) {
        setIsLoading(true);
        const prof = await fetchProfile();
        if (!prof) {
          // cleanup invalid token
          saveUserAndToken(null, null);
        }
        setIsLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveUserAndToken = (u: User | null, token?: string | null) => {
    if (u) {
      setUser(u);
      localStorage.setItem("paanicare-user", JSON.stringify(u));
    } else {
      setUser(null);
      localStorage.removeItem("paanicare-user");
    }
    if (token) {
      localStorage.setItem("paanicare-token", token);
    } else if (token === null) {
      // explicit clear
      localStorage.removeItem("paanicare-token");
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        message.error(err.detail || "Login failed");
        return false;
      }

      const data = await res.json();
      const token = data.access_token || data.token;
      if (!token) {
        message.error("No token returned by server");
        return false;
      }

      // store token immediately so next requests can use it
      localStorage.setItem("paanicare-token", token);

      // If backend returns user info, use it; otherwise try to fetch /api/auth/me
      let storedUser: User | null = null;
      if (data.user) {
        storedUser = mapBackendUserToClient(data.user);
      } else {
        // try to fetch profile using saved token
        storedUser = await fetchProfile();
      }

      // fallback minimal user if profile missing
      if (!storedUser) {
        storedUser = {
          id: Date.now().toString(),
          email,
          name: email.split("@")[0],
          role: "community_user",
        };
      }

      saveUserAndToken(storedUser, token);
      message.success("Logged in");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Map frontend fields to backend expected fields
      const body = {
        full_name: userData.name,
        email: userData.email,
        role: userData.role,
        password: userData.password,
        confirm_password: userData.confirmPassword ?? userData.password,
        organization: userData.organization ?? null,
        location: userData.location ?? null,
        phone: userData.phone ?? null,
      };

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        message.error(errBody.detail || "Registration failed");
        return false;
      }

      // backend returns created user object (likely no token)
      const created: AuthResponseUser = await res.json();

      // Try auto-login: call login endpoint to get token (if implemented)
      let token: string | null = null;
      try {
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email, password: userData.password }),
        });
        if (loginRes.ok) {
          const loginJson = await loginRes.json();
          token = loginJson.access_token || loginJson.token || null;
        }
      } catch {
        // ignore login failure; some backends do not auto-provide login on register
      }

      // Build client-side user object from backend response
      const clientUser: User = {
        id: (created as any).id || (created as any)._id || Date.now().toString(),
        email: created.email || userData.email,
        name: (created as any).full_name || userData.name,
        role: (created as any).role || userData.role,
        organization: (created as any).organization || userData.organization,
        location: (created as any).location || userData.location,
        phone: (created as any).phone || userData.phone,
      };

      saveUserAndToken(clientUser, token ?? null);

      message.success("Registration successful");
      return true;
    } catch (error) {
      console.error("Register error:", error);
      message.error("Registration failed. Try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    saveUserAndToken(null, null);
    message.info("Logged out");
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    try {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem("paanicare-user", JSON.stringify(updated));
      message.success("Profile updated");
      return true;
    } catch (error) {
      message.error("Update failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const mapBackendUserToClient = (b: any): User => {
    return {
      id: b.id || b._id || String((b as any)?._id ?? Date.now()),
      email: b.email || "",
      name: b.full_name || b.name || (b.email ? b.email.split("@")[0] : "user"),
      role: (b.role as User["role"]) || "community_user",
      organization: b.organization,
      location: b.location,
      phone: b.phone,
    };
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    authHeaders,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
