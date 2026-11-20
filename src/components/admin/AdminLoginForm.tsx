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
  UserPlus,
  AlertCircle,
} from "lucide-react";

export default function AdminLoginForm({
  isDbConfigured,
  needsInitialSetup,
}: {
  isDbConfigured: boolean;
  needsInitialSetup: boolean;
}) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (needsInitialSetup && password !== confirmPassword) {
      setError("Konfirmasi sandi tidak cocok.");
      return;
    }

    setPending(true);

    try {
      const endpoint = needsInitialSetup
        ? "/api/admin/setup"
        : "/api/admin/login";
      const payload = needsInitialSetup
        ? { username, displayName, password }
        : { username, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="min-h-screen w-full bg-[#FBF1F2] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-inter text-[13px] font-medium text-[#2B1B1D]/70 hover:text-[#2B1B1D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Glam &amp; Glow</span>
        </Link>

        <div className="rounded-[24px] bg-[#2B1B1D] text-[#FBF1F2] p-7 sm:p-9 border border-white/[0.08] shadow-xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] font-inter text-[11px] uppercase tracking-[0.12em] text-[#E7B6B4]">
              {needsInitialSetup ? (
                <UserPlus className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              <span>
                {needsInitialSetup ? "Setup Admin Pertama" : "Portal Admin"}
              </span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-normal tracking-[-0.02em] text-[#FBF1F2]">
              {needsInitialSetup
                ? "Buat Akun Admin Pertama"
                : "Panel Kontrol PLB"}
            </h1>
            <p className="font-inter text-[13px] text-[#FBF1F2]/65 leading-relaxed">
              {needsInitialSetup
                ? "Tabel Admin di database masih kosong. Daftarkan username dan sandi pertama Anda langsung ke database."
                : "Masuk dengan akun admin yang terdaftar di database untuk mengelola pesanan, konten halaman, dan data uji lab."}
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
                className="block font-inter text-[12px] uppercase tracking-[0.08em] text-[#FBF1F2]/70 font-medium"
              >
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#FBF1F2]/45 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  minLength={3}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Masukkan username"
                  className="w-full h-[48px] pl-11 pr-4 rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] transition-colors"
                />
              </div>
            </div>

            {needsInitialSetup && (
              <div className="space-y-1.5">
                <label
                  htmlFor="displayName"
                  className="block font-inter text-[12px] uppercase tracking-[0.08em] text-[#FBF1F2]/70 font-medium"
                >
                  Nama Tampilan (Opsional)
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Contoh: Owner Glam & Glow"
                  className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] transition-colors"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block font-inter text-[12px] uppercase tracking-[0.08em] text-[#FBF1F2]/70 font-medium"
              >
                Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#FBF1F2]/45 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={needsInitialSetup ? 6 : 1}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    needsInitialSetup ? "new-password" : "current-password"
                  }
                  placeholder="••••••••"
                  className="w-full h-[48px] pl-11 pr-11 rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FBF1F2]/50 hover:text-[#FBF1F2] p-1"
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

            {needsInitialSetup && (
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="block font-inter text-[12px] uppercase tracking-[0.08em] text-[#FBF1F2]/70 font-medium"
                >
                  Ulangi Sandi
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full h-[48px] px-4 rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] transition-colors"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={pending}
                className="w-full h-[50px] rounded-full bg-[#FBF1F2] hover:bg-white text-[#2B1B1D] font-inter text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <span>
                    {needsInitialSetup
                      ? "Menyimpan ke Database..."
                      : "Memverifikasi..."}
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {needsInitialSetup
                        ? "Buat Akun & Masuk Panel Admin"
                        : "Masuk Panel Admin"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between font-inter text-[12px] text-[#FBF1F2]/55">
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
