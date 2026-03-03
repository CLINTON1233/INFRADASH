"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { API_ENDPOINTS } from "../../config/api";

const AuthContext = createContext();
const SESSION_CHECK_INTERVAL = 60 * 1000; // Cek setiap 1 menit
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 jam

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const router = useRouter();
  const pathname = usePathname();
  const logoutTimerRef = useRef(null);
  const sessionCheckRef = useRef(null);
  const isRedirectingRef = useRef(false); // Untuk mencegah redirect berulang
  const authCheckInProgressRef = useRef(false); // Untuk mencegah multiple auth check

  // Fungsi logout
  const logout = useCallback(async (isSessionExpired = false) => {
    // Cegah logout berulang
    if (isRedirectingRef.current) return;
    isRedirectingRef.current = true;

    try {
      // Panggil endpoint logout di backend
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
      // Reset state
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

      // Redirect to login only if we're not already there (or on other
      // public routes).  When the user is on /login and `checkAuth` calls
      // logout, a full reload would otherwise happen repeatedly, producing the
      // "refresh refresh terus" behaviour described by the user.
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (!["/login", "/register", "/landing-page"].includes(path)) {
          window.location.href = "/login";
        }
      }
    }
  }, []);

  const checkAuth = useCallback(async () => {
    // If we're on a public route, there's no need to validate the session.  This
    // prevents the login/register page from continuously calling `logout()` and
    // reloading the page over and over when the user is not authenticated.
    const publicRoutes = ["/landing-page", "/login", "/register"];
    if (publicRoutes.includes(pathname)) {
      // make sure we aren't stuck in a loading state when arriving on these
      // routes from elsewhere
      setLoading(false);
      return;
    }

    // Cegah multiple auth check bersamaan
    if (authCheckInProgressRef.current) return;

    // Jika sedang redirect, jangan lakukan apa-apa
    if (isRedirectingRef.current) return;

    try {
      authCheckInProgressRef.current = true;

      // jika pengguna offline
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.warn('Offline: skip auth check');
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.CHECK_SESSION, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      // Handle response
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('Session expired');
          // Langsung logout tanpa menunggu
          await logout();
          return;
        }

        // Untuk error lain, jangan logout, hanya reset user
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return;
      }

      const data = await response.json();

      if (data.authenticated && data.user) {
        // Cek apakah user berbeda dari sebelumnya
        const currentUserJson = JSON.stringify(user);
        const newUserJson = JSON.stringify(data.user);

        if (currentUserJson !== newUserJson) {
          setUser(data.user);
        }

        setLastActivity(Date.now());
        localStorage.setItem("user", JSON.stringify(data.user));

        // Reset timer logout
        resetLogoutTimer();
      } else {
        // Jika tidak authenticated, logout
        await logout();
      }
    } catch (error) {
      // Untuk network error, jangan logout
      if (
        error instanceof Error &&
        error.name === 'TypeError' &&
        error.message.includes('Failed to fetch')
      ) {
        console.debug('Auth check skipped, network failure');
        return;
      } else {
        console.error("Error checking auth:", error);
        // Untuk error lain, jangan langsung logout, hanya reset user
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
      authCheckInProgressRef.current = false;
    }
  }, [logout, user, pathname]);

  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    // Set timer untuk logout otomatis
    logoutTimerRef.current = setTimeout(() => {
      console.log('Session timeout reached');
      logout();
    }, SESSION_TIMEOUT);
  }, [logout]);

  // Setup effect
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (mounted) {
        await checkAuth();
      }
    };

    initAuth();

    // Setup activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const updateActivity = () => {
      if (!isRedirectingRef.current) {
        setLastActivity(Date.now());
        resetLogoutTimer();
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Session check interval
    sessionCheckRef.current = setInterval(() => {
      if (!isRedirectingRef.current) {
        checkAuth();
      }
    }, SESSION_CHECK_INTERVAL);

    // Initial timer
    resetLogoutTimer();

    return () => {
      mounted = false;
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      if (sessionCheckRef.current) {
        clearInterval(sessionCheckRef.current);
      }
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [checkAuth, resetLogoutTimer]);

  // Route protection effect
  useEffect(() => {
    if (loading || isRedirectingRef.current) return;

    const publicRoutes = ["/landing-page", "/login", "/register"];

    // Cek apakah perlu redirect
    const needsRedirect = () => {
      // Jika tidak ada user dan bukan public route
      if (!user && !publicRoutes.includes(pathname)) {
        return true;
      }

      // Jika user ada dan mencoba akses login/register
      if (user && (pathname === "/login" || pathname === "/register")) {
        return true;
      }

      return false;
    };

    if (needsRedirect()) {
      // Cegah redirect berulang
      if (isRedirectingRef.current) return;
      isRedirectingRef.current = true;

      if (!user) {
        // Redirect ke login
        window.location.href = "/login";
      } else {
        // Redirect berdasarkan role
        let redirectPath = "/dashboard";
        if (user.role === "superadmin") {
          redirectPath = "/superadmin/dashboard";
        } else if (user.role === "admin") {
          redirectPath = "/admin/dashboard";
        }
        window.location.href = redirectPath;
      }
    }
  }, [pathname, loading, user]);

  const login = async (userData) => {
    setUser(userData);
    setLastActivity(Date.now());
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    // Reset timer setelah login
    resetLogoutTimer();

    // Reset flag redirect
    isRedirectingRef.current = false;
  };

  const value = {
    user,
    login,
    logout: () => logout(),
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