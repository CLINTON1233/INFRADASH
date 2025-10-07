"use client";

import { Globe, Monitor, Wifi } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const apps = [
    {
      title: "IPAM",
      description: "Manajemen alamat IP dan subnet jaringan",
      icon: Globe,
      url: "http://ipam.company.local",
    },
    {
      title: "WLC Controller",
      description: "Pengelolaan akses point & jaringan wireless",
      icon: Wifi,
      url: "http://wlc.company.local",
    },
    {
      title: "VMware",
      description: "Manajemen server virtual & data center",
      icon: Monitor,
      url: "http://vmware.company.local",
    },
  ];

  const filteredApps = apps.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen flex flex-col text-white">
      {/* 🌊 Background Image + Gradient Overlay */}
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

      {/* 🧭 HEADER (Copy dari Login) */}
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

        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="text-sm hover:text-gray-200 transition"
          >
            Profile
          </Link>
          <Link
            href="/logout"
            className="text-sm hover:text-gray-200 tra`nsition"
          >
            Logout
          </Link>
        </div>
      </header>

      {/* 🟨 Hero Section */}
      <section className="max-w-5xl mx-auto text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
          Infrastructure Dashboard
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto mb-6">
          Akses seluruh aplikasi infrastruktur perusahaan dengan cepat & mudah —
          IPAM, WLC Controller, VMware, dan lainnya dalam satu portal.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
            Open Portal
          </button>
          <button className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-teal-700 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* 🔍 Search Bar */}
      <div className="max-w-lg mx-auto mb-10 px-8">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-10 py-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 text-gray-800 placeholder-gray-500 backdrop-blur-sm"
        />
      </div>

      {/* 🟩 Menu Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredApps.map((app, index) => (
          <div
            key={index}
            onClick={() => (window.location.href = app.url)}
            className="cursor-pointer rounded-xl p-6 text-center bg-white/90 backdrop-blur-sm text-gray-800 shadow hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex justify-center mb-4 text-teal-600">
              <app.icon className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold">{app.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{app.description}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-white text-sm space-y-1 border-t border-white/30">
        <p>Infradash Created by @Clinton Alfaro</p>
        <p>seatrium.com</p>
      </footer>
    </div>
  );
}
