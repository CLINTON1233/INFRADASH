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
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import * as XLSX from "xlsx";

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
  const { logout } = useAuth();

  const [newApp, setNewApp] = useState({
    title: "",
    fullName: "",
    url: "",
    icon: "",
    iconFile: null,
    category: "",
  });

  const [editApp, setEditApp] = useState({
    id: null,
    title: "",
    fullName: "",
    url: "",
    icon: "",
    iconFile: null,
    category: "",
  });

  // Ganti const itemsPerPage = 8; dengan:
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showEntriesDropdown, setShowEntriesDropdown] = useState(false);

  // Options untuk show entries
  const entriesOptions = [10, 25, 50, 100, 200, "All"];

  // Fungsi untuk handle change items per page
  const handleItemsPerPageChange = (value) => {
    if (value === "All") {
      setItemsPerPage(filteredApps.length);
    } else {
      setItemsPerPage(value);
    }
    setCurrentPage(1); // Reset ke page 1 ketika ganti items per page
    setShowEntriesDropdown(false);
  };

  // Komponen Show Entries Dropdown
  const ShowEntriesDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowEntriesDropdown(!showEntriesDropdown)}
        className={`flex items-center gap-1 px-3 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition ${poppins.className}`}
      >
        Show {itemsPerPage === filteredApps.length ? "All" : itemsPerPage}
        <ChevronDown className="w-3 h-3" />
      </button>

      {showEntriesDropdown && (
        <div className="absolute bottom-full mb-1 left-0 w-20 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {entriesOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleItemsPerPageChange(option)}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 transition ${
                itemsPerPage ===
                (option === "All" ? filteredApps.length : option)
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {option === "All" ? "All" : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Fungsi untuk export ke Excel
  const exportToExcel = () => {
    try {
      // Data yang akan di-export (bisa menggunakan filteredApps atau appsList)
      const dataToExport = filteredApps.length > 0 ? filteredApps : appsList;

      if (dataToExport.length === 0) {
        Swal.fire({
          title: "No Data",
          text: "There is no data to export.",
          icon: "warning",
          confirmButtonColor: "#1e40af",
        });
        return;
      }

      // Format data untuk Excel
      const excelData = dataToExport.map((app, index) => ({
        No: index + 1,
        "Application ID": app.id,
        Title: app.title,
        "Full Name": app.fullName,
        URL: app.url,
        Category: app.category || "Uncategorized",
        Icon: app.icon || "Default",
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 5 }, // No
        { wch: 15 }, // Application ID
        { wch: 20 }, // Title
        { wch: 30 }, // Full Name
        { wch: 40 }, // URL
        { wch: 20 }, // Category
        { wch: 15 }, // Icon
      ];
      worksheet["!cols"] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

      // Generate filename dengan timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `Applications_Export_${timestamp}.xlsx`;

      // Export ke file
      XLSX.writeFile(workbook, filename);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: `Data has been exported to ${filename}`,
        icon: "success",
        confirmButtonColor: "#1e40af",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        title: "Export Failed",
        text: "Failed to export data to Excel. Please try again.",
        icon: "error",
        confirmButtonColor: "#1e40af",
      });
    }
  };

  // Fungsi untuk export semua data (tanpa filter)
  const exportAllToExcel = () => {
    try {
      if (appsList.length === 0) {
        Swal.fire({
          title: "No Data",
          text: "There is no data to export.",
          icon: "warning",
          confirmButtonColor: "#1e40af",
        });
        return;
      }

      const excelData = appsList.map((app, index) => ({
        No: index + 1,
        "Application ID": app.id,
        Title: app.title,
        "Full Name": app.fullName,
        URL: app.url,
        Category: app.category || "Uncategorized",
        Icon: app.icon || "Default",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);

      const columnWidths = [
        { wch: 5 },
        { wch: 15 },
        { wch: 20 },
        { wch: 30 },
        { wch: 40 },
        { wch: 20 },
        { wch: 15 },
      ];
      worksheet["!cols"] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Applications");

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `All_Applications_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);

      Swal.fire({
        title: "Success!",
        text: `All data has been exported to ${filename}`,
        icon: "success",
        confirmButtonColor: "#1e40af",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        title: "Export Failed",
        text: "Failed to export data to Excel. Please try again.",
        icon: "error",
        confirmButtonColor: "#1e40af",
      });
    }
  };

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
            <span className="text-gray-600">Category</span>
            <span className="text-gray-900 text-right truncate ml-2">
              {app.category || "Uncategorized"}
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
            <div className="min-w-0">
              <label className="text-gray-500 text-xs">Category</label>
              <p className="font-semibold text-gray-900 truncate">
                {app.category || "Uncategorized"}
              </p>
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
            <button
              onClick={() => {
                setEditApp(app);
                setShowEditModal(true);
                onClose();
              }}
              className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Handle Delete Application
  const handleDeleteApp = async (app) => {
    const result = await Swal.fire({
      title: `Delete ${app.title}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:4000/applications/${app.id}`, {
          method: "DELETE",
        });
        fetchApplications();

        Swal.fire({
          title: "Deleted!",
          text: `${app.title} has been deleted.`,
          icon: "success",
          confirmButtonColor: "#1e40af",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete application.",
          icon: "error",
          confirmButtonColor: "#1e40af",
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
  };
  return (
    <ProtectedRoute requiredRole="superadmin">
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
                width={150}
                height={150}
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
                href="/superadmin/dashboard"
                className="hover:text-gray-200 transition px-2 py-1 rounded  text-center text-xs sm:text-sm"
              >
                Dashboard
              </Link>
              <Link
                href="/superadmin/applications"
                className="hover:text-gray-200 transition px-2 py-1 rounded  text-center text-xs sm:text-sm"
              >
                Applications
              </Link>
              <Link
                href="/superadmin/profile"
                className="hover:text-gray-200 transition px-2 py-1 rounded  text-center text-xs sm:text-sm"
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
                          {/* Tombol Export dengan dropdown */}
                          <div className="relative group">
                            <button
                              className={`flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition ${poppins.className}`}
                            >
                              <Download className="w-3 h-3" />
                              <span className="hidden xs:inline">Export</span>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                              <button
                                onClick={exportToExcel}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                              >
                                <Download className="w-3 h-3" />
                                Export Filtered Data
                                <span className="text-xs text-gray-500 ml-auto">
                                  ({filteredApps.length})
                                </span>
                              </button>
                              <button
                                onClick={exportAllToExcel}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2 border-t border-gray-100"
                              >
                                <Download className="w-3 h-3" />
                                Export All Data
                                <span className="text-xs text-gray-500 ml-auto">
                                  ({appsList.length})
                                </span>
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => setShowAddModal(true)}
                            className={`flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition ${poppins.className}`}
                          >
                            <Plus className="w-3 h-3" />
                            Add New Applications
                            <span className="hidden xs:inline">Add</span>
                          </button>
                        </div>
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
                          Category
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
                                {app.category || "Uncategorized"}
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
                                <button
                                  onClick={() => {
                                    setEditApp(app);
                                    setShowEditModal(true);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200"
                                  title="Edit Application"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteApp(app)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                                  title="Delete Application"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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

              {/* Pagination dengan Show Entries */}
              {(totalPages > 1 || itemsPerPage !== 10) && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Show Entries dan Info */}
                    <div className="flex items-center gap-3">
                      <ShowEntriesDropdown />
                      <p
                        className={`text-xs text-gray-700 ${poppins.className}`}
                      >
                        Showing{" "}
                        <span className="font-semibold">
                          {filteredApps.length === 0
                            ? 0
                            : (currentPage - 1) * itemsPerPage + 1}
                          -
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredApps.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                          {filteredApps.length}
                        </span>{" "}
                        Applications
                      </p>
                    </div>

                    {/* Pagination Buttons */}
                    {totalPages > 1 && (
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
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${poppins.className}`}
                        >
                          Next →
                        </button>
                      </div>
                    )}
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

        {/* Add Modal - Mobile Optimized */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
            <div className="bg-white rounded-lg w-full max-w-sm p-4 shadow-xl animate-fade-in relative mx-auto">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-lg font-semibold text-center text-gray-800 mb-3">
                Add New Application
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Application Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter application title"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={newApp.title}
                    onChange={(e) =>
                      setNewApp({ ...newApp, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Full Application Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full application name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={newApp.fullName}
                    onChange={(e) =>
                      setNewApp({ ...newApp, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Application URL *
                  </label>
                  <input
                    type="text"
                    placeholder="https://your-app-url.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={newApp.url}
                    onChange={(e) =>
                      setNewApp({ ...newApp, url: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter category (e.g., Productivity, Development, etc.)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={newApp.category}
                    onChange={(e) =>
                      setNewApp({ ...newApp, category: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Application Icon
                  </label>
                  <input
                    type="text"
                    placeholder="Enter icon name (Globe, Wifi, Monitor)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 mb-2"
                    value={newApp.icon}
                    onChange={(e) =>
                      setNewApp({ ...newApp, icon: e.target.value })
                    }
                  />

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-full h-px bg-gray-300 flex-1"></div>
                    <span className="text-gray-500 text-xs">or</span>
                    <div className="w-full h-px bg-gray-300 flex-1"></div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-gray-700 border border-gray-300 rounded cursor-pointer focus:outline-none p-1"
                    onChange={(e) =>
                      setNewApp({ ...newApp, iconFile: e.target.files[0] })
                    }
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    Use icon names or upload your own icon image
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    try {
                      // Validasi input
                      if (
                        !newApp.title.trim() ||
                        !newApp.fullName.trim() ||
                        !newApp.url.trim()
                      ) {
                        Swal.fire({
                          title: "Validation Error",
                          text: "Please fill in all required fields (Title, Full Name, and URL).",
                          icon: "warning",
                          confirmButtonColor: "#1e40af",
                        });
                        return;
                      }

                      // Validasi URL format
                      try {
                        new URL(newApp.url);
                      } catch (urlError) {
                        Swal.fire({
                          title: "Invalid URL",
                          text: "Please enter a valid URL format (e.g., https://example.com).",
                          icon: "warning",
                          confirmButtonColor: "#1e40af",
                        });
                        return;
                      }

                      const formData = new FormData();
                      formData.append("title", newApp.title.trim());
                      formData.append("fullName", newApp.fullName.trim());
                      formData.append("url", newApp.url.trim());
                      formData.append("icon", newApp.icon?.trim() || "Globe");
                      formData.append(
                        "category",
                        newApp.category?.trim() || "Uncategorized"
                      );

                      if (newApp.iconFile) {
                        formData.append("iconFile", newApp.iconFile);
                      }

                      console.log("Sending data:", {
                        title: newApp.title,
                        fullName: newApp.fullName,
                        url: newApp.url,
                        icon: newApp.icon || "Globe",
                      });

                      const res = await fetch(
                        "http://localhost:4000/applications",
                        {
                          method: "POST",
                          body: formData,
                        }
                      );

                      const responseText = await res.text();
                      console.log("Response status:", res.status);
                      console.log("Response text:", responseText);

                      if (res.ok) {
                        setShowAddModal(false);
                        setNewApp({
                          title: "",
                          fullName: "",
                          url: "",
                          icon: "",
                          iconFile: null,
                        });
                        fetchApplications();

                        await Swal.fire({
                          title: "Success!",
                          text: "New application has been successfully added.",
                          icon: "success",
                          confirmButtonColor: "#1e40af",
                        });
                      } else {
                        let errorMessage = "Failed to save application.";

                        try {
                          const errorData = JSON.parse(responseText);
                          errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                          // Jika response bukan JSON, gunakan teks asli
                          errorMessage = responseText || errorMessage;
                        }

                        console.error("Failed to save application:", {
                          status: res.status,
                          message: errorMessage,
                        });

                        Swal.fire({
                          title: "Error",
                          text: errorMessage,
                          icon: "error",
                          confirmButtonColor: "#1e40af",
                        });
                      }
                    } catch (err) {
                      console.error("Error adding application:", err);
                      Swal.fire({
                        title: "Connection Error",
                        text: "Cannot connect to server. Please check if the server is running.",
                        icon: "error",
                        confirmButtonColor: "#1e40af",
                      });
                    }
                  }}
                  className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  Save Application
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Modal - Mobile Optimized */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
            <div className="bg-white rounded-lg w-full max-w-sm p-4 shadow-xl animate-fade-in relative mx-auto">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-lg font-semibold text-center text-gray-800 mb-3">
                Edit Application
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Application Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter application title"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={editApp.title}
                    onChange={(e) =>
                      setEditApp({ ...editApp, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Full Application Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full application name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={editApp.fullName}
                    onChange={(e) =>
                      setEditApp({ ...editApp, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={editApp.category}
                    onChange={(e) =>
                      setEditApp({ ...editApp, category: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Application URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://your-app-url.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={editApp.url}
                    onChange={(e) =>
                      setEditApp({ ...editApp, url: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-xs font-medium mb-1">
                    Application Icon
                  </label>
                  <input
                    type="text"
                    placeholder="Enter icon name (Globe, Wifi, Monitor)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={editApp.icon}
                    onChange={(e) =>
                      setEditApp({ ...editApp, icon: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Change icon name or leave blank for default
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                // Di bagian Edit Modal, perbaiki handle submit:
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `http://localhost:4000/applications/${editApp.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            title: editApp.title,
                            fullName: editApp.fullName,
                            url: editApp.url,
                            icon: editApp.icon,
                            category: editApp.category || "Uncategorized", // TAMBAHKAN INI
                          }),
                        }
                      );

                      if (res.ok) {
                        fetchApplications();
                        setShowEditModal(false);

                        Swal.fire({
                          title: "Success!",
                          text: "Application has been successfully updated.",
                          icon: "success",
                          confirmButtonColor: "#1e40af",
                        });
                      } else {
                        Swal.fire({
                          title: "Error",
                          text: "Failed to update application.",
                          icon: "error",
                          confirmButtonColor: "#1e40af",
                        });
                      }
                    } catch (error) {
                      console.error("Error updating application:", error);
                      Swal.fire({
                        title: "Error",
                        text: "Something went wrong. Please try again.",
                        icon: "error",
                        confirmButtonColor: "#1e40af",
                      });
                    }
                  }}
                  className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
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

        {/* Footer - Mobile Optimized */}
        <footer className="mt-auto py-3 text-center text-white text-xs space-y-1 border-t border-white/30 px-3">
          <p>IT Infrastructure Dashboard Created by @Clinton Alfaro</p>
          <p>seatrium.com</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
