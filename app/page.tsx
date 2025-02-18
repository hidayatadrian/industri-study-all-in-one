"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6">
      {/* Navbar */}
      <nav className="w-full max-w-6xl flex justify-between items-center py-4">
        <h1 className="text-3xl font-extrabold tracking-wide">
          <span className="text-blue-500">Industri</span> Study
        </h1>
        <Link href="/login">
          <button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition font-semibold">
            Masuk
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center mt-16">
    

        <motion.h1
          className="text-5xl font-extrabold mt-6 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Optimalkan <span className="text-blue-400">Waktu Belajar Anda</span> <br />
          dengan Aplikasi Industri Study
        </motion.h1>

        <p className="text-lg text-gray-300 mt-4 max-w-2xl">
          Gunakan analisis cerdas untuk memprediksi tren penjualan dan mengambil keputusan yang lebih baik.
        </p>

        <motion.div
          className="flex gap-4 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-500 transition">
              Mulai Sekarang
            </button>
          </Link>
          <Link href="/register">
            <button className="px-6 py-3 border border-white rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition">
              Daftar 
            </button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-400 text-sm">
        © 2024 Industri Study | <a href="#" className="underline">Kebijakan Privasi</a> | <a href="#" className="underline">Syarat & Ketentuan</a>
      </footer>
    </div>
  );
}
