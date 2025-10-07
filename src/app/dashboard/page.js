"use client";

import { Globe, Monitor, Wifi } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";

// Import font Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const apps = [
    {
      title: "IPAM",
      fullName: "IP Address Management",
      description: "IP address and subnet management",
      icon: Globe,
      url: "https://10.5.252.161",
      status: "Operational",
      owner: "Network Team",
      lastUpdated: "2025-09-28",
      tags: ["network", "ipam"],
    },
    {
      title: "WLC Controller",
      fullName: "Wireless LAN Controller",
      description: "Access point and wireless network management",
      icon: Wifi,
      url: "https://10.5.252.64:8443",
      status: "Operational",
      owner: "Wireless Team",
      lastUpdated: "2025-09-25",
      tags: ["wireless", "controller"],
    },
    {
      title: "VMware",
      fullName: "VMware vSphere",
      description: "Virtual server and data center management",
      icon: Monitor,
      url: "https://10.5.252.101",
      status: "Degraded",
      owner: "Platform Team",
      lastUpdated: "2025-09-30",
      tags: ["virtualization", "compute"],
    },
  ];

  const filteredApps = apps.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`relative min-h-screen flex flex-col text-white ${poppins.className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/offshore.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/60 via-teal-400/40 to-pink-300/50" />
      </div>

      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-white/50 text-white">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm hover:text-gray-200 transition"
          >
            <Image
              src="/seatrium.png"
              alt="Seatrium Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/profile" className="hover:text-gray-200 transition">
            Profile
          </Link>
          <Link href="/logout" className="hover:text-gray-200 transition">
            Logout
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
          Infrastructure Dashboard
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto mb-6 text-base md:text-lg font-light">
          Access all company infrastructure applications quickly & easily —
          IPAM, WLC Controller, VMware, and more in a single portal.
        </p>
       <div className="flex flex-col items-center mt-6 space-y-3">
  <Link
    href="/dashboard"
    className="bg-blue-800 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
  >
    Launch Dashboard
  </Link>
 
</div>

      </section>

  {/*  Search Bar */}
      <div className="max-w-lg mx-auto mb-10 px-8">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-800 placeholder-gray-500 backdrop-blur-sm text-sm md:text-base"
        />
      </div>

  {/*  Menu Section (card similar to login form) */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredApps.map((app, index) => (
          <div
            key={index}
            className="cursor-pointer bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg text-gray-800 hover:shadow-xl transition transform hover:-translate-y-1 min-h-[260px] flex flex-col justify-between"
            onClick={() => (window.location.href = app.url)}
          >
            <div>
              <div className="flex justify-center mb-4 text-teal-600">
                <app.icon className="w-14 h-14" />
              </div>

              <h3 className="text-xl font-semibold text-center mb-1">
                {app.title}
              </h3>
              <div className="text-center text-xs text-gray-500 mb-3">
                {app.fullName}
              </div>

              <p className="text-sm text-gray-600 text-center mb-4">
                {app.description}
              </p>

              <div className="flex justify-center gap-2 mb-4">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    app.status === "Operational"
                      ? "bg-green-500"
                      : app.status === "Degraded"
                      ? "bg-yellow-400"
                      : "bg-red-500"
                  }`}
                  aria-hidden
                />
                <div className="text-xs text-gray-600">
                  <div className="font-medium">{app.status}</div>
                  <div className="text-[11px]">Updated {app.lastUpdated}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(app.url, "_blank");
                  }}
                  className="text-sm px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Open
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-white text-xs md:text-sm space-y-1 border-t border-white/30">
        <p>Infradash Created by @Clinton Alfaro</p>
        <p>seatrium.com</p>
      </footer>
    </div>
  );
}
