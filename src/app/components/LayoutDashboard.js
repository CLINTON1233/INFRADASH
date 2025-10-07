"use client";

import {
  ChevronDown,
  Home,
  FileText,
  Shield,
  Calendar,
  HelpCircle,
  Settings,
  Bell,
  Menu,
  X,
  User,
  Globe,
  Wifi,
  Monitor,
  BarChart3,
  Users,
  BookOpen,
  LogOut,
} from "lucide-react";

import Image from "next/image";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function LayoutDashboard({ children, activeMenu }) {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  const menuItems = [
    { icon: Home, label: "Dashboard", hasDropdown: false, href: "/dashboard" },
    // { icon: Globe, label: "IPAM", hasDropdown: false, href: "/ipam" },
    // { icon: Wifi, label: "WLC Controller", hasDropdown: false, href: "/wlc" },
    // { icon: Monitor, label: "VMware", hasDropdown: false, href: "/vmware" },
    // // {
    // //   icon: FileText,
    // //   label: "Field Inventory",
    // //   hasDropdown: false,
    // //   href: "/field-inventory",
    // // },
    // // {
    // //   icon: BarChart3,
    // //   label: "Reports & Analytics",
    // //   hasDropdown: false,
    // //   href: "/reports",
    // // },
    // // {
    // //   icon: Users,
    // //   label: "User Management",
    // //   hasDropdown: false,
    // //   href: "/users",
    // // },
    {
      icon: Settings,
      label: "System Settings",
      hasDropdown: false,
      href: "/settings",
    },
        {
      icon: LogOut,
      label: "Logout",
      hasDropdown: false,
      href: "/login",
    },
    // { icon: BookOpen, label: "User Guide", hasDropdown: false, href: "/guide" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔹 Top Navbar - Mobile & Desktop */}

      <nav className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/seatrium.png"
              alt="Seatrium Logo"
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </div>
          {/* 🧭 Teks INFRADASH di tengah */}
          {/* <div className="absolute left-1/2 transform -translate-x-1/2">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
        INFRADASH
      </h1>
    </div> */}

          <div className="flex items-center space-x-2">
            <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>

            <button className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
              <User className="w-4 h-4" />
              <span>Clinton Alfaro</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>

            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        <div className="hidden md:block bg-blue-600 px-4">
          <div className="flex flex-wrap items-center gap-1 py-2">
            {menuItems.map((item, index) => {
              const isActive =
                activeMenu !== undefined
                  ? index === activeMenu
                  : index === activeMenuIndex;

              return (
                <button
                  key={index}
                  className={`flex items-center space-x-1 px-3 py-2 text-white hover:bg-blue-700 whitespace-nowrap text-sm transition ${
                    isActive ? "bg-blue-700" : ""
                  }`}
                  onClick={() => {
                    if (item.href) {
                      router.push(item.href);
                    } else {
                      setActiveMenuIndex(
                        activeMenuIndex === index ? null : index
                      );
                    }
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </button>
              );
            })}

            <div className="ml-auto text-white text-sm py-2 px-3 opacity-80">
              Monday, 29 September 2025
            </div>
          </div>
        </div>
      </nav>

      {/* 🔹 Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-64 bg-blue-600 z-50 md:hidden overflow-y-auto">
            <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-1 border-t-2 border-blue-600 rounded-full"></div>
                </div>
                <span className="text-white font-bold">Seatrium</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="bg-blue-500 px-4 py-3 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-400 rounded flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">
                  Clinton Alfaro
                </div>
                <button className="text-blue-100 text-xs flex items-center">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item, index) => {
                const isActive =
                  activeMenu !== undefined
                    ? index === activeMenu
                    : index === activeMenuIndex;
                return (
                  <button
                    key={index}
                    className={`flex items-center space-x-1 px-3 py-2 text-white hover:bg-blue-700 whitespace-nowrap text-sm transition ${
                      isActive ? "bg-blue-700" : ""
                    }`}
                    onClick={() => {
                      if (item.href) {
                        router.push(item.href);
                      } else {
                        setActiveMenuIndex(
                          activeMenuIndex === index ? null : index
                        );
                      }
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-blue-700 px-4 py-3 text-white text-xs text-center">
              Monday, 29 September 2025
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {children}
      </div>
    </div>
  );
}
