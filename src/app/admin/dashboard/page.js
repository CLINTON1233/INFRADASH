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
import Swal from "sweetalert2";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [appsList, setAppsList] = useState([]);
  const [groupedApps, setGroupedApps] = useState({});

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
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    fetch("http://localhost:4000/applications")
      .then((res) => res.json())
      .then((data) => {
        setAppsList(data);
        // Group applications by category
        const grouped = groupAppsByCategory(data);
        setGroupedApps(grouped);
      })
      .catch(console.error);
  };
const groupAppsByCategory = (apps) => {
  const grouped = {};
  apps.forEach((app) => {
    // SEKARANG: app.category adalah object, jadi ambil app.category.name
    const categoryName = app.category?.name || "Uncategorized";
    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }
    grouped[categoryName].push(app);
  });
  return grouped;
};
  const AppIcon = ({
    iconName,
     className = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-colors duration-300",
  }) => {
    if (!iconName) {
      const GlobeIcon = LucideIcons.Globe;
      return <GlobeIcon className={className} />;
    }

    // Cek jika ini uploaded file
    if (
      iconName.startsWith("icon-") &&
      /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(iconName)
    ) {
      return (
        <img
          src={`http://localhost:4000/uploads/${iconName}`}
          alt="Application Icon"
          className={className}
          onError={(e) => {
            console.log("Failed to load icon image, using fallback");
            // Fallback ke Globe icon
            const GlobeIcon = LucideIcons.Globe;
            // Untuk komponen functional, kita perlu handle ini dengan state
            // Tapi untuk sementara kita biarkan console log saja
          }}
        />
      );
    }

    // Gunakan Lucide icon
    const formattedName = iconName
      .replace(/\s+/g, "")
      .replace(/-/g, "")
      .replace(/\./g, "");
    const IconComponent = LucideIcons[formattedName] || LucideIcons.Globe;

    return <IconComponent className={className} />;
  };

  // Filter applications based on search query
  const filteredGroupedApps = Object.keys(groupedApps).reduce(
    (acc, category) => {
      const filteredApps = groupedApps[category].filter(
        (app) =>
          app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredApps.length > 0) {
        acc[category] = filteredApps;
      }

      return acc;
    },
    {}
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute requiredRole="admin">
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
          <div className="fixed top-4 right-4 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in z-50">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Login successfully!</span>
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
                width={150}
                height={150}
                className="object-contain"
              />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-4 text-sm text-black font-medium w-full sm:w-auto justify-between sm:justify-start">
              <Link
                href="/admin/dashboard"
                className="hover:text-gray-200 transition w-full sm:w-auto text-center sm:text-left"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/applications"
                className="hover:text-gray-200 transition w-full sm:w-auto text-center sm:text-left"
              >
                Applications
              </Link>
              <Link
                href="/admin/profile"
                className="hover:text-gray-200 transition w-full sm:w-auto text-center sm:text-left"
              >
                Profile
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="hover:text-gray-200 transition w-full sm:w-auto text-center sm:text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center py-6 px-4 sm:py-10 sm:px-6">
          <div className="text-center mt-0">
            {/* Logo Row */}
            <div className="flex items-center justify-center gap-3">
              {/* <Globe className="w-12 h-12 text-blue-500" /> */}
              <h1 className="text-3xl sm:text-3xl md:text-4xl font-semibold leading-tight">
                <span className="text-gray-900">IT Infrastructure</span>{" "}
                <span className="text-sky-500">Dashboard</span>
              </h1>
            </div>

            {/* Subtitle */}
            {/* <p className="text-sm sm:text-base text-gray-500 tracking-widest mt-1">
              IT INFRASTRUCTURE DASHBOARD
            </p> */}
          </div>
        </section>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-10 px-4 sm:px-6 w-full flex flex-col sm:flex-row items-center gap-4 justify-between">
          <input
            type="text"
            placeholder="Search applications or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 w-full px-4 sm:px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
          />
        </div>

        {/* Categories and Applications Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 space-y-8">
          {Object.keys(filteredGroupedApps).length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No applications found</p>
            </div>
          ) : (
            Object.keys(filteredGroupedApps).map((category) => (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="text-left">
                  <h3 className="text-1xl font-semibold text-black py-3 px-6 inline-block">
                    Category: {category}
                    <span className="ml-2 font-semibold text-gray-800">
                      ({filteredGroupedApps[category].length} Applications)
                    </span>
                  </h3>
                </div>

                {/* Applications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-5 gap-4 sm:gap-7 md:gap-6">
                  {filteredGroupedApps[category].map((app, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer bg-blue-600 text-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg
         transform transition-all duration-300 hover:bg-white hover:text-blue-600
         hover:-translate-y-1 h-[140px] sm:h-[160px] flex flex-col justify-center items-center text-center group"
                    >
                      <div className="flex justify-center mb-2 sm:mb-3">
                        <AppIcon
                          iconName={app.icon}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-colors duration-300"
                        />
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold mb-1 truncate max-w-[100px] sm:max-w-[120px] md:max-w-[140px]">
                        {app.title}
                      </h3>
                      <div className="text-[10px] sm:text-xs truncate max-w-[100px] sm:max-w-[120px] md:max-w-[140px]">
                        {app.fullName}
                      </div>

                      {/* Click area for card navigation */}
                      <div
                        className="absolute inset-0 z-0 cursor-pointer"
                        onClick={() => {
                          window.open(app.url, "_blank");
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
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
    </ProtectedRoute>
  );
}
