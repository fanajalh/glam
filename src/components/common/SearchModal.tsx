"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { PACKAGES, PRODUCT_INFO, INGREDIENTS } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  type: "product" | "ingredient";
  link: string;
}

const SEARCHABLE_ITEMS: SearchResult[] = [
  {
    id: "prod-main",
    title: PRODUCT_INFO.name,
    subtitle: "Pot 400g • Formula Utama 6 Rempah Alami Bugis",
    price: PRODUCT_INFO.price,
    image: "/images/orveli/prod-3.png",
    type: "product",
    link: "/pesan",
  },
  {
    id: "bundle-2",
    title: "Paket Glowing • 2 Pot (800g)",
    subtitle: "Paling laris untuk pemakaian rutin 1-2 bulan kulit cerah merata",
    price: 70000,
    image: "/images/orveli/prod-6.png",
    type: "product",
    link: "/pesan",
  },
  {
    id: "bundle-3",
    title: "Paket Keluarga • 3 Pot (1.2kg)",
    subtitle: "Stok super hemat untuk seluruh keluarga di rumah",
    price: 105000,
    image: "/images/orveli/prod-7.png",
    type: "product",
    link: "/pesan",
  },
  {
    id: "ing-1",
    title: "Beras Ketan Putih Alami",
    subtitle: "Bahan dasar eksfoliasi murni yang mengangkat sel kulit mati",
    price: 35000,
    image: "/images/orveli/prod-1.png",
    type: "ingredient",
    link: "/tentang-kami",
  },
  {
    id: "ing-2",
    title: "Daun Pandan & Cengkeh Pilihan",
    subtitle: "Aroma rempah eksotis relaksasi dan antibakteri alami",
    price: 35000,
    image: "/images/orveli/prod-2.png",
    type: "ingredient",
    link: "/tentang-kami",
  },
  {
    id: "ing-3",
    title: "Kunyit & Jeruk Nipis",
    subtitle: "Kaya antioksidan alami untuk mencerahkan kulit belang",
    price: 35000,
    image: "/images/orveli/prod-4.png",
    type: "ingredient",
    link: "/tentang-kami",
  },
  {
    id: "ing-4",
    title: "Bubuk Kopi Murni Sangrai",
    subtitle: "Menyamarkan noda dan meremajakan tekstur kulit tubuh",
    price: 35000,
    image: "/images/orveli/prod-5.png",
    type: "ingredient",
    link: "/tentang-kami",
  },
];

const SUGGESTED_TAGS = [
  "Lulur 400g",
  "Paket 2 Pot",
  "Paket 3 Pot",
  "Beras Ketan",
  "Cengkeh",
  "Pandan",
];

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useCart();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredResults = query.trim()
    ? SEARCHABLE_ITEMS.filter((item) =>
        `${item.title} ${item.subtitle}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : SEARCHABLE_ITEMS.slice(0, 4);

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
            className="relative w-full max-w-[620px] bg-[#201914] text-[#F1E6D8] rounded-[24px] shadow-2xl p-6 sm:p-7 flex flex-col gap-5 z-10 max-h-[85vh] overflow-hidden"
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
                placeholder="Cari formula lulur, bahan, paket bundling..."
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
                ESC
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
                    Tidak ada formula yang cocok dengan &quot;{query}&quot;
                  </p>
                  <p className="font-inter text-[13px] text-[#F1E6D8]/40">
                    Coba kata kunci lain seperti &quot;paket&quot; atau &quot;lulur&quot;
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
                      <div className="relative w-14 h-14 rounded-[12px] bg-[#D7D1C3] overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-inter text-[14px] sm:text-[15px] font-medium text-[#F1E6D8] truncate group-hover:text-white transition-colors">
                          {item.title}
                        </h4>
                        <p className="font-inter text-[12px] text-[#F1E6D8]/60 truncate">
                          {item.subtitle}
                        </p>
                        <span className="font-inter text-[13px] font-semibold text-[#D4A359] block pt-0.5">
                          {formatRupiah(item.price)}
                        </span>
                      </div>
                    </Link>

                    {/* Quick Add to Cart Button */}
                    <button
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.title,
                          subtitle: item.subtitle,
                          price: item.price,
                          image: item.image,
                          weightGram: 400,
                        });
                        setIsSearchOpen(false);
                      }}
                      className="px-3.5 py-2 rounded-full bg-[#F1E6D8]/20 hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] font-inter text-[12px] font-semibold flex items-center gap-1.5 transition-all shrink-0"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Pesan</span>
                    </button>
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
                <span>Lihat Semua Produk</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

