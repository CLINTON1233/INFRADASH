"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    badge: "",
    telp: "",
    departemen: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`relative min-h-screen flex flex-col ${poppins.className}`}>
      {/* 🌊 BACKGROUND */}
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

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/50 text-white">
        {/* Back with logo */}
        <div className="flex items-center gap-2">
          <Link
            href="#"
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

        <Link href="/login" className="text-sm hover:text-gray-200 transition">
          Log in
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-lg w-full mx-auto px-4 py-10">
        {/* Title */}
        <div className="flex flex-col items-center mb-8 text-center text-white">
          <h1 className="text-2xl font-bold mb-1">Get Started Now!</h1>
          <p className="text-sm opacity-90">
            Create your account to access the system
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg"
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">
              Phone number (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="text-sm text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-blue-600 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Badge */}
          <div>
            <label htmlFor="badge" className="block text-sm text-gray-700 mb-1">
              No. Badge
            </label>
            <input
              type="text"
              id="badge"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="Contoh: 123456"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Telepon */}
          <div>
            <label htmlFor="telp" className="block text-sm text-gray-700 mb-1">
              No. Telepon
            </label>
            <input
              type="text"
              id="telp"
              name="telp"
              value={formData.telp}
              onChange={handleChange}
              placeholder="08123456789"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Departemen */}
          <div>
            <label
              htmlFor="departemen"
              className="block text-sm text-gray-700 mb-1"
            >
              Departemen
            </label>
            <input
              type="text"
              id="departemen"
              name="departemen"
              value={formData.departemen}
              onChange={handleChange}
              placeholder="IT Department"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white rounded-full py-2.5 text-sm font-medium hover:bg-blue-900 transition"
          >
            Sign up
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs text-white mt-6 text-center opacity-90">
          By creating an account, you agree to the{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="/privacy" className="underline">
            Privacy
          </Link>
        </p>

        {/* Already have an account */}
        <div className="text-center mt-4">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-gray-200">
              Login
            </Link>
          </p>
        </div>
      </div>
      <footer className="mt-auto py-4 text-center text-white text-sm space-y-1">
        <p>Infradash Created by @Clinton Alfaro</p>
        <p>seatrium.com</p>
      </footer>
    </div>
  );
}
