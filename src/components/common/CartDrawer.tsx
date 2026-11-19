"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalCount,
    totalAmount,
    totalWeightGram,
  } = useCart();

  const listRef = useRef<HTMLDivElement>(null);

  // Freeze background page scroll while cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      (window as any).__lenis?.stop();
    } else {
      (window as any).__lenis?.start();
    }
  }, [isCartOpen]);

  // Ensure 100% reliable wheel scrolling inside drawer that never gets hijacked
  useEffect(() => {
    const el = listRef.current;
    if (!el || !isCartOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [isCartOpen, cartItems.length]);

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    router.push("/pembelian");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over Rounded Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative m-2 sm:m-3 w-[calc(100%-16px)] max-w-[448px] h-[calc(100dvh-16px)] sm:h-[calc(100dvh-24px)] rounded-[28px] bg-[#201914] text-[#F1E6D8] border border-white/[0.08] shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
            data-lenis-prevent
          >
            {/* 1. Header (Fixed Height, Shrink-0) */}
            <div className="shrink-0 p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#201914]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#D4A359]" />
                <h2 className="font-sans text-[19px] sm:text-[20px] font-normal tracking-[-0.01em]">
                  Keranjang ({totalCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-[#F1E6D8] flex items-center justify-center transition-colors"
                aria-label="Tutup keranjang"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Top Info Pill (Fixed Height, Shrink-0) */}
            <div className="shrink-0 bg-[#2D3622] px-4 sm:px-5 py-2 font-inter text-[12px] sm:text-[13px] text-[#F1E6D8]/90 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>Kemasan Ramah Lingkungan</span>
              </div>
              <span className="font-medium text-[#D4A359]">Rempah Tradisional Asli</span>
            </div>

            {/* 3. Cart Items List (Scrollable, Flex-1, Never Blocked) */}
            <div
              ref={listRef}
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3 touch-pan-y"
              style={{
                WebkitOverflowScrolling: "touch",
              }}
            >
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-14 h-14 rounded-full bg-white/[0.06] flex items-center justify-center text-[#F1E6D8]/40">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-sans text-[18px] font-normal">
                      Keranjang Anda Kosong
                    </h3>
                    <p className="font-inter text-[13px] text-[#F1E6D8]/60 max-w-[240px]">
                      Pilih produk perawatan tubuh alami Bugis terbaik untuk Anda.
                    </p>
                  </div>
                  <Link
                    href="/produk"
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F1E6D8] text-[#201914] font-inter text-[13px] font-medium hover:bg-white transition-colors mt-2"
                  >
                    <span>Lihat Koleksi Produk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 sm:p-3.5 rounded-[14px] bg-white/[0.04] flex items-center gap-3.5 transition-colors hover:bg-white/[0.06]"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] bg-[#2D3622] overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="min-w-0 pr-1">
                          <h4 className="font-sans text-[14px] sm:text-[15px] font-medium text-[#F1E6D8] truncate">
                            {item.name}
                          </h4>
                          <p className="font-inter text-[11px] sm:text-[12px] text-[#F1E6D8]/50 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#F1E6D8]/40 hover:text-red-400 transition-colors p-0.5 shrink-0"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        {/* Stepper */}
                        <div className="flex items-center gap-1.5 bg-white/[0.06] rounded-full px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[#F1E6D8]/70 hover:text-[#F1E6D8] hover:bg-white/[0.1] transition-colors"
                            aria-label="Kurangi kuantitas"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-inter text-[12px] font-medium text-[#F1E6D8] min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[#F1E6D8]/70 hover:text-[#F1E6D8] hover:bg-white/[0.1] transition-colors"
                            aria-label="Tambah kuantitas"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-inter text-[13px] sm:text-[14px] font-semibold text-[#D4A359]">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* 4. Footer Summary & Checkout Actions (Fixed Height, Shrink-0, ALWAYS Visible) */}
            {cartItems.length > 0 && (
              <div className="shrink-0 p-4 sm:p-5 border-t border-white/[0.08] space-y-3.5 bg-[#201914] z-20">
                {/* Weight & Total */}
                <div className="space-y-1 font-inter text-[12px] sm:text-[13px]">
                  <div className="flex items-center justify-between text-[#F1E6D8]/60">
                    <span>Estimasi Berat Total</span>
                    <span>{(totalWeightGram / 1000).toFixed(1)} kg</span>
                  </div>
                  <div className="flex items-center justify-between text-[#F1E6D8]/60">
                    <span>Ongkos Kirim</span>
                    <span className="text-[#D4A359]">Dihitung saat pemesanan</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                    <span className="font-sans text-[16px] sm:text-[17px] text-[#F1E6D8]">Subtotal</span>
                    <span className="font-sans text-[20px] sm:text-[22px] font-semibold text-[#F1E6D8]">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Checkout Action: Dedicated Purchase Page First (Struk before WhatsApp) */}
                <div className="space-y-2 font-inter">
                  <button
                    onClick={handleGoToCheckout}
                    className="w-full h-[48px] rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                  >
                    <span>Lanjut ke Halaman Pembelian</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-[#F1E6D8]/55">
                    Lanjut ke pembayaran &amp; struk resmi sebelum konfirmasi WhatsApp
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-[11px] text-[#F1E6D8]/50 font-inter pt-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4A359]" /> Garansi Asli
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#D4A359]" /> Kirim Se-Indonesia
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
