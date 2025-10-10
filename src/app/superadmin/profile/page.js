"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { User, AlertTriangle, X, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      setFormData(user);
    } else {
      window.location.href = "/login";
    }
  }, []);

  if (!userData) {
    return <div className="text-center mt-20 text-white">Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleLogout = () => {
  logout(); // Ini akan handle semua cleanup dan redirect
};

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/users/${userData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (result.status === "success") {
        setUserData(result.user);
        setFormData(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        setEditMode(false);

        // Ganti alert dengan SweetAlert
        Swal.fire({
          title: "Berhasil",
          text: "Data profile berhasil diperbarui!",
          icon: "success",
          confirmButtonColor: "#1e40af",
        });
      } else {
        Swal.fire({
          title: "Gagal",
          text: result.message || "Gagal menyimpan data",
          icon: "error",
          confirmButtonColor: "#1e40af",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Terjadi kesalahan saat menyimpan data!",
        icon: "error",
        confirmButtonColor: "#1e40af",
      });
    }
  };

  return (
     <ProtectedRoute requiredRole="superadmin">
    <div className={`relative min-h-screen flex flex-col ${poppins.className}`}>
      {/* Background */}
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
              href="/superadmin/dashboard"
              className="hover:text-gray-200 transition w-full sm:w-auto text-center sm:text-left"
            >
              Dashboard
            </Link>
            <Link
              href="/superadmin/applications"
              className="hover:text-gray-200 transition w-full sm:w-auto text-center sm:text-left"
            >
              Applications
            </Link>
            <Link
              href="/superadmin/profile"
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

      {/* Profile Form */}
      <div className="max-w-lg w-full mx-auto px-4 py-10">
        {/* Icon People */}
        <div className="flex flex-col items-center mb-6 text-white">
          <User size={60} className="mb-2" />
          <h1 className="text-2xl font-bold">Profile Superadmin</h1>
          <p className="text-sm opacity-90">Informasi Akun</p>
        </div>

        <div className="space-y-6 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg">
          {/* Nama */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              readOnly={!editMode}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-gray-100"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              No. Badge
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge || ""}
              readOnly={!editMode}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              No. Telepon
            </label>
            <input
              type="text"
              name="telp"
              value={formData.telp || ""}
              readOnly={!editMode}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Departemen */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Departemen
            </label>
            <input
              type="text"
              name="departemen"
              value={formData.departemen || ""}
              readOnly={!editMode}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-gray-100"
            />
          </div>

          {/* Tombol Edit / Simpan */}
          <div className="flex justify-end">
            {editMode ? (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Simpan
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Edit Data
              </button>
            )}
          </div>
        </div>
      </div>

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

      <footer className="mt-auto py-4 text-center text-white text-xs md:text-sm space-y-1 border-t border-white/30">
        <p>IT Infrastructure Dashboard Created by @Clinton Alfaro</p>
        <p>seatrium.com</p>
      </footer>
    </div>
    </ProtectedRoute>
  );
}
