"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Check authentication on route change
    if (!loading) {
      checkRouteAccess();
    }
  }, [pathname, loading]);

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const checkRouteAccess = () => {
    // Routes yang boleh diakses tanpa login
    const publicRoutes = [ '/landing-page', '/login', '/register',];
    
    if (loading) return;

    // Jika user belum login dan mencoba akses protected route
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/login');
      return;
    }

    // Jika user sudah login tapi mencoba akses login/register
    if (user && (pathname === '/login' || pathname === '/register')) {
      redirectBasedOnRole();
      return;
    }

    // Check role-based access
    if (user && !checkRoleAccess(pathname, user.role)) {
      // Redirect ke dashboard sesuai role
      redirectBasedOnRole();
    }
  };

  const checkRoleAccess = (path, userRole) => {
    // Superadmin bisa akses semua routes
    if (userRole === 'superadmin') return true;

    // Admin tidak bisa akses superadmin routes
    if (userRole === 'admin' && path.startsWith('/superadmin')) {
      return false;
    }

    // User biasa hanya bisa akses /dashboard
    if (userRole === 'user' && !path.startsWith('/dashboard')) {
      return false;
    }

    return true;
  };

  const redirectBasedOnRole = () => {
    if (!user) return;

    if (user.role === 'superadmin') {
      router.push('/superadmin/dashboard');
    } else if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    
  };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem('user');
  //   sessionStorage.removeItem('loginSuccessShown');
  //   router.push('/login');
  // };

// const logout = () => {
//   setUser(null);
//   localStorage.removeItem('user');
//   sessionStorage.removeItem('loginSuccessShown');

//   // Hapus cookie di SEMUA domain & port yang relevan
//   const domains = [
//     '',                    // current domain
//     'localhost',
//     '127.0.0.1',
//     'localhost:3000',
//     'localhost:3001',
//     '127.0.0.1:3000',
//     '127.0.0.1:3001',
//   ];

//   domains.forEach(domain => {
//     document.cookie = `portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain};`;
//     document.cookie = `portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}; Secure;`;
//     document.cookie = `portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}; SameSite=None; Secure;`;
//   });

//   // Force clear dari semua subdomain
//   document.cookie = 'portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  
//   router.push('/login');
// };

const logout = async () => {
  setUser(null);
  localStorage.removeItem('user');
  sessionStorage.removeItem('loginSuccessShown');

  // Hapus cookie di SEMUA port yang relevan (3000, 3001, 4000)
  const ports = [3000, 3001, 4000];
  const baseUrl = window.location.origin.split(':').slice(0, 2).join(':'); // http://localhost

  ports.forEach(port => {
    // Hapus cookie dengan meng-set expired di masa lalu
    document.cookie = `portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost; port=${port}`;
    document.cookie = `portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost`;
    document.cookie = `portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  });

  // Tetap panggil backend logout (untuk clear di server juga)
  try {
    await fetch('http://localhost:4000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Logout backend gagal:', err);
  }

  router.push('/login');
};

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};