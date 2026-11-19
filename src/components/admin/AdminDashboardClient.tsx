"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FlaskConical,
  Settings,
  LogOut,
  Plus,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  MessageCircle,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  X,
  FileEdit,
  Receipt,
} from "lucide-react";
import {
  BATCH_STATUS_META,
  ORDER_STATUS_META,
  type EnvChecklist,
  type SerializedLabBatch,
  type SerializedOrder,
  type SerializedProduct,
} from "@/lib/admin-types";
import type { SiteContentConfig } from "@/lib/site-content-types";
import { cleanPhoneNumber, formatRupiah } from "@/lib/utils";
import {
  deleteLabBatchAction,
  deleteOrderAction,
  deleteProductAction,
  logoutAdminAction,
  updateAdminCredentialsAction,
  updateOrderStatusAction,
} from "@/app/actions/admin";
import AdminProductModal from "@/components/admin/AdminProductModal";
import AdminBatchModal from "@/components/admin/AdminBatchModal";
import AdminPagesEditor from "@/components/admin/AdminPagesEditor";
import CustomSelect from "@/components/ui/CustomSelect";

type AdminTab =
  | "overview"
  | "pesanan"
  | "produk"
  | "lab"
  | "halaman"
  | "pengaturan";

interface AdminDashboardClientProps {
  initialTab?: string;
  adminName: string;
  adminUsername: string;
  orders: SerializedOrder[];
  products: SerializedProduct[];
  batches: SerializedLabBatch[];
  siteContent: SiteContentConfig;
  envChecklist: EnvChecklist;
}

const VALID_TABS: ReadonlyArray<AdminTab> = [
  "overview",
  "pesanan",
  "produk",
  "lab",
  "halaman",
  "pengaturan",
];

function formatDateID(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTimeID(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboardClient({
  initialTab,
  adminName,
  adminUsername,
  orders,
  products,
  batches,
  siteContent,
  envChecklist,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const resolvedInitial: AdminTab = VALID_TABS.includes(initialTab as AdminTab)
    ? (initialTab as AdminTab)
    : "overview";

  const [activeTab, setActiveTab] = useState<AdminTab>(resolvedInitial);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filter state Orders
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Modals
  const [productModal, setProductModal] = useState<{
    open: boolean;
    item: SerializedProduct | null;
  }>({ open: false, item: null });
  const [batchModal, setBatchModal] = useState<{
    open: boolean;
    item: SerializedLabBatch | null;
  }>({ open: false, item: null });

  // Settings: update account & password
  const [editUsername, setEditUsername] = useState(adminUsername);
  const [editDisplayName, setEditDisplayName] = useState(adminName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  const notify = (type: "success" | "error", text: string) => {
    setToast({ type, text });
  };

  const refreshAfterMutation = (message: string) => {
    notify("success", message);
    setConfirmDeleteId(null);
    startTransition(() => {
      router.refresh();
    });
  };

  // KPI computations
  const activeOrders = orders.filter((o) => o.status !== "CANCELLED");
  const totalOmset = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const needsConfirmationCount = orders.filter((o) => o.status === "CONFIRMED").length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const activeProductsCount = products.filter((p) => p.isActive).length;
  const totalStock = products.reduce(
    (sum, p) => sum + (p.isActive ? p.stock : 0),
    0
  );
  const passedBatchesCount = batches.filter(
    (b) => b.qcStatus === "PASSED"
  ).length;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      orderStatusFilter === "ALL" || order.status === orderStatusFilter;
    const q = orderSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.toLowerCase().includes(q) ||
      (order.cityOrDistrict?.toLowerCase().includes(q) ?? false);
    return matchesStatus && matchesQuery;
  });

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
    {
      id: "pesanan",
      label: "Pesanan",
      icon: ShoppingBag,
      badge: needsConfirmationCount > 0 ? needsConfirmationCount : pendingCount,
    },
    { id: "produk", label: "Produk & Stok", icon: Package },
    { id: "lab", label: "Uji Lab Farmasi", icon: FlaskConical },
    { id: "halaman", label: "Edit Halaman", icon: FileEdit },
    { id: "pengaturan", label: "Pengaturan", icon: Settings },
  ];

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const res = await updateOrderStatusAction(orderId, status);
    if (!res.ok) {
      notify("error", res.message);
      return;
    }
    refreshAfterMutation(res.message);
  };

  const handleDeleteOrder = async (orderId: string) => {
    const res = await deleteOrderAction(orderId);
    if (!res.ok) {
      notify("error", res.message);
      return;
    }
    refreshAfterMutation(res.message);
  };

  const handleDeleteProduct = async (productId: string) => {
    const res = await deleteProductAction(productId);
    if (!res.ok) {
      notify("error", res.message);
      return;
    }
    refreshAfterMutation(res.message);
  };

  const handleDeleteBatch = async (batchId: string) => {
    const res = await deleteLabBatchAction(batchId);
    if (!res.ok) {
      notify("error", res.message);
      return;
    }
    refreshAfterMutation(res.message);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      notify("error", "Konfirmasi password baru tidak sama.");
      return;
    }
    setChangingPass(true);
    try {
      const res = await updateAdminCredentialsAction({
        newUsername: editUsername,
        newDisplayName: editDisplayName,
        currentPassword,
        newPassword: newPassword || undefined,
      });
      if (!res.ok) {
        notify("error", res.message);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      refreshAfterMutation(res.message);
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F1E6D8] text-[#201914] flex flex-col lg:flex-row">
      {/* Desktop Rounded Floating Sidebar */}
      <aside className="hidden lg:flex lg:w-[270px] shrink-0 bg-[#201914] text-[#F1E6D8] flex-col justify-between p-6 border border-white/[0.08] rounded-[28px] shadow-xl sticky lg:top-4 lg:m-4 lg:mr-0 lg:h-[calc(100vh-32px)]">
        <div className="space-y-8">
          <div className="space-y-1">
            <span className="font-inter text-[11px] uppercase tracking-[0.14em] text-[#D4A359] block">
              Glam &amp; Glow Admin
            </span>
            <h2 className="font-sans text-xl font-normal tracking-[-0.01em]">
              Panel Kontrol PLB
            </h2>
            <p className="font-inter text-[12px] text-[#F1E6D8]/55">
              {adminName} (@{adminUsername})
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setConfirmDeleteId(null);
                  }}
                  className={`w-full px-4 py-3 rounded-[14px] font-inter text-[14px] flex items-center justify-between transition-colors ${
                    isActive
                      ? "bg-[#F1E6D8] text-[#201914] font-semibold"
                      : "text-[#F1E6D8]/80 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        isActive
                          ? "bg-[#201914] text-[#F1E6D8]"
                          : "bg-[#D4A359] text-[#201914]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/[0.08]">
          <div className="p-3 rounded-[14px] bg-white/[0.04] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-2 font-inter text-[12px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  envChecklist.isDbConnected ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span className="font-medium">
                {envChecklist.isDbConnected
                  ? "Neon PostgreSQL Aktif"
                  : "Mode Pratinjau Offline"}
              </span>
            </div>
            <p className="font-inter text-[11px] text-[#F1E6D8]/50">
              {envChecklist.isDbConnected
                ? "Semua perubahan tersimpan real-time."
                : "Hubungkan Neon di Vercel untuk simpan permanen."}
            </p>
          </div>

          <Link
            href="/"
            className="w-full px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#F1E6D8] font-inter text-[13px] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lihat Website Utama</span>
          </Link>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-full border border-white/[0.12] hover:bg-red-500/20 text-[#F1E6D8]/85 hover:text-red-200 font-inter text-[13px] flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header + Tabs (Rounded) */}
        <header className="lg:hidden bg-[#201914] text-[#F1E6D8] p-4 space-y-3 border border-white/[0.08] rounded-[24px] mx-3 mt-3 shadow-lg sticky top-3 z-30">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-inter text-[10px] uppercase tracking-[0.14em] text-[#D4A359] block">
                Admin Panel PLB
              </span>
              <h1 className="font-sans text-[18px] font-normal">
                Glam &amp; Glow
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-full bg-white/[0.08] font-inter text-[12px] text-[#F1E6D8]"
              >
                Website
              </Link>
              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="p-2 rounded-full bg-white/[0.08] text-[#F1E6D8]"
                  aria-label="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-full font-inter text-[12px] whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 transition-colors ${
                    isActive
                      ? "bg-[#F1E6D8] text-[#201914] font-semibold"
                      : "bg-white/[0.06] text-[#F1E6D8]/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1280px] w-full mx-auto space-y-6">
          {/* DB Preview Notice if not connected */}
          {!envChecklist.isDbConnected && (
            <div className="rounded-[18px] p-4 bg-amber-500/10 border border-amber-600/30 flex items-start gap-3">
              <Database className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div className="font-inter text-[13px] text-[#201914] space-y-0.5">
                <p className="font-semibold text-amber-950">
                  Mode Pratinjau — Database Neon belum terhubung
                </p>
                <p className="text-[#201914]/75">
                  Data di bawah ini contoh simulasi. Setelah integrasi Neon
                  terhubung di Vercel dan deploy selesai, semua tabel dan CRUD
                  otomatis aktif penuh.
                </p>
              </div>
            </div>
          )}

          {/* Action Toast Notification */}
          {toast && (
            <div
              className={`rounded-[16px] p-3.5 px-4 border flex items-center justify-between gap-3 font-inter text-[13px] ${
                toast.type === "success"
                  ? "bg-[#2D3622] text-[#F1E6D8] border-[#2D3622]"
                  : "bg-red-500/15 text-red-950 border-red-500/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#D4A359] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                )}
                <span>{toast.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="opacity-70 hover:opacity-100 p-1"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: RINGKASAN */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h1 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
                    Ringkasan Operasional
                  </h1>
                  <p className="font-inter text-[13px] sm:text-[14px] text-[#201914]/65">
                    Integrasi toko online PLB &amp; data uji laboratorium Teknologi Farmasi.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("lab")}
                    className="px-4 py-2 rounded-full bg-[#2D3622] text-[#F1E6D8] font-inter text-[13px] font-medium hover:bg-[#201914] transition-colors"
                  >
                    Kelola Uji Lab
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("pesanan")}
                    className="px-4 py-2 rounded-full bg-[#201914] text-[#F1E6D8] font-inter text-[13px] font-medium hover:bg-[#2D3622] transition-colors"
                  >
                    Cek Pesanan
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-[20px] bg-white p-5 border border-[#201914]/10 space-y-2">
                  <div className="flex items-center justify-between text-[#201914]/60 font-inter text-[12px] uppercase tracking-[0.06em]">
                    <span>Pesanan Masuk</span>
                    <ShoppingBag className="w-4 h-4 text-[#2D3622]" />
                  </div>
                  <div className="font-sans text-3xl font-semibold">
                    {orders.length}
                  </div>
                  <p className="font-inter text-[12px] text-[#201914]/65">
                    <span className="font-semibold text-amber-800">
                      {needsConfirmationCount} membutuhkan konfirmasi
                    </span>
                    {pendingCount > 0 ? ` • ${pendingCount} belum bayar` : ""}
                  </p>
                </div>

                <div className="rounded-[20px] bg-white p-5 border border-[#201914]/10 space-y-2">
                  <div className="flex items-center justify-between text-[#201914]/60 font-inter text-[12px] uppercase tracking-[0.06em]">
                    <span>Total Nilai Order</span>
                    <ShieldCheck className="w-4 h-4 text-[#D4A359]" />
                  </div>
                  <div className="font-sans text-3xl font-semibold">
                    {formatRupiah(totalOmset)}
                  </div>
                  <p className="font-inter text-[12px] text-[#201914]/60">
                    Dari {activeOrders.length} transaksi aktif
                  </p>
                </div>

                <div className="rounded-[20px] bg-white p-5 border border-[#201914]/10 space-y-2">
                  <div className="flex items-center justify-between text-[#201914]/60 font-inter text-[12px] uppercase tracking-[0.06em]">
                    <span>Katalog &amp; Stok</span>
                    <Package className="w-4 h-4 text-[#2D3622]" />
                  </div>
                  <div className="font-sans text-3xl font-semibold">
                    {totalStock} Pot
                  </div>
                  <p className="font-inter text-[12px] text-[#201914]/60">
                    {activeProductsCount} varian produk aktif
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#201914] text-[#F1E6D8] p-5 border border-[#201914] space-y-2">
                  <div className="flex items-center justify-between text-[#F1E6D8]/65 font-inter text-[12px] uppercase tracking-[0.06em]">
                    <span>Batch Uji Lab</span>
                    <FlaskConical className="w-4 h-4 text-[#D4A359]" />
                  </div>
                  <div className="font-sans text-3xl font-semibold">
                    {passedBatchesCount} / {batches.length}
                  </div>
                  <p className="font-inter text-[12px] text-[#D4A359]">
                    Lulus QC Teknologi Farmasi
                  </p>
                </div>
              </div>

              {/* Quick Previews */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-[22px] bg-white p-6 border border-[#201914]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-sans text-lg font-medium">
                      Pesanan Terbaru
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab("pesanan")}
                      className="font-inter text-[12px] font-semibold text-[#2D3622] hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="font-inter text-[13px] text-[#201914]/55 py-6 text-center">
                      Belum ada pesanan masuk.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {orders.slice(0, 4).map((o) => {
                        const meta = ORDER_STATUS_META[o.status];
                        return (
                          <div
                            key={o.id}
                            className="p-3.5 rounded-[14px] bg-[#F1E6D8]/45 border border-[#201914]/5 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="font-inter text-[13px] font-semibold truncate">
                                {o.customerName} •{" "}
                                <span className="font-mono text-[12px] font-normal text-[#201914]/65">
                                  {o.orderNumber}
                                </span>
                              </div>
                              <div className="font-inter text-[12px] text-[#201914]/60">
                                {formatRupiah(o.totalAmount)} •{" "}
                                {formatDateID(o.createdAt)}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full border font-inter text-[11px] font-medium shrink-0 ${meta.badgeClass}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-[22px] bg-white p-6 border border-[#201914]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-sans text-lg font-medium">
                      Batch Uji Lab Farmasi Terbaru
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab("lab")}
                      className="font-inter text-[12px] font-semibold text-[#2D3622] hover:underline"
                    >
                      Kelola Batch
                    </button>
                  </div>

                  {batches.length === 0 ? (
                    <p className="font-inter text-[13px] text-[#201914]/55 py-6 text-center">
                      Belum ada data batch uji lab.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {batches.slice(0, 4).map((b) => {
                        const meta = BATCH_STATUS_META[b.qcStatus];
                        return (
                          <div
                            key={b.id}
                            className="p-3.5 rounded-[14px] bg-[#F1E6D8]/45 border border-[#201914]/5 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="font-inter text-[13px] font-semibold flex items-center gap-2">
                                <span className="font-mono">{b.batchCode}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full border text-[10px] ${meta.badgeClass}`}
                                >
                                  {meta.label}
                                </span>
                              </div>
                              <div className="font-inter text-[12px] text-[#201914]/65 truncate">
                                pH {b.phLevel} • Hedonik {b.hedonicScore}/5.0 •{" "}
                                {b.productName}
                              </div>
                            </div>
                            <Link
                              href={`/batch/${encodeURIComponent(b.batchCode)}`}
                              target="_blank"
                              className="p-2 rounded-full bg-white border border-[#201914]/10 hover:bg-[#201914] hover:text-[#F1E6D8] transition-colors shrink-0"
                              title="Buka halaman sertifikat batch"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PESANAN */}
          {activeTab === "pesanan" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
                  Manajemen Pesanan
                </h1>
                <p className="font-inter text-[13px] sm:text-[14px] text-[#201914]/65">
                  Pantau transaksi masuk dan perbarui status proses pengiriman.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#201914]/45 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Cari kode order, nama, nomor WA, kota..."
                    className="w-full h-[44px] pl-10 pr-4 rounded-full bg-white border border-[#201914]/12 font-inter text-[13px] focus:outline-none focus:border-[#2D3622]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {(
                    [
                      "ALL",
                      "PENDING",
                      "CONFIRMED",
                      "PAID",
                      "SHIPPED",
                      "COMPLETED",
                      "CANCELLED",
                    ] as const
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3.5 py-2 rounded-full font-inter text-[12px] font-medium whitespace-nowrap transition-colors border ${
                        orderStatusFilter === st
                          ? "bg-[#201914] text-[#F1E6D8] border-[#201914]"
                          : "bg-white text-[#201914]/75 border-[#201914]/10 hover:bg-white/80"
                      }`}
                    >
                      {st === "ALL" ? "Semua" : ORDER_STATUS_META[st].label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="rounded-[20px] bg-white border border-[#201914]/10 p-10 text-center font-inter text-[14px] text-[#201914]/60">
                  Tidak ada pesanan yang cocok dengan filter saat ini.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const meta = ORDER_STATUS_META[order.status];
                    const cleanWa = cleanPhoneNumber(order.customerPhone);
                    const waReplyText = encodeURIComponent(
                      `Halo Kak ${order.customerName}, kami dari Glam & Glow ingin mengonfirmasi pesanan ${order.orderNumber} senilai ${formatRupiah(
                        order.totalAmount
                      )}.`
                    );
                    return (
                      <div
                        key={order.id}
                        className="rounded-[20px] bg-white border border-[#201914]/10 p-5 sm:p-6 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#201914]/8">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-[13px] font-semibold px-3 py-1 rounded-full bg-[#F1E6D8] text-[#201914]">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full border font-inter text-[11px] font-medium ${meta.badgeClass}`}
                            >
                              {meta.label}
                            </span>
                            <span className="font-inter text-[12px] text-[#201914]/55">
                              {formatDateTimeID(order.createdAt)}
                            </span>
                          </div>

                          <div className="font-sans text-xl font-semibold text-[#201914]">
                            {formatRupiah(order.totalAmount)}
                          </div>
                        </div>

                        {order.status === "CONFIRMED" && (
                          <div className="p-3.5 rounded-[14px] bg-amber-500/10 border border-amber-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 font-inter text-[12px] sm:text-[13px] text-amber-950">
                              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                              <span>
                                <strong>Membutuhkan Konfirmasi:</strong> Pembeli
                                telah menyelesaikan tahap pembayaran dan mencetak
                                struk pesanan ini.
                              </span>
                            </div>
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleStatusChange(order.id, "PAID")}
                              className="px-4 py-2 rounded-full bg-[#2D3622] hover:bg-[#201914] text-[#F1E6D8] font-inter text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A359]" />
                              <span>Konfirmasi Pembayaran</span>
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-inter text-[13px]">
                          <div className="space-y-1">
                            <span className="text-[11px] uppercase tracking-wider text-[#201914]/50 block">
                              Pemesan
                            </span>
                            <p className="font-semibold text-[15px]">
                              {order.customerName}
                            </p>
                            <p className="text-[#201914]/75">
                              {order.customerPhone}
                            </p>
                            {order.customerEmail && (
                              <p className="text-[#201914]/60 text-[12px]">
                                {order.customerEmail}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[11px] uppercase tracking-wider text-[#201914]/50 block">
                              Alamat Pengiriman
                            </span>
                            <p className="text-[#201914]/85 leading-relaxed flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#2D3622] shrink-0 mt-1" />
                              <span>
                                {order.shippingAddress}
                                {order.cityOrDistrict
                                  ? ` (${order.cityOrDistrict})`
                                  : ""}
                              </span>
                            </p>
                            {order.notes && (
                              <p className="text-[12px] text-[#201914]/65 bg-[#F1E6D8]/60 p-2 rounded-[8px] mt-1">
                                Catatan: {order.notes}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[11px] uppercase tracking-wider text-[#201914]/50 block">
                              Item Pesanan
                            </span>
                            {order.items.map((it) => (
                              <div
                                key={it.id}
                                className="flex justify-between gap-2 text-[12px]"
                              >
                                <span className="text-[#201914]/80">
                                  {it.productName} × {it.quantity}
                                </span>
                                <span className="font-medium shrink-0">
                                  {formatRupiah(it.subtotal)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#201914]/8 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="font-inter text-[12px] text-[#201914]/65">
                              Ubah Status:
                            </label>
                            <CustomSelect
                              disabled={isPending}
                              value={order.status}
                              variant="pill-light"
                              className="min-w-[195px]"
                              onChange={(val) =>
                                handleStatusChange(order.id, val as OrderStatus)
                              }
                              options={(
                                Object.keys(ORDER_STATUS_META) as OrderStatus[]
                              ).map((statusKey) => ({
                                value: statusKey,
                                label: ORDER_STATUS_META[statusKey].label,
                              }))}
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/struk/${encodeURIComponent(order.orderNumber)}`}
                              target="_blank"
                              className="px-3.5 py-2 rounded-full bg-[#F1E6D8]/80 hover:bg-[#F1E6D8] text-[#201914] font-inter text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Receipt className="w-3.5 h-3.5 text-[#2D3622]" />
                              <span>Lihat Struk</span>
                            </Link>

                            <a
                              href={`https://wa.me/${cleanWa}?text=${waReplyText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-full bg-[#2D3622] hover:bg-[#201914] text-[#F1E6D8] font-inter text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-[#D4A359]" />
                              <span>Chat Pembeli</span>
                            </a>

                            {confirmDeleteId === order.id ? (
                              <div className="inline-flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/30">
                                <span className="font-inter text-[11px] text-red-900 font-medium">
                                  Hapus?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-semibold"
                                >
                                  Ya
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-0.5 rounded-full bg-white text-[#201914] text-[11px]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(order.id)}
                                className="p-2 rounded-full border border-[#201914]/12 text-[#201914]/55 hover:text-red-600 hover:border-red-300 transition-colors"
                                aria-label={`Hapus pesanan ${order.orderNumber}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUK & STOK */}
          {activeTab === "produk" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
                    Katalog Produk &amp; Stok
                  </h1>
                  <p className="font-inter text-[13px] sm:text-[14px] text-[#201914]/65">
                    Tambah varian, atur harga, dan pantau ketersediaan stok pot.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setProductModal({ open: true, item: null })}
                  className="px-5 py-3 rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[13px] font-semibold inline-flex items-center gap-2 transition-colors w-fit"
                >
                  <Plus className="w-4 h-4 text-[#D4A359]" />
                  <span>Tambah Produk</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className={`rounded-[20px] bg-white border p-5 flex flex-col justify-between gap-4 ${
                      prod.isActive
                        ? "border-[#201914]/10"
                        : "border-red-300 bg-white/60 opacity-75"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3.5">
                        <div className="relative w-16 h-16 rounded-[12px] bg-[#2D3622] shrink-0 overflow-hidden">
                          <Image
                            src={prod.imageUrl || "/images/glam/jar-studio-pedestal.jpg"}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F1E6D8] font-inter text-[10px] font-semibold text-[#201914]">
                              {prod.category}
                            </span>
                            {!prod.isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-red-100 font-inter text-[10px] font-semibold text-red-700">
                                Nonaktif
                              </span>
                            )}
                          </div>
                          <h3 className="font-sans text-[16px] font-semibold leading-snug">
                            {prod.name}
                          </h3>
                          <p className="font-inter text-[12px] text-[#201914]/60 truncate">
                            {prod.tagline}
                          </p>
                        </div>
                      </div>

                      <p className="font-inter text-[12px] text-[#201914]/70 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#201914]/8 space-y-3">
                      <div className="flex items-center justify-between font-inter text-[13px]">
                        <div>
                          <span className="font-sans text-lg font-semibold">
                            {formatRupiah(prod.price)}
                          </span>
                          <span className="text-[12px] text-[#201914]/55 ml-1.5">
                            / {prod.weightGram}g
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            prod.stock < 20
                              ? "bg-amber-100 text-amber-900"
                              : "bg-emerald-100 text-emerald-900"
                          }`}
                        >
                          Stok: {prod.stock}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setProductModal({ open: true, item: prod })
                          }
                          className="flex-1 py-2 rounded-full bg-[#F1E6D8] hover:bg-[#D7D1C3] font-inter text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {confirmDeleteId === prod.id ? (
                          <div className="inline-flex items-center gap-1 bg-red-500/10 px-2.5 py-1.5 rounded-full border border-red-500/30">
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-semibold"
                            >
                              Hapus
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 rounded-full bg-white text-[#201914] text-[11px]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(prod.id)}
                            className="p-2 rounded-full border border-[#201914]/12 text-[#201914]/55 hover:text-red-600 hover:border-red-300 transition-colors"
                            aria-label={`Hapus produk ${prod.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: UJI LAB FARMASI */}
          {activeTab === "lab" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
                    Rekam Uji Lab Teknologi Farmasi
                  </h1>
                  <p className="font-inter text-[13px] sm:text-[14px] text-[#201914]/65">
                    Data kualitas sediaan per batch produksi (pH, organoleptik,
                    uji iritasi, hedonik) untuk integrasi lintas bidang PLB.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setBatchModal({ open: true, item: null })}
                  className="px-5 py-3 rounded-full bg-[#2D3622] hover:bg-[#201914] text-[#F1E6D8] font-inter text-[13px] font-semibold inline-flex items-center gap-2 transition-colors w-fit"
                >
                  <Plus className="w-4 h-4 text-[#D4A359]" />
                  <span>Tambah Batch Uji Lab</span>
                </button>
              </div>

              {batches.length === 0 ? (
                <div className="rounded-[20px] bg-white border border-[#201914]/10 p-10 text-center font-inter text-[14px] text-[#201914]/60">
                  Belum ada catatan batch uji lab. Klik &ldquo;Tambah Batch Uji Lab&rdquo;
                  untuk mencatat hasil evaluasi tim Farmasi.
                </div>
              ) : (
                <div className="space-y-4">
                  {batches.map((batch) => {
                    const meta = BATCH_STATUS_META[batch.qcStatus];
                    return (
                      <div
                        key={batch.id}
                        className="rounded-[22px] bg-white border border-[#201914]/10 p-5 sm:p-6 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#201914]/8">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="font-mono text-[14px] font-semibold px-3 py-1 rounded-full bg-[#201914] text-[#F1E6D8]">
                                {batch.batchCode}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full border font-inter text-[11px] font-semibold ${meta.badgeClass}`}
                              >
                                {meta.label}
                              </span>
                            </div>
                            <h3 className="font-sans text-lg font-medium pt-1">
                              {batch.productName}
                            </h3>
                          </div>

                          <div className="font-inter text-[12px] text-[#201914]/65 sm:text-right space-y-0.5">
                            <p>
                              Produksi:{" "}
                              <strong className="text-[#201914]">
                                {formatDateID(batch.productionDate)}
                              </strong>
                            </p>
                            <p>
                              Masa Simpan (BUD):{" "}
                              <strong className="text-[#201914]">
                                {formatDateID(batch.expiryDate)}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-inter text-[12px]">
                          <div className="p-3 rounded-[12px] bg-[#F1E6D8]/50">
                            <span className="text-[#201914]/55 block mb-0.5">
                              pH Sediaan
                            </span>
                            <span className="font-semibold text-[15px] text-[#201914]">
                              {batch.phLevel}
                            </span>
                          </div>
                          <div className="p-3 rounded-[12px] bg-[#F1E6D8]/50">
                            <span className="text-[#201914]/55 block mb-0.5">
                              Skor Uji Hedonik
                            </span>
                            <span className="font-semibold text-[15px] text-[#201914]">
                              {batch.hedonicScore.toFixed(1)} / 5.0
                            </span>
                          </div>
                          <div className="p-3 rounded-[12px] bg-[#F1E6D8]/50">
                            <span className="text-[#201914]/55 block mb-0.5">
                              Homogenitas
                            </span>
                            <span className="font-medium text-[#201914]">
                              {batch.homogeneity}
                            </span>
                          </div>
                          <div className="p-3 rounded-[12px] bg-[#F1E6D8]/50">
                            <span className="text-[#201914]/55 block mb-0.5">
                              Uji Iritasi
                            </span>
                            <span className="font-medium text-[#201914]">
                              {batch.irritationTest}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-inter text-[12px] text-[#201914]/80">
                          <div>
                            <span className="text-[#201914]/50 block">
                              Organoleptik Warna
                            </span>
                            <span>{batch.colorResult}</span>
                          </div>
                          <div>
                            <span className="text-[#201914]/50 block">
                              Organoleptik Aroma
                            </span>
                            <span>{batch.aromaResult}</span>
                          </div>
                          <div>
                            <span className="text-[#201914]/50 block">
                              Organoleptik Tekstur
                            </span>
                            <span>{batch.textureResult}</span>
                          </div>
                        </div>

                        {batch.notes && (
                          <p className="font-inter text-[12px] text-[#201914]/70 bg-[#F1E6D8]/40 p-3 rounded-[10px]">
                            Catatan Formulator ({batch.formulatorName}):{" "}
                            {batch.notes}
                          </p>
                        )}

                        <div className="pt-3 border-t border-[#201914]/8 flex flex-wrap items-center justify-between gap-3">
                          <Link
                            href={`/batch/${encodeURIComponent(batch.batchCode)}`}
                            target="_blank"
                            className="px-4 py-2 rounded-full bg-[#F1E6D8] hover:bg-[#D7D1C3] font-inter text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka Halaman Uji Lab Publik</span>
                          </Link>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setBatchModal({ open: true, item: batch })
                              }
                              className="px-4 py-2 rounded-full border border-[#201914]/15 hover:bg-[#201914] hover:text-[#F1E6D8] font-inter text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Batch</span>
                            </button>

                            {confirmDeleteId === batch.id ? (
                              <div className="inline-flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/30">
                                <span className="font-inter text-[11px] text-red-900 font-medium">
                                  Hapus?
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBatch(batch.id)}
                                  className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-semibold"
                                >
                                  Ya
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-0.5 rounded-full bg-white text-[#201914] text-[11px]"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(batch.id)}
                                className="p-2 rounded-full border border-[#201914]/12 text-[#201914]/55 hover:text-red-600 hover:border-red-300 transition-colors"
                                aria-label={`Hapus batch ${batch.batchCode}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EDIT KONTEN SEMUA HALAMAN */}
          {activeTab === "halaman" && (
            <AdminPagesEditor
              initialContent={siteContent}
              onNotify={notify}
              onSaved={() => startTransition(() => router.refresh())}
            />
          )}

          {/* TAB 6: PENGATURAN */}
          {activeTab === "pengaturan" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
                  Keamanan &amp; Status Neon DB
                </h1>
                <p className="font-inter text-[13px] sm:text-[14px] text-[#201914]/65">
                  Status sinkronisasi otomatis GitHub → Vercel Build → Neon
                  PostgreSQL serta pengaturan akun admin.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Update Admin Account & Password Card (DB) */}
                <div className="rounded-[22px] bg-white border border-[#201914]/10 p-6 space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-sans text-lg font-medium">
                      Ubah Username &amp; Sandi Admin (Database)
                    </h2>
                    <p className="font-inter text-[12px] text-[#201914]/60">
                      Tersimpan langsung ke tabel <code className="text-[#2D3622]">AdminUser</code> di database PostgreSQL/Neon.
                    </p>
                  </div>
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-3.5 font-inter text-[13px]"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[#201914]/75 font-medium">
                          Username Login
                        </label>
                        <input
                          type="text"
                          required
                          minLength={3}
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#F1E6D8]/45 border border-[#201914]/15 focus:outline-none focus:border-[#201914]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[#201914]/75 font-medium">
                          Nama Tampilan
                        </label>
                        <input
                          type="text"
                          required
                          value={editDisplayName}
                          onChange={(e) => setEditDisplayName(e.target.value)}
                          className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#F1E6D8]/45 border border-[#201914]/15 focus:outline-none focus:border-[#201914]"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[#201914]/75 font-medium">
                        Sandi Saat Ini *
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#F1E6D8]/45 border border-[#201914]/15 focus:outline-none focus:border-[#201914]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[#201914]/75 font-medium">
                        Sandi Baru (Opsional, min. 6 karakter)
                      </label>
                      <input
                        type="password"
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Kosongkan jika hanya mengganti username"
                        className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#F1E6D8]/45 border border-[#201914]/15 focus:outline-none focus:border-[#201914]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[#201914]/75 font-medium">
                        Ulangi Sandi Baru
                      </label>
                      <input
                        type="password"
                        minLength={6}
                        required={Boolean(newPassword)}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-[44px] px-3.5 rounded-[10px] bg-[#F1E6D8]/45 border border-[#201914]/15 focus:outline-none focus:border-[#201914]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={changingPass}
                      className="px-6 py-2.5 rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-semibold transition-colors disabled:opacity-50"
                    >
                      {changingPass ? "Menyimpan..." : "Simpan Akun ke Database"}
                    </button>
                  </form>
                </div>

                {/* Environment Status Card */}
                <div className="rounded-[22px] bg-[#201914] text-[#F1E6D8] p-6 space-y-4">
                  <h2 className="font-sans text-lg font-medium">
                    Checklist Integrasi Vercel + Neon
                  </h2>
                  <div className="space-y-2.5 font-inter text-[13px]">
                    {[
                      {
                        label: "Environment Variable DATABASE_URL",
                        ok: envChecklist.hasDatabaseUrl,
                      },
                      {
                        label: "Koneksi Aktif Neon PostgreSQL",
                        ok: envChecklist.isDbConnected,
                      },
                      {
                        label: "ADMIN_SESSION_SECRET Terkonfigurasi",
                        ok: envChecklist.hasSessionSecret,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="p-3 rounded-[12px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-between gap-2"
                      >
                        <span className="text-[#F1E6D8]/85">{row.label}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            row.ok
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {row.ok ? "Aktif" : "Belum Diatur"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="font-inter text-[12px] text-[#F1E6D8]/65 leading-relaxed">
                    Setiap kali Anda push ke GitHub dan men-deploy di Vercel,
                    script <code className="text-[#D4A359]">vercel-db-sync.mjs</code>{" "}
                    otomatis menjalankan <code className="text-[#D4A359]">prisma db push</code>{" "}
                    dan <code className="text-[#D4A359]">seed-db.mjs</code> ke database
                    Neon tanpa merusak data yang sudah diubah Admin.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {productModal.open && (
        <AdminProductModal
          product={productModal.item}
          onClose={() => setProductModal({ open: false, item: null })}
          onSaved={(msg) => {
            setProductModal({ open: false, item: null });
            refreshAfterMutation(msg);
          }}
          onError={(msg) => notify("error", msg)}
        />
      )}

      {/* Lab Batch Modal */}
      {batchModal.open && (
        <AdminBatchModal
          batch={batchModal.item}
          products={products}
          onClose={() => setBatchModal({ open: false, item: null })}
          onSaved={(msg) => {
            setBatchModal({ open: false, item: null });
            refreshAfterMutation(msg);
          }}
          onError={(msg) => notify("error", msg)}
        />
      )}
    </div>
  );
}

