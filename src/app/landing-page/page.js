"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import "../globals.css";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔒 Lock scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  return (
    <div className="relative min-h-screen">
      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-8 py-6">
        {/* Left: Logo + Menu */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/seatrium.png"
                alt="Seatrium Logo"
                width={140}
                height={140}
                className="object-contain cursor-pointer"
                priority
              />
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex space-x-6 text-white">
            <Link href="/" className="hover:text-gray-200 transition">
              Home
            </Link>
            <Link href="/ipam" className="hover:text-gray-200 transition">
              IPAM
            </Link>
            <Link href="/wlc" className="hover:text-gray-200 transition">
              WLC Controller
            </Link>
            <Link href="/vmware" className="hover:text-gray-200 transition">
              VMware
            </Link>
            <Link href="/inventory" className="hover:text-gray-200 transition">
              Inventory
            </Link>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-3">
          <button className="hidden md:flex items-center space-x-2 text-white hover:text-gray-200 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Search</span>
          </button>
          <Link
            href="/register"
            className="px-6 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-teal-600 transition"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-teal-700/95 text-white flex flex-col items-center justify-center space-y-6 z-20 md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-lg">
            Home
          </Link>
          <Link
            href="/ipam"
            onClick={() => setMenuOpen(false)}
            className="text-lg"
          >
            IPAM
          </Link>
          <Link
            href="/wlc"
            onClick={() => setMenuOpen(false)}
            className="text-lg"
          >
            WLC Controller
          </Link>
          <Link
            href="/vmware"
            onClick={() => setMenuOpen(false)}
            className="text-lg"
          >
            VMware
          </Link>

          <div className="flex flex-col space-y-3 w-3/4 pt-6">
            <Link
              href="/register"
              className="text-center border-2 border-white rounded-lg py-2 hover:bg-white hover:text-teal-700"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="text-center bg-white text-teal-700 rounded-lg py-2 hover:bg-gray-100 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

        {/* Content */}
        <div className="text-white text-center px-4 md:px-8 max-w-2xl">
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold  mb-4 md:mb-6 leading-tight">
            INFRADASH
          </h3>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed opacity-95">
            Monitor all IP Address, Wireless Controller, VMware, and
            infrastructure inventory information in one modern and responsive
            dashboard. Fast, easy, and integrated access to support IT
            operations.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-800 hover:bg-blue-700 text-white font-semibold px-6 sm:px-12 py-2 sm:py-3 rounded-full text-base sm:text-lg transition transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
