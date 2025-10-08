"use client";

import { Globe, Monitor, Wifi, CheckCircle, AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false); // ✅ notifikasi login sukses

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));

      // ✅ Munculkan alert login sukses hanya saat pertama kali masuk
      const hasShown = sessionStorage.getItem("loginSuccessShown");
      if (!hasShown) {
        setShowLoginSuccess(true);
        sessionStorage.setItem("loginSuccessShown", "true");

        // ⏱️ Hilangkan otomatis dalam 3 detik
        setTimeout(() => {
          setShowLoginSuccess(false);
        }, 3000);
      }
    }
  }, []);

  const apps = [
    { title: "IPAM", fullName: "IP Address Management", icon: Globe, url: "http://10.5.252.156" },
    { title: "WLC Controller", fullName: "Wireless LAN Controller", icon: Wifi, url: "https://10.5.252.64:8443" },
    { title: "VMware", fullName: "VMware vSphere", icon: Monitor, url: "https://10.5.252.101" },
  ];

  const filteredApps = apps.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("loginSuccessShown"); // reset agar muncul lagi saat login ulang
    window.location.href = "/login";
  };

  return (
    <div className={`relative min-h-screen flex flex-col text-white ${poppins.className}`}>
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

      {/* ✅ Alert Login Sukses */}
      {showLoginSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Login Berhasil!</span>
        </div>
      )}

      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-white/50 text-white">
     <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm hover:text-gray-200 transition">
            <Image
              src="/seatrium.png"
              alt="Seatrium Logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </Link>

          {/* 🟦 Sambutan User */}
          {user && (
            <div className="text-sm md:text-base font-semibold text-white  px-4 py-2 rounded-full shadow-md">
              Selamat Datang, {user.nama} {user.role === "admin" && "(Admin)"} 👋
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-black font-medium">
          <Link href="/profile" className="hover:text-gray-200 transition">
            Profile
          </Link>
          <button onClick={() => setShowLogoutModal(true)} className="hover:text-gray-200 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center py-8 px-4">
        <h1 className="text-4xl md:text-5xl text-black font-bold mb-4 drop-shadow-md">
          IT Infrastructure Dashboard
        </h1>
        <p className="text-black/90 max-w-2xl mx-auto mb-6 text-base md:text-lg font-light">
          Access all company infrastructure applications quickly & easily — manage network, wireless,
          and virtual environments seamlessly in a single portal.
        </p>
      </section>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto mb-10 px-8 text-black">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-800 placeholder-gray-500 backdrop-blur-sm text-sm md:text-base"
        />
      </div>

      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredApps.map((app, index) => (
          <div
            key={index}
            className="cursor-pointer bg-blue-600 text-white p-8 rounded-3xl shadow-lg hover:bg-white hover:text-blue-600 transition transform hover:-translate-y-2 min-h-[250px] flex flex-col justify-center items-center text-center"
            onClick={() => (window.location.href = app.url)}
          >
            <div className="flex justify-center mb-4">
              <app.icon className="w-16 h-16 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{app.title}</h3>
            <div className="text-sm md:text-base text-white/90 hover:text-blue-600 transition-colors">
              {app.fullName}
            </div>
          </div>
        ))}
      </section>

       {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-10 w-96 text-center shadow-xl">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Logout Confirmation</h2>
            <p className="text-gray-600 mb-6 text-base">Are you sure you want to logout from your account?</p>
            <div className="flex justify-between gap-6">
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
      <footer className="mt-auto py-4 text-center text-white text-xs md:text-sm space-y-1 border-t border-white/30">
        <p>IT Infrastructure Dashboard Created by @Clinton Alfaro</p>
        <p>seatrium.com</p>
      </footer>
    </div>
  );
}
