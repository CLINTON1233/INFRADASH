"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import "../globals.css";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <div className="relative min-h-screen flex flex-col font-poppins">
      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-10 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/seatrium.png"
            alt="Seatrium Logo"
            width={150}
            height={150}
            className="object-contain cursor-pointer"
            priority
          />
        </Link>

        {/* Right Menu */}
        <div className="hidden md:flex items-center space-x-5">
          <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition">
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
            className="px-5 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition font-medium"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Sign in
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-blue-800/95 text-white flex flex-col items-center justify-center space-y-6 z-30 md:hidden">
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
              className="text-center border-2 border-white rounded-lg py-2 hover:bg-white hover:text-blue-700 transition"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="text-center bg-white text-blue-700 rounded-lg py-2 hover:bg-gray-100 font-medium transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/banner.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/50 via-blue-500/30 to-gray-700/40" />
        </div>

        {/* Content */}
        <div className="absolute left-6 md:left-16 top-1/2 transform -translate-y-1/2 text-white text-left max-w-xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 md:mb-6 leading-tight">
            IT Infrastructure Dashboard
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed opacity-90">
            Monitor and manage core network infrastructure and virtualization
            systems seamlessly through a unified, responsive dashboard. Fast,
            reliable, and fully integrated to support IT operations.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-800 hover:bg-blue-700 text-white font-semibold px-6 sm:px-12 py-2 sm:py-3 rounded-full text-base sm:text-lg transition transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
        </div>

        {/*  FOOTER TEKS POLOS */}
        <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white text-sm opacity-80">
          IT Infrastructure Dashboard {" "}
       {" "}
          •{" "}
          <Link
            href="https://seatrium.com"
            target="_blank"
            className="underline hover:opacity-100"
          >
            seatrium.com
          </Link>
        </footer>
      </div>
    </div>
  );
}
