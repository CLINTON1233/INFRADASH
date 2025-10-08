"use client";

import {
  Globe,
  Monitor,
  Wifi,
  CheckCircle,
  AlertTriangle,
  X,
  MoreVertical,
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
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({
    title: "",
    fullName: "",
    url: "",
    icon: "",
  });
  const [appsList, setAppsList] = useState([]);

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

  useEffect(() => {
    fetch("http://localhost:4000/applications")
      .then((res) => res.json())
      .then(setAppsList)
      .catch(console.error);
  }, []);

  const resolveIcon = (iconName) => {
    if (!iconName) return LucideIcons.Globe; // default icon
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
    <div className={`relative min-h-screen flex flex-col text-white ${poppins.className}`}>
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image src="/bg_seatrium 3.png" alt="Background" fill className="object-cover" priority />
      </div>

      {/* Alert Login Sukses */}
      {showLoginSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Login Berhasil!</span>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-b border-white/50 text-white gap-4 sm:gap-0">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <Link href="/" className="flex items-center gap-2 text-sm hover:text-gray-200 transition">
            <Image src="/seatrium.png" alt="Seatrium Logo" width={120} height={120} className="object-contain" />
          </Link>

          {user && (
            <div className="text-sm md:text-base font-semibold text-white px-4 py-2 rounded-full shadow-md truncate max-w-[150px] sm:max-w-xs">
              Welcome, {user.nama} {user.role === "admin" && "(Admin)"} 👋
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {user?.role === "superadmin" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700 w-full sm:w-auto"
            >
              + Add Application
            </button>
          )}
          <div className="flex items-center gap-4 text-sm text-black font-medium w-full sm:w-auto justify-between sm:justify-start">
            <Link href="/profile" className="hover:text-gray-200 transition w-full sm:w-auto text-center sm:text-left">
              Profile
            </Link>
            <button onClick={() => setShowLogoutModal(true)} className="hover:text-gray-200 transition w-full sm:w-auto text-center sm:text-left">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center py-6 px-4 sm:py-10 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 drop-shadow-md">
          IT Infrastructure Dashboard
        </h1>
        <p className="text-black/90 max-w-2xl mx-auto mb-6 text-sm sm:text-base md:text-lg font-light">
          Access all company infrastructure applications quickly & easily — manage network, wireless, and virtual environments seamlessly in a single portal.
        </p>
      </section>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-10 px-4 sm:px-8 w-full">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-4 sm:px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
      </div>

      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredApps.map((app, index) => {
          const Icon = resolveIcon(app.icon);

          return (
            <div
              key={index}
              className="relative cursor-pointer bg-blue-600 text-white p-6 sm:p-8 rounded-2xl shadow-lg hover:bg-white hover:text-blue-600 transition transform hover:-translate-y-2 h-[220px] sm:h-[250px] flex flex-col justify-center items-center text-center"
            >
              <div className="flex justify-center mb-4">
                <Icon className="w-16 h-16 sm:w-20 sm:h-20 transition-colors duration-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 truncate max-w-[180px] sm:max-w-[200px]">
                {app.title}
              </h3>
              <div className="text-xs sm:text-sm md:text-base text-white/90 hover:text-blue-600 transition-colors truncate max-w-[180px] sm:max-w-[200px]">
                {app.fullName}
              </div>

              {/* Menu button (three dots) */}
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // stop bubbling to card
                    setOpenMenuIndex(openMenuIndex === index ? null : index);
                  }}
                  className="p-1 rounded-full hover:bg-white/20 transition"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {openMenuIndex === index && (
                  <div className="absolute bottom-10 right-0 bg-white text-gray-800 rounded-lg shadow-lg w-32 z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Edit ${app.title}`);
                        setOpenMenuIndex(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete ${app.title}?`)) {
                          await fetch(`http://localhost:4000/applications/${app.id}`, { method: "DELETE" });
                          const updated = await fetch("http://localhost:4000/applications").then((r) => r.json());
                          setAppsList(updated);
                        }
                        setOpenMenuIndex(null);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Click area for card navigation */}
              <div
                className="absolute inset-0 z-0"
                onClick={() => {
                  if (openMenuIndex !== index) {
                    window.location.href = app.url;
                  }
                }}
              />
            </div>
          );
        })}
      </section>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full sm:max-w-xl p-6 sm:p-10 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
              Add New Application
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. IPAM"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newApp.title}
                  onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. IP Address Management"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newApp.fullName}
                  onChange={(e) => setNewApp({ ...newApp, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">URL</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newApp.url}
                  onChange={(e) => setNewApp({ ...newApp, url: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Icon</label>
                <input
                  type="text"
                  placeholder="Globe, Wifi, Monitor..."
                  className="w-full px-4 py-3 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newApp.icon}
                  onChange={(e) => setNewApp({ ...newApp, icon: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gunakan nama ikon dari lucide-react (contoh: Globe, Wifi, Monitor)
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-3 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition font-medium w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const res = await fetch("http://localhost:4000/applications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newApp),
                  });
                  if (res.ok) {
                    setShowAddModal(false);
                    setNewApp({ title: "", fullName: "", url: "", icon: "" });
                    const updated = await fetch("http://localhost:4000/applications").then((r) => r.json());
                    setAppsList(updated);
                  }
                }}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold w-full sm:w-auto"
              >
                Save Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 sm:p-10 w-full sm:max-w-md text-center shadow-xl">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Logout Confirmation</h2>
            <p className="text-gray-600 mb-6 text-base">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-base"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base"
              >
                <CheckCircle className="w-5 h-5" />
                Yes
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
