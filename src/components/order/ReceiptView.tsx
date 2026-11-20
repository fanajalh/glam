"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  Printer,
  ShoppingBag,
  ArrowLeft,
  Receipt,
  MapPin,
} from "lucide-react";
import { calculateOrderTotals } from "@/lib/constants";
import { useSiteContent } from "@/context/SiteContentContext";
import { formatRupiah } from "@/lib/utils";

export interface ReceiptPayload {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  cityOrDistrict: string | null;
  shippingMethod?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes: string | null;
  totalAmount: number;
  status: string;
  whatsAppUrl: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

const STATUS_BADGE_MAP: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  CONFIRMED: "Membutuhkan Konfirmasi Admin",
  PAID: "Pembayaran Terverifikasi",
  SHIPPED: "Dalam Pengiriman",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

function formatReceiptDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReceiptView({
  orderCode,
  serverReceipt,
}: {
  orderCode: string;
  serverReceipt: ReceiptPayload | null;
}) {
  const [receipt, setReceipt] = useState<ReceiptPayload | null>(serverReceipt);
  const [copied, setCopied] = useState(false);
  const { payment } = useSiteContent();

  useEffect(() => {
    if (serverReceipt) return;
    try {
      const cached = sessionStorage.getItem(`gg_receipt_${orderCode}`);
      if (cached) {
        setReceipt(JSON.parse(cached) as ReceiptPayload);
      }
    } catch {
      // ignore storage failure
    }
  }, [orderCode, serverReceipt]);

  const handleCopy = () => {
    if (!receipt) return;
    const summaryText = [
      `STRUK PEMBELIAN GLAM & GLOW`,
      `No. Struk: ${receipt.orderNumber}`,
      `Tanggal: ${formatReceiptDate(receipt.createdAt)}`,
      `Nama: ${receipt.customerName} (${receipt.customerPhone})`,
      `Alamat: ${receipt.shippingAddress}${receipt.cityOrDistrict ? ` (${receipt.cityOrDistrict})` : ""}`,
      receipt.paymentMethod ? `Metode Pembayaran: ${receipt.paymentMethod}` : "",
      receipt.paymentReference ? `Referensi Pembayaran: ${receipt.paymentReference}` : "",
      `Item: ${receipt.items.map((i) => `${i.name} (${i.quantity}x)`).join(", ")}`,
      `Total Produk: ${formatRupiah(receipt.totalAmount)}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!receipt) {
    return (
      <div className="max-w-xl mx-auto rounded-[28px] bg-[#2B1B1D] text-[#FBF1F2] p-8 sm:p-12 text-center space-y-5 border border-white/[0.08] shadow-xl">
        <div className="w-14 h-14 rounded-full bg-white/[0.08] text-[#E7B6B4] flex items-center justify-center mx-auto">
          <Receipt className="w-7 h-7" />
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-normal">
          Struk Tidak Ditemukan
        </h1>
        <p className="font-inter text-[14px] text-[#FBF1F2]/70 leading-relaxed">
          Nomor struk <strong className="font-mono text-[#E7B6B4]">{orderCode}</strong>{" "}
          belum tercatat atau sesi lokal sudah berakhir.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/pembelian"
            className="px-6 py-3 rounded-full bg-[#FBF1F2] text-[#2B1B1D] font-inter text-[13px] font-semibold"
          >
            Buat Pesanan Baru
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-white/[0.08] text-[#FBF1F2] font-inter text-[13px] font-medium"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[780px] mx-auto space-y-5">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 font-inter text-[13px] font-medium text-[#2B1B1D]/75 hover:text-[#2B1B1D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#2B1B1D]/15 hover:border-[#2B1B1D] text-[#2B1B1D] font-inter text-[12px] font-semibold transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Main Receipt Paper Card */}
      <div className="rounded-[28px] bg-white text-[#2B1B1D] p-6 sm:p-10 lg:p-12 border border-[#2B1B1D]/10 shadow-xl space-y-7">
        {/* Top Stamp & Invoice Code */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-dashed border-[#2B1B1D]/20">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4D2E33] text-[#FBF1F2] font-inter text-[11px] uppercase tracking-[0.12em]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E7B6B4]" />
              <span>Struk Pesanan Resmi</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
              GLAM &amp; GLOW
            </h1>
            <p className="font-inter text-[12px] text-[#2B1B1D]/60">
              Lulur Rempah Tradisional Bugis • Makassar, Sulawesi Selatan
            </p>
          </div>

          <div className="sm:text-right space-y-1 font-inter">
            <span className="text-[11px] uppercase tracking-wider text-[#2B1B1D]/55 block">
              Nomor Struk
            </span>
            <div className="font-mono text-lg sm:text-xl font-bold text-[#2B1B1D] bg-[#FBF1F2] px-3.5 py-1 rounded-full inline-block">
              {receipt.orderNumber}
            </div>
            <p className="text-[12px] text-[#2B1B1D]/60 pt-1">
              {formatReceiptDate(receipt.createdAt)}
            </p>
          </div>
        </div>

        {/* Buyer & Shipping Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-inter text-[13px]">
          <div className="p-4 rounded-[18px] bg-[#FBF1F2]/50 space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#2B1B1D]/55 font-semibold block">
              Data Pembeli
            </span>
            <p className="font-semibold text-[15px]">{receipt.customerName}</p>
            <p className="text-[#2B1B1D]/80">{receipt.customerPhone}</p>
            {receipt.customerEmail && (
              <p className="text-[#2B1B1D]/65 text-[12px]">
                {receipt.customerEmail}
              </p>
            )}
          </div>

          <div className="p-4 rounded-[18px] bg-[#FBF1F2]/50 space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#2B1B1D]/55 font-semibold block">
              Alamat Tujuan
            </span>
            <p className="text-[#2B1B1D]/85 leading-relaxed flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-[#4D2E33] shrink-0 mt-0.5" />
              <span>
                {receipt.shippingAddress}
                {receipt.cityOrDistrict ? ` (${receipt.cityOrDistrict})` : ""}
              </span>
            </p>
          </div>
        </div>

        {/* Method Pills */}
        {(receipt.shippingMethod || receipt.paymentMethod) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-inter text-[13px]">
            {receipt.shippingMethod && (
              <div className="px-4 py-3 rounded-[14px] border border-[#2B1B1D]/10 flex justify-between items-center gap-2">
                <span className="text-[#2B1B1D]/55">Kurir:</span>
                <span className="font-semibold text-right">
                  {receipt.shippingMethod}
                </span>
              </div>
            )}
            {receipt.paymentMethod && (
              <div className="px-4 py-3 rounded-[14px] border border-[#2B1B1D]/10 flex justify-between items-center gap-2">
                <span className="text-[#2B1B1D]/55">Pembayaran:</span>
                <span className="font-semibold text-right">
                  {receipt.paymentMethod}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Line Items Table */}
        <div className="space-y-3">
          <h2 className="font-inter text-[12px] uppercase tracking-[0.1em] text-[#2B1B1D]/60 font-semibold">
            Rincian Pembelian
          </h2>
          <div className="divide-y divide-[#2B1B1D]/10 border-y border-[#2B1B1D]/10">
            {receipt.items.map((item, idx) => (
              <div
                key={idx}
                className="py-3.5 flex items-center justify-between gap-4 font-inter text-[13px] sm:text-[14px]"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[#2B1B1D]">{item.name}</p>
                  <p className="text-[12px] text-[#2B1B1D]/60">
                    {item.quantity} × {formatRupiah(item.unitPrice)}
                  </p>
                </div>
                <span className="font-semibold text-[#2B1B1D] shrink-0">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        {(() => {
          const totals = calculateOrderTotals(
            receipt.totalAmount,
            receipt.paymentMethod,
            receipt.shippingMethod,
            {
              adminFee: payment.adminFee,
              serviceFee: payment.serviceFee,
              codFee: payment.codFee,
              shippingFeeStand: payment.shippingFeeStand,
              shippingFeeLocal: payment.shippingFeeLocal,
              shippingFeeRegular: payment.shippingFeeRegular,
            }
          );

          return (
            <div className="space-y-2 font-inter text-[13px] pt-1">
              <div className="flex justify-between text-[#2B1B1D]/65">
                <span>Biaya Admin</span>
                <span className="font-medium text-[#2B1B1D]">
                  {formatRupiah(totals.adminFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#2B1B1D]/65">
                <span>{totals.serviceFeeLabel}</span>
                <span className="font-medium text-[#2B1B1D]">
                  {formatRupiah(totals.serviceFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#2B1B1D]/65">
                <span>Biaya Pengiriman Paket</span>
                <span className="font-medium text-[#2B1B1D]">
                  {formatRupiah(totals.packageFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#2B1B1D]/65">
                <span>Status Pesanan</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 text-[11px] font-semibold">
                  {STATUS_BADGE_MAP[receipt.status] || "Menunggu Konfirmasi"}
                </span>
              </div>
              {receipt.paymentReference && (
                <div className="flex justify-between text-[#2B1B1D]/65">
                  <span>Referensi Pembayaran</span>
                  <span className="font-medium text-[#2B1B1D] text-right">
                    {receipt.paymentReference}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-[#2B1B1D]/20">
                <span className="font-sans text-lg font-medium">
                  {totals.isCod ? "Total COD & Paket" : "Total Pembayaran"}
                </span>
                <span className="font-sans text-2xl sm:text-3xl font-bold text-[#2B1B1D]">
                  {formatRupiah(totals.grandTotal)}
                </span>
              </div>
            </div>
          );
        })()}

        {receipt.notes && (
          <div className="p-3.5 rounded-[14px] bg-[#FBF1F2]/40 font-inter text-[12px] text-[#2B1B1D]/75">
            <strong>Catatan:</strong> {receipt.notes}
          </div>
        )}

        {/* Confirmation CTA Block: WhatsApp ONLY after getting Struk */}
        <div className="rounded-[22px] bg-[#2B1B1D] text-[#FBF1F2] p-5 sm:p-6 space-y-4 print:hidden">
          <div className="space-y-1">
            <h3 className="font-sans text-lg font-normal text-[#E7B6B4]">
              Langkah Terakhir: Konfirmasi Struk ke Admin
            </h3>
            <p className="font-inter text-[13px] text-[#FBF1F2]/75 leading-relaxed">
              Struk Anda sudah tercatat. Klik tombol di bawah untuk mengirim nomor
              struk{" "}
              <strong className="font-mono text-white">
                {receipt.orderNumber}
              </strong>{" "}
              ke WhatsApp admin guna konfirmasi ongkir dan pembayaran.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={receipt.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[48px] px-6 py-3 rounded-full bg-[#FBF1F2] hover:bg-white text-[#2B1B1D] font-inter text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#4D2E33]" />
              <span>Konfirmasi Struk via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[48px] px-5 py-3 rounded-full bg-white/[0.1] hover:bg-white/[0.18] text-[#FBF1F2] font-inter text-[13px] font-medium inline-flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#E7B6B4]" />
                  <span>Struk Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Struk</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-5 pt-2 print:hidden">
        <Link
          href={`/pembayaran/${encodeURIComponent(receipt.orderNumber)}`}
          className="inline-flex items-center gap-2 font-inter text-[13px] text-[#2B1B1D]/75 hover:text-[#2B1B1D]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Pembayaran</span>
        </Link>
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 font-inter text-[13px] text-[#2B1B1D]/75 hover:text-[#2B1B1D]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Belanja Lagi</span>
        </Link>
      </div>
    </div>
  );
}

