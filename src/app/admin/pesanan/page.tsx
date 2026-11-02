import React from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Layers,
  ArrowLeft,
  DollarSign,
  Database,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatRupiah, cleanPhoneNumber } from "@/lib/utils";
import {
  Reveal,
  StaggerContainer,
  StaggerItem,
  Magnetic,
  RollingText,
} from "@/components/ui/Animations";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard Pesanan • Glam & Glow",
  description:
    "Panel internal manajemen pesanan lulur Badda Lotong Glam & Glow.",
};

interface OrderWithItems {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  cityOrDistrict: string | null;
  notes: string | null;
  totalAmount: number;
  status: string;
  channel: string;
  createdAt: Date;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product?: {
      name: string;
    };
  }>;
}

// Data simulasi jika PostgreSQL lokal belum dinyalakan/diconfigure
const FALLBACK_ORDERS: OrderWithItems[] = [
  {
    id: "sample-1",
    orderNumber: "GG-20241030-01",
    customerName: "Siti Rahmawati",
    customerPhone: "081234567890",
    customerEmail: "siti.rahma@gmail.com",
    shippingAddress: "Jl. Boulevard Panakkukang No. 12, Kel. Masale",
    cityOrDistrict: "Kota Makassar",
    notes: "Tolong kirim yang packing extra bubble wrap ya kak.",
    totalAmount: 70000,
    status: "CONFIRMED",
    channel: "WHATSAPP",
    createdAt: new Date(),
    items: [
      {
        id: "item-1",
        quantity: 2,
        unitPrice: 35000,
        subtotal: 70000,
        product: { name: "Glam & Glow Lulur Badda Lotong (400g)" },
      },
    ],
  },
  {
    id: "sample-2",
    orderNumber: "GG-20241030-02",
    customerName: "Andi Nurhaliza",
    customerPhone: "085299887766",
    customerEmail: null,
    shippingAddress: "Jl. Somba Opu No. 45",
    cityOrDistrict: "Kota Makassar",
    notes: "Mau coba variasi dicampur susu bear brand.",
    totalAmount: 35000,
    status: "PENDING",
    channel: "WHATSAPP",
    createdAt: new Date(Date.now() - 3600000 * 4),
    items: [
      {
        id: "item-2",
        quantity: 1,
        unitPrice: 35000,
        subtotal: 35000,
        product: { name: "Glam & Glow Lulur Badda Lotong (400g)" },
      },
    ],
  },
];

export default async function AdminPesananPage() {
  let orders: OrderWithItems[] = [];
  let isUsingFallback = false;
  let dbError = "";

  try {
    const dbOrders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (dbOrders.length > 0) {
      orders = dbOrders as unknown as OrderWithItems[];
    } else {
      orders = FALLBACK_ORDERS;
      isUsingFallback = true;
    }
  } catch (err: unknown) {
    console.error("Gagal membaca database PostgreSQL:", err);
    orders = FALLBACK_ORDERS;
    isUsingFallback = true;
    dbError =
      err instanceof Error
        ? err.message
        : "Koneksi database PostgreSQL belum aktif";
  }

  const totalOmset = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPots = orders.reduce(
    (acc, curr) =>
      acc + curr.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="pt-28 pb-20 px-3 sm:px-6 max-w-[1440px] mx-auto space-y-10">
      {/* Top Header */}
      <Reveal direction="up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#201914]/10 pb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-inter font-semibold text-[#5C4D44] hover:text-[#201914] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Utama</span>
            </Link>
            <h1 className="font-sans text-3xl sm:text-5xl font-normal text-[#201914] tracking-tight">
              Panel Pesanan Masuk (Admin)
            </h1>
            <p className="text-xs sm:text-sm text-[#5C4D44] mt-1 font-light">
              Monitoring transaksi pelanggan @4saudarakukisuksesemua27 secara
              real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.22}>
              <Link
                href="/pesan"
                className="group/roll px-5 py-3 rounded-full bg-[#201914] text-[#F1E6D8] text-xs sm:text-sm font-inter font-semibold hover:bg-[#32160C] transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-[#D4A359]" />
                <RollingText text="Uji Bikin Order Baru" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>

      {/* Alert Status Database */}
      {isUsingFallback && (
        <Reveal direction="up" delay={0.1}>
          <div className="rounded-[20px] p-5 bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-[#201914] space-y-1">
              <span className="font-bold block text-amber-900">
                Menampilkan Data Simulasi / Mode Pratinjau
              </span>
              <p className="text-[#5C4D44] font-light">
                {dbError
                  ? `PostgreSQL belum terhubung (${dbError}). Website tetap beroperasi penuh dengan mengarahkan pembeli langsung ke WhatsApp resmi penjual!`
                  : "Database belum memiliki riwayat pesanan nyata. Tampilan di bawah menggunakan data sampel simulasi."}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Metric Summary Cards */}
      <StaggerContainer
        staggerDelay={0.1}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StaggerItem>
          <div className="bg-white/95 backdrop-blur-sm rounded-[20px] p-6 border border-[#201914]/10 hover:border-[#201914]/25 transition-colors space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-inter text-[#5C4D44]">
              <span>Total Pesanan Masuk</span>
              <Layers className="w-4 h-4 text-[#201914]" />
            </div>
            <div className="text-2xl sm:text-3xl font-sans font-semibold text-[#201914]">
              {orders.length} Transaksi
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white/95 backdrop-blur-sm rounded-[20px] p-6 border border-[#201914]/10 hover:border-[#201914]/25 transition-colors space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-inter text-[#5C4D44]">
              <span>Total Pot Terjual</span>
              <Package className="w-4 h-4 text-[#D4A359]" />
            </div>
            <div className="text-2xl sm:text-3xl font-sans font-semibold text-[#201914]">
              {totalPots} Pot (400g)
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white/95 backdrop-blur-sm rounded-[20px] p-6 border border-[#201914]/10 hover:border-[#201914]/25 transition-colors space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-inter text-[#5C4D44]">
              <span>Total Nilai Transaksi</span>
              <DollarSign className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-sans font-semibold text-[#201914]">
              {formatRupiah(totalOmset)}
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white/95 backdrop-blur-sm rounded-[20px] p-6 border border-[#201914]/10 hover:border-[#201914]/25 transition-colors space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-inter text-[#5C4D44]">
              <span>Menunggu Konfirmasi</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-sans font-semibold text-[#201914]">
              {pendingCount} Pesanan
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* Order List Cards */}
      <div className="space-y-4">
        <Reveal direction="up">
          <h2 className="font-sans text-2xl sm:text-3xl font-normal text-[#201914]">
            Daftar Rincian Pesanan
          </h2>
        </Reveal>

        <StaggerContainer staggerDelay={0.12} className="space-y-4">
          {orders.map((order) => {
            const cleanPhone = cleanPhoneNumber(order.customerPhone);
            const followUpMessage = encodeURIComponent(
              `Halo Kak ${order.customerName}, terima kasih sudah memesan Glam & Glow Lulur Badda Lotong dengan nomor order #${order.orderNumber}. Kami dari admin 4 Saudara Kuki Sukses ingin mengonfirmasi rincian pengiriman Anda.`
            );
            const waFollowUpUrl = `https://wa.me/${cleanPhone}?text=${followUpMessage}`;

            return (
              <StaggerItem key={order.id}>
                <div className="bg-white/95 backdrop-blur-sm rounded-[24px] p-6 sm:p-8 border border-[#201914]/10 hover:border-[#201914]/25 transition-all duration-300 space-y-5">
                  {/* Header Card Order */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#201914]/5 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-inter text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full bg-[#201914]/5 text-[#201914]">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-xs font-inter font-bold uppercase tracking-wide px-3 py-0.5 rounded-full ${
                          order.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-inter text-[#5C4D44]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-[#5C4D44]">
                    {/* Pemesan */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-inter uppercase font-bold tracking-wide text-[#201914]/60 block">
                        Data Pemesan:
                      </span>
                      <p className="font-semibold text-sm text-[#201914]">
                        {order.customerName}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#D4A359]" />
                        <span>{order.customerPhone}</span>
                      </p>
                      {order.customerEmail && <p>{order.customerEmail}</p>}
                    </div>

                    {/* Alamat Pengiriman */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-inter uppercase font-bold tracking-wide text-[#201914]/60 block">
                        Alamat Kirim:
                      </span>
                      <p className="flex items-start gap-1.5 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-[#D4A359] shrink-0 mt-0.5" />
                        <span>
                          {order.shippingAddress}
                          {order.cityOrDistrict
                            ? `, ${order.cityOrDistrict}`
                            : ""}
                        </span>
                      </p>
                      {order.notes && (
                        <p className="text-xs italic bg-[#FAF6F0] p-2.5 rounded-xl text-[#201914]/80 mt-1">
                          Catatan: &ldquo;{order.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Item & Total */}
                    <div className="space-y-2 bg-[#FAF6F0] p-4 rounded-2xl border border-[#201914]/5 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-inter uppercase font-bold tracking-wide text-[#201914]/60 block">
                          Item Pesanan:
                        </span>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="mt-1 flex justify-between font-medium text-[#201914]"
                          >
                            <span>{item.quantity}x Pot Glam & Glow (400g)</span>
                            <span>{formatRupiah(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#201914]/10 flex items-center justify-between">
                        <span className="font-bold text-[#201914]">Total:</span>
                        <span className="font-sans font-bold text-base sm:text-lg text-[#201914]">
                          {formatRupiah(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#201914]/5">
                    <span className="text-xs sm:text-sm font-inter text-[#5C4D44]">
                      Channel Pemesanan: <strong>{order.channel}</strong>
                    </span>

                    <a
                      href={waFollowUpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D3622] hover:bg-[#1E2416] text-white text-xs sm:text-sm font-inter font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#D4A359]" />
                      <span>Follow Up ke WhatsApp Pembeli</span>
                    </a>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
