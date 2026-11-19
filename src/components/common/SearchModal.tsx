"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { PRODUCT_INFO } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  keywords: string;
  badge: string;
  price?: number;
  image: string;
  type: "product" | "info";
  link: string;
}

const SEARCHABLE_ITEMS: SearchResult[] = [
  {
    id: "prod-main",
    title: PRODUCT_INFO.name,
    subtitle: "Berat bersih 400 gram • 5 bahan alami pilihan • Pemakaian luar",
    keywords:
      "glam glow lulur badda lotong 400g 400 gram pot beli pesan harga 35000",
    badge: "Produk",
    price: PRODUCT_INFO.price,
    image: "/images/glam/jar-studio-pedestal.jpg",
    type: "product",
    link: "/pembelian",
  },
  {
    id: "info-komposisi",
    title: "Komposisi 5 Bahan Alami & Manfaat",
    subtitle:
      "Beras ketan putih, daun pandan, jeruk nipis, kunyit, dan cengkeh",
    keywords:
      "komposisi bahan alami beras ketan putih daun pandan jeruk nipis kunyit cengkeh manfaat",
    badge: "Info Produk",
    image: "/images/glam/jar-ingredients-wood.jpg",
    type: "info",
    link: "/produk",
  },
  {
    id: "info-panduan",
    title: "Cara Penggunaan & Perhatian",
    subtitle:
      "4 langkah pakai lulur hingga pasta dan 5 poin perhatian penyimpanan aman",
    keywords:
      "cara penggunaan pakai pasta air bersih bilas perhatian simpan kering wadah tertutup",
    badge: "Panduan",
    image: "/images/glam/jar-real-hand.jpg",
    type: "info",
    link: "/panduan",
  },
  {
    id: "info-batch",
    title: "Hasil Uji Mutu & Batch Lab",
    subtitle:
      "Data uji pH, warna, aroma, dan homogenitas sediaan Batch GG-BL-2026-01",
    keywords: "uji mutu lab batch ph organoleptik kualitas sertifikat",
    badge: "Uji Mutu",
    image: "/images/glam/jar-powder-texture.jpg",
    type: "info",
    link: "/batch/GG-BL-2026-01",
  },
  {
    id: "info-kontak",
    title: "Pemesanan & Kontak Resmi",
    subtitle:
      "DM Instagram @4saudarakukisuksesemua27, email, WhatsApp, dan formulir order",
    keywords:
      "kontak pesan order whatsapp instagram email @4saudarakukisuksesemua27 formulir",
    badge: "Kontak",
    image: "/images/glam/jar-batik-spices.jpg",
    type: "info",
    link: "/pesan",
  },
];

const SUGGESTED_TAGS = [
  "Lulur Badda Lotong",
  "Komposisi",
  "Cara Penggunaan",
  "Perhatian",
  "Uji Mutu",
  "Kontak",
];

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useCart();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredResults = query.trim()
    ? SEARCHABLE_ITEMS.filter((item) =>
        `${item.title} ${item.subtitle} ${item.keywords} ${item.badge}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : SEARCHABLE_ITEMS;

  // Freeze background page scroll while search modal is open
  useEffect(() => {
    if (isSearchOpen) {
      (window as any).__lenis?.stop();
    } else {
      (window as any).__lenis?.start();
    }
  }, [isSearchOpen]);

  // Ensure 100% reliable wheel scrolling inside search results that never gets hijacked
  useEffect(() => {
    const el = resultsRef.current;
    if (!el || !isSearchOpen) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [isSearchOpen, filteredResults.length]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[640px] bg-[#201914] text-[#F1E6D8] rounded-[24px] shadow-2xl border border-white/[0.08] p-6 sm:p-7 flex flex-col gap-5 z-10 max-h-[85vh] overflow-hidden"
            data-lenis-prevent
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center gap-3 bg-white/[0.06] rounded-full px-5 h-[54px]">
              <Search className="w-5 h-5 text-[#F1E6D8]/50 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk, komposisi bahan, cara pakai, atau info lainnya..."
                className="w-full bg-transparent text-[#F1E6D8] placeholder:text-[#F1E6D8]/40 font-inter text-[15px] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-[#F1E6D8]/50 hover:text-white"
                  aria-label="Hapus kata kunci"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 font-mono text-[11px] text-[#F1E6D8]/60">
                TUTUP
              </kbd>
            </div>

            {/* Keyword Quick Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-inter text-[12px] text-[#F1E6D8]/50 mr-1">
                Pencarian Populer:
              </span>
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.14] font-inter text-[12px] text-[#F1E6D8]/80 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Results List (Scrollable, Flex-1, Never Blocked) */}
            <div
              ref={resultsRef}
              data-lenis-prevent
              className="overflow-y-auto min-h-0 flex-1 space-y-2.5 pr-1 max-h-[420px] overscroll-contain touch-pan-y"
              style={{
                WebkitOverflowScrolling: "touch",
              }}
            >
              {filteredResults.length === 0 ? (
                <div className="py-12 text-center text-[#F1E6D8]/50 space-y-1">
                  <p className="font-inter text-[15px]">
                    Tidak ada informasi yang cocok dengan &quot;{query}&quot;
                  </p>
                  <p className="font-inter text-[13px] text-[#F1E6D8]/40">
                    Coba kata kunci lain seperti &quot;lulur&quot;, &quot;komposisi&quot;, atau &quot;panduan&quot;
                  </p>
                </div>
              ) : (
                filteredResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-[16px] bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-between gap-4 transition-colors group"
                  >
                    <Link
                      href={item.link}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3.5 flex-1 min-w-0"
                    >
                      <div className="relative w-14 h-14 rounded-[12px] bg-[#D7D1C3] overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full font-inter text-[10px] font-medium shrink-0 ${
                              item.type === "product"
                                ? "bg-[#D4A359]/20 text-[#D4A359]"
                                : "bg-white/[0.08] text-[#F1E6D8]/75"
                            }`}
                          >
                            {item.badge}
                          </span>
                          {item.type === "product" && typeof item.price === "number" && (
                            <span className="font-inter text-[12px] font-semibold text-[#D4A359]">
                              {formatRupiah(item.price)} / Pot
                            </span>
                          )}
                        </div>
                        <h4 className="font-inter text-[14px] sm:text-[15px] font-medium text-[#F1E6D8] truncate group-hover:text-white transition-colors">
                          {item.title}
                        </h4>
                        <p className="font-inter text-[12px] text-[#F1E6D8]/60 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </Link>

                    {item.type === "product" && typeof item.price === "number" ? (
                      <button
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            name: item.title,
                            subtitle: "Berat bersih: 400 gram",
                            price: item.price!,
                            image: item.image,
                            weightGram: PRODUCT_INFO.weightGram,
                          });
                          setIsSearchOpen(false);
                        }}
                        className="px-3.5 py-2 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                        title="Tambah ke Keranjang"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Pesan</span>
                      </button>
                    ) : (
                      <Link
                        href={item.link}
                        onClick={() => setIsSearchOpen(false)}
                        className="px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-[#F1E6D8] font-inter text-[12px] font-medium flex items-center gap-1.5 transition-all shrink-0"
                      >
                        <span className="hidden sm:inline">Lihat Info</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Bottom Shortcut Hint */}
            <div className="pt-2 border-t border-[#F1E6D8]/10 flex items-center justify-between font-inter text-[12px] text-[#F1E6D8]/50">
              <span>Tekan ESC untuk menutup</span>
              <Link
                href="/produk"
                onClick={() => setIsSearchOpen(false)}
                className="hover:text-white flex items-center gap-1"
              >
                <span>Lihat Detail Produk</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
