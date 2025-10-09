"use client";

import {
  Globe,
  Monitor,
  Wifi,
  CheckCircle,
  AlertTriangle,
  X,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Cog,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import * as LucideIcons from "lucide-react";
import Swal from "sweetalert2";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [appsList, setAppsList] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);

  const itemsPerPage = 8;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    fetch("http://localhost:4000/applications")
      .then((res) => res.json())
      .then(setAppsList)
      .catch(console.error);
  };

  const resolveIcon = (iconName) => {
    if (!iconName) return LucideIcons.Globe;
    const formattedName = iconName
      .replace(/\s+/g, "")
      .replace(/-/g, "")
      .replace(/\./g, "");
    return LucideIcons[formattedName] || LucideIcons.Globe;
  };

  // Filter data
  const filteredApps = appsList.filter(
    (app) =>
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const currentData = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Mobile Card View
  const MobileAppCard = ({ app }) => {
    const Icon = resolveIcon(app.icon);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <button
              onClick={() => setSelectedApp(app)}
              className={`text-sm font-semibold text-gray-900 hover:text-blue-700 transition-colors text-left truncate flex-1 min-w-0 ${poppins.className}`}
            >
              {app.title}
            </button>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditApp(app);
                setShowEditModal(true);
              }}
              className="p-1 text-gray-400 hover:text-green-600 rounded transition-all"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await handleDeleteApp(app);
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Full Name</span>
            <span className="text-gray-900 text-right truncate ml-2 max-w-[140px]">
              {app.fullName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">URL</span>
            <span className="font-mono text-gray-900 text-xs truncate ml-2 max-w-[120px]">
              {app.url}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Icon</span>
            <span className="text-gray-900 truncate ml-2">
              {app.icon || "Default"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-500">ID: {app.id}</span>
          <button
            onClick={() => setSelectedApp(app)}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  // Modal Detail Aplikasi
  const AppDetailModal = ({ app, onClose }) => {
    const Icon = resolveIcon(app.icon);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
        <div className="bg-white rounded-lg w-full max-w-sm p-4 shadow-xl animate-fade-in relative mx-auto">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-lg font-semibold text-center text-gray-800 mb-3">
            Application Details
          </h2>

          <div className="space-y-3">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3
                className={`font-semibold text-gray-900 mb-2 text-sm ${poppins.className}`}
              >
                Basic Information
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-gray-500 text-xs">Title</label>
                    <p className="font-semibold text-gray-900 truncate">
                      {app.title}
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <label className="text-gray-500 text-xs">Full Name</label>
                  <p className="font-semibold text-gray-900 truncate">
                    {app.fullName}
                  </p>
                </div>
                <div className="min-w-0">
                  <label className="text-gray-500 text-xs">Icon Name</label>
                  <p className="font-semibold text-gray-900 truncate">
                    {app.icon || "Default"}
                  </p>
                </div>
                <div className="min-w-0">
                  <label className="text-gray-500 text-xs">
                    Application ID
                  </label>
                  <p className="font-semibold text-gray-900">{app.id}</p>
                </div>
              </div>
            </div>

            {/* URL Information */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3
                className={`font-semibold text-gray-900 mb-2 text-sm ${poppins.className}`}
              >
                URL Information
              </h3>
              <div className="text-xs">
                <label className="text-gray-500 text-xs">Application URL</label>
                <p className="font-mono text-gray-900 break-all text-xs bg-white p-2 rounded border mt-1">
                  {app.url}
                </p>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs w-full text-center"
                >
                  Open Application
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
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

      {/* HEADER - Mobile Optimized */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-3 py-3 border-b border-white/50 text-white gap-3 sm:gap-0">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm hover:text-gray-200 transition flex-shrink-0"
          >
            <Image
              src="/seatrium.png"
              alt="Seatrium Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-1 text-white hover:text-gray-200 transition"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation - Mobile Collapsible */}
        <div
          className={`${
            isMobile && !showFilters ? "hidden" : "flex"
          } flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto`}
        >
          <div className="flex items-center gap-3 text-sm text-black font-medium w-full sm:w-auto justify-between sm:justify-start flex-wrap">
            <Link
              href="/admin/dashboard"
              className="hover:text-gray-200 transition px-2 py-1 rounded  text-center text-xs sm:text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/applications"
              className="hover:text-gray-200 transition px-2 py-1 rounded  text-center text-xs sm:text-sm"
            >
              Applications
            </Link>
            <Link
              href="/admin/profile"
              className="hover:text-gray-200 transition px-2 py-1 rounded  text-center text-xs sm:text-sm"
            >
              Profile
            </Link>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="hover:text-gray-200 transition px-2 py-1 rounded  text-center text-xs sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="max-w-5xl mx-auto text-center py-3 px-3 sm:px-6">
        <div className="text-center">
          <div className="text-center mt-4">
            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-2">
              <Cog className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
              <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
                <span className="text-black">Applications</span>{" "}
                <span className="text-black">Management</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-500 tracking-widest mt-1">
              Manage all infrastructure applications in the system
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Mobile Optimized */}
      <div className={`${poppins.className} space-y-4 p-3 flex-1`}>
        <div className="space-y-4 max-w-7xl mx-auto w-full">
          {/* Search dan Table Header - Mobile Optimized */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Header dengan Search */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col gap-3">
                <div className="flex-1">
                  <h3
                    className={`text-base font-semibold text-gray-900 ${poppins.className}`}
                  >
                    Applications List
                  </h3>
                  <p
                    className={`text-xs text-gray-600 mt-1 ${poppins.className}`}
                  >
                    Manage all infrastructure applications
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      className={`w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 ${poppins.className}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex gap-2 justify-between">
                    <button
                      className={`px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1 text-xs text-gray-700 ${poppins.className}`}
                      onClick={fetchApplications}
                    >
                      <RefreshCw className="w-3 h-3" />
                      Refresh
                    </button>

                    <div className="flex gap-2">
                      <button
                        className={`flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition ${poppins.className}`}
                      >
                        <Download className="w-3 h-3" />
                        <span className="hidden xs:inline">Export</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Counter */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span
                className={`text-xs text-gray-500 bg-white px-2 py-1 rounded-full border ${poppins.className}`}
              >
                {filteredApps.length} of {appsList.length} Applications
              </span>
            </div>

            {/* Desktop Table / Mobile Cards */}
            {!isMobile ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${poppins.className}`}
                      >
                        Application
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${poppins.className}`}
                      >
                        Full Name
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${poppins.className}`}
                      >
                        URL
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${poppins.className}`}
                      >
                        Icon
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${poppins.className}`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentData.map((app) => {
                      const Icon = resolveIcon(app.icon);

                      return (
                        <tr
                          key={app.id}
                          className="hover:bg-blue-50/30 transition-all duration-200 group"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded-lg">
                                <Icon className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <button
                                  onClick={() => setSelectedApp(app)}
                                  className={`text-sm font-semibold text-gray-900 hover:text-blue-700 transition-colors text-left group-hover:underline truncate ${poppins.className}`}
                                >
                                  {app.title}
                                </button>
                                <span
                                  className={`text-xs text-gray-500 ${poppins.className}`}
                                >
                                  ID: {app.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-sm text-gray-900 ${poppins.className} max-w-[120px] truncate block`}
                            >
                              {app.fullName}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-mono text-xs text-gray-900 max-w-[100px] truncate block ${poppins.className}`}
                            >
                              {app.url}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-sm text-gray-900 ${poppins.className}`}
                            >
                              {app.icon || "Default"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Mobile Cards View */
              <div className="p-3">
                {currentData.map((app) => (
                  <MobileAppCard key={app.id} app={app} />
                ))}
              </div>
            )}

            {/* Pagination - Mobile Optimized */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className={`text-xs text-gray-700 ${poppins.className}`}>
                    Showing{" "}
                    <span className="font-semibold">
                      {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredApps.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">{filteredApps.length}</span>{" "}
                    Applications
                  </p>
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${poppins.className}`}
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${poppins.className}`}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal Detail Aplikasi */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {/* Logout Modal - Mobile Optimized */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 w-full max-w-xs shadow-xl animate-fade-in relative text-center">
            <div className="flex justify-center mb-3">
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-lg font-medium mb-2 text-gray-800">
              Logout Confirmation
            </h2>
            <p className="text-gray-700 mb-4 text-sm">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Mobile Optimized */}
      <footer className="mt-auto py-3 text-center text-white text-xs space-y-1 border-t border-white/30 px-3">
        <p>IT Infrastructure Dashboard Created by @Clinton Alfaro</p>
        <p>seatrium.com</p>
      </footer>
    </div>
  );
}
