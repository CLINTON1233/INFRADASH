"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.status === "success") {
        const user = data.user;

        // Simpan user dan login
        login({
          id: user.id,
          nama: user.nama,
          email: user.email,
          badge: user.badge || "",
          telp: user.telp || "",
          departemen: user.departemen || "",
          role: user.role,
        });

        await Swal.fire({
          title: "Login Berhasil",
          text: `Selamat datang ${user.nama}!`,
          icon: "success",
          confirmButtonColor: "#1e40af",
        });

        if (user.role === "superadmin") {
          router.push("/superadmin/dashboard");
        } else if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        Swal.fire({
          title: "Login Gagal",
          text: data.message || "Email atau password salah.",
          icon: "error",
          confirmButtonText: "Coba Lagi",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Gagal terhubung ke server.",
        icon: "error",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`relative min-h-screen flex flex-col ${poppins.className}`}>
      {/*  BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg_seatrium 3.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/50 via-blue-500/30 to-gray-700/40" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/50 text-white">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm hover:text-gray-200 transition"
          >
            <Image
              src="/seatrium.png"
              alt="Seatrium Logo"
              width={160}
              height={160}
              className="object-contain"
            />
          </Link>
        </div>
      </div>
      {/* Main Content */}
     <div className="max-w-xl w-full mx-auto px-4 py-38">
  {/* Title di atas form */}
  <div className="flex flex-col items-center mb-6 text-center text-white">
    <h1 className="text-4xl font-bold mb-0">Welcome Back!</h1>
    <p className="text-lg opacity-90">Log in to access your account</p>
  </div>

  {/* Login Form */}
  <form
    onSubmit={handleSubmit}
    className="space-y-4 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-lg mt-8"
  >
    {/* Title di dalam form */}
    <div className="flex flex-col items-center mb-8 text-center text-black">
      <h3 className="text-4xl font-bold mb-3">Log In</h3>
    </div>

    {/* Email */}
    <div>
      <label className="block text-lg text-gray-700 mb-2">
        Email address
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-6 py-4 border border-gray-300 rounded-md text-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Password */}
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-lg text-gray-700">Password</label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full px-6 py-4 border border-gray-300 rounded-md text-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="w-full bg-blue-800 text-white rounded-full py-4 text-lg font-semibold hover:bg-blue-900 transition"
    >
      Log in
    </button>
  </form>
</div>

      <footer className="mt-auto py-4 text-center text-white text-xs md:text-sm space-y-1 border-t border-white/30">
        <p>IT Infrastructure Dashboard </p>
        <Link
          href="https://seatrium.com"
          target="_blank"
          className="underline hover:opacity-100"
        >
          seatrium.com
        </Link>
      </footer>
    </div>
  );
}
