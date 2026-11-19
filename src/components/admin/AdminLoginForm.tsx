"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User,
  AlertCircle,
} from "lucide-react";

export default function AdminLoginForm({
  isDbConfigured,
  isDevMode,
}: {
  isDbConfigured: boolean;
  isDevMode: boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setError(data.error || "Username atau password salah.");
        setPending(false);
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Koneksi gagal. Pastikan server berjalan lalu coba lagi.");
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F1E6D8] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-inter text-[13px] font-medium text-[#201914]/70 hover:text-[#201914] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Glam &amp; Glow</span>
        </Link>

        <div className="rounded-[24px] bg-[#201914] text-[#F1E6D8] p-7 sm:p-9 border border-white/[0.08] shadow-xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] font-inter text-[11px] uppercase tracking-[0.12em] text-[#D4A359]">
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-normal tracking-[-0.02em] text-[#F1E6D8]">
              Panel Kontrol PLB
            </h1>
            <p className="font-inter text-[13px] text-[#F1E6D8]/65 leading-relaxed">
              Kelola pesanan masuk, katalog produk, stok pot, dan rekam uji lab
              Teknologi Farmasi.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-[14px] bg-red-500/15 border border-red-400/30 text-red-200 font-inter text-[13px] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block font-inter text-[12px] uppercase tracking-[0.08em] text-[#F1E6D8]/70 font-medium"
              >
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#F1E6D8]/45 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full h-[48px] pl-11 pr-4 rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] placeholder-[#F1E6D8]/35 font-inter text-[14px] focus:outline-none focus:border-[#D4A359] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block font-inter text-[12px] uppercase tracking-[0.08em] text-[#F1E6D8]/70 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#F1E6D8]/45 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-[48px] pl-11 pr-11 rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] placeholder-[#F1E6D8]/35 font-inter text-[14px] focus:outline-none focus:border-[#D4A359] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F1E6D8]/50 hover:text-[#F1E6D8] p-1"
                  aria-label="Tampilkan atau sembunyikan password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={pending}
                className="w-full h-[50px] rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Masuk Panel Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {isDevMode && (
            <div className="p-3 rounded-[12px] bg-white/[0.04] border border-white/[0.08] font-inter text-[12px] text-[#F1E6D8]/75 flex items-center justify-between gap-2">
              <span>Testing Lokal:</span>
              <button
                type="button"
                onClick={() => {
                  setUsername("admin");
                  setPassword("glamglow2026");
                }}
                className="text-[#D4A359] hover:underline font-medium"
              >
                Isi Otomatis (admin / glamglow2026)
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between font-inter text-[12px] text-[#F1E6D8]/55">
            <span>Status Database</span>
            <span
              className={`inline-flex items-center gap-1.5 font-medium ${
                isDbConfigured ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isDbConfigured ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {isDbConfigured ? "Neon / PostgreSQL Siap" : "Mode Pratinjau"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
