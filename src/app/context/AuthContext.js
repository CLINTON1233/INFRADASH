"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { API_ENDPOINTS } from "../../config/api";

const AuthContext = createContext();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 menit dalam milidetik
const SESSION_CHECK_INTERVAL = 60 * 1000; // Cek setiap 1 menit

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();

    // Setup activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const updateActivity = () => setLastActivity(Date.now());

    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Session timeout checker
    const sessionInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        console.log('Session timeout due to inactivity');
        logout();
      }
    }, SESSION_CHECK_INTERVAL);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(sessionInterval);
    };
  }, [lastActivity]);

  useEffect(() => {
    if (!loading) {
      checkRouteAccess();
    }
  }, [pathname, loading]);

  const checkAuth = async () => {
    try {
      // Cek session ke backend menggunakan API_ENDPOINTS
      const response = await fetch(API_ENDPOINTS.CHECK_SESSION, {
        credentials: 'include', // Penting: untuk mengirim cookie
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        setLastActivity(Date.now());

        // Update localStorage sebagai fallback
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkRouteAccess = () => {
    const publicRoutes = ["/landing-page", "/login", "/register"];

    if (loading) return;

    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/login");
      return;
    }

    if (user && (pathname === "/login" || pathname === "/register")) {
      redirectBasedOnRole();
    }
  };

  const redirectBasedOnRole = () => {
    if (!user) return;

    if (user.role === "superadmin") {
      router.push("/superadmin/dashboard");
    } else if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const login = async (userData) => {
    setUser(userData);
    setLastActivity(Date.now());

    // Simpan di localStorage untuk fallback
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  const logout = async () => {
    try {
      // Panggil endpoint logout di backend menggunakan API_ENDPOINTS
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("loginSuccessShown");

      // Hapus semua cookie client-side
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=; expires=" + new Date().toUTCString() + "; path=/");
      });

      router.push("/login");
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};