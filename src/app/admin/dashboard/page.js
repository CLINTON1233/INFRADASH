"use client";

import {
  Globe,
  Monitor,
  Wifi,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import * as LucideIcons from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [appsList, setAppsList] = useState([]); // ✅ Ambil dari API

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));

      const hasShown = sessionStorage.getItem("loginSuccessShown");
      if (!hasShown) {
        setShowLoginSuccess(true);
        sessionStorage.setItem("loginSuccessShown", "true");

        setTimeout(() => {
          setShowLoginSuccess(false);
        }, 3000);
      }
    }
  }, []);

  // ✅ Fetch aplikasi dari API yang sama dengan superadmin
  useEffect(() => {
    fetch("http://localhost:4000/applications")
      .then((res) => res.json())
      .then(setAppsList)
      .catch(console.error);
  }, []);

  // ✅ Fungsi untuk resolve icon dari Lucide atau fallback ke Globe
  const resolveIcon = (iconName) => {
    if (!iconName) return LucideIcons.Globe;
    const formattedName = iconName
      .replace(/\s+/g, "")
      .replace(/-/g, "")
      .replace(/\./g, "");
    return LucideIcons[formattedName] || LucideIcons.Globe;
  };

  const filteredApps = appsList.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("loginSuccessShown");
    window.location.href = "/login";
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col text-white ${poppins.className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg_seatrium 3.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Alert Login Sukses */}
      {showLoginSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Login SLuccessfully!</span>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-b border-white/50 text-white gap-4 sm:gap-0">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm hover:text-gray-200 transition"
          >
            <Image
              src="/seatrium.png"
              alt="Seatrium Logo"
              width={130}
              height={130}
              className="object-contain"
            />
          </Link>

          {user && (
            <div className="text-sm md:text-base font-grey-700 text-white px-4 py-2 rounded-full shadow-md truncate max-w-[150px] sm:max-w-xs">
              Welcome, {user.nama}  👋
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-black font-medium w-full sm:w-auto justify-between sm:justify-start">
          <Link
            href="/admin/dashboard"
            className="hover:text-gray-200 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/profile"
            className="hover:text-gray-200 transition"
          >
            Profile
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="hover:text-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center py-6 px-4 sm:py-10 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-4xl font-medium text-black mb-4 drop-shadow-md">
          IT Infrastructure Dashboard
        </h1>
        <p className="text-black/90 max-w-2xl mx-auto mb-6 text-sm sm:text-base md:text-lg font-light">
          Access all company infrastructure applications quickly & easily —
          manage network, wireless, and virtual environments seamlessly in a
          single portal.
        </p>
      </section>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-10 px-4 sm:px-8">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
      </div>

      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredApps.map((app, index) => {
          const Icon = resolveIcon(app.icon);

          return (
            <div
              key={index}
              className="cursor-pointer bg-blue-600 text-white p-6 sm:p-8 rounded-2xl shadow-lg
                 transform transition-all duration-300 hover:bg-white hover:text-blue-600
                 hover:-translate-y-2 h-[220px] sm:h-[250px] flex flex-col justify-center items-center text-center"
              onClick={() => (window.location.href = app.url)}
            >
              <div className="flex justify-center mb-4">
                <Icon className="w-16 h-16 sm:w-20 sm:h-20 transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate max-w-[180px] sm:max-w-[200px]">
                {app.title}
              </h3>
              <div className="text-xs sm:text-sm md:text-base truncate max-w-[180px] sm:max-w-[200px]">
                {app.fullName}
              </div>
            </div>
          );
        })}
      </section>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 sm:p-10 w-full sm:max-w-md shadow-2xl animate-fade-in relative text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-16 h-16 text-yellow-500" />
            </div>

            <h2 className="text-2xl font-medium mb-2 text-gray-800">
              Logout Confirmation
            </h2>

            <p className="text-gray-700 mb-6 text-base">
              Are you sure you want to logout from your account?
            </p>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition text-base font-grey-500"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-base font-grey-500"
              >
                <CheckCircle className="w-5 h-5" />
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-white text-xs sm:text-sm space-y-1 border-t border-white/30 px-4 sm:px-6">
        <p>IT Infrastructure Dashboard Created by @Clinton Alfaro</p>
        <p>seatrium.com</p>
      </footer>
    </div>
  );
}