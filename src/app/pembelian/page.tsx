"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Receipt, ShieldCheck, ShoppingBag } from "lucide-react";
import OrderForm from "@/components/order/OrderForm";
import { useSiteContent } from "@/context/SiteContentContext";

export default function PembelianPage() {
  const { pesan } = useSiteContent();
  return (
    <div className="w-full bg-[#F1E6D8] pt-28 pb-14 px-2 sm:px-3 overflow-x-clip">
      <div className="max-w-[1560px] mx-auto space-y-5">
        {/* Clean Checkout Header */}
        <div className="rounded-[24px] bg-[#201914] text-[#F1E6D8] p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <Link
              href="/produk"
              className="inline-flex items-center gap-1.5 font-inter text-[12px] text-[#F1E6D8]/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Katalog Produk</span>
            </Link>
            <h1 className="font-sans text-3xl sm:text-5xl font-normal tracking-[-0.03em] leading-[1.1]">
              {pesan.pembelianTitle}
            </h1>
            <p className="font-inter text-[14px] sm:text-[15px] text-[#F1E6D8]/75">
              {pesan.pembelianSubtitle}
            </p>
          </div>

          {/* 3-Step Flow Indicator */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 font-inter text-[12px] shrink-0">
            <div className="px-3.5 py-3 rounded-[16px] bg-[#2D3622] border border-[#D4A359]/40 space-y-1">
              <ShoppingBag className="w-4 h-4 text-[#D4A359]" />
              <span className="block font-semibold">1. Pengiriman</span>
              <span className="block text-[11px] text-[#F1E6D8]/75">
                Produk &amp; alamat
              </span>
            </div>
            <div className="px-3.5 py-3 rounded-[16px] bg-white/[0.06] border border-white/[0.08] space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#D4A359]" />
              <span className="block font-semibold">2. Pembayaran</span>
              <span className="block text-[11px] text-[#F1E6D8]/60">
                Metode &amp; rincian
              </span>
            </div>
            <div className="px-3.5 py-3 rounded-[16px] bg-white/[0.06] border border-white/[0.08] space-y-1">
              <Receipt className="w-4 h-4 text-[#D4A359]" />
              <span className="block font-semibold">3. Struk &amp; WA</span>
              <span className="block text-[11px] text-[#F1E6D8]/60">
                Konfirmasi akhir
              </span>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <OrderForm variant="checkout" />
      </div>
    </div>
  );
}

