"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/Animations";
import { useCart } from "@/context/CartContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { PRODUCT_INFO } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

const PRODUCT_GALLERY = [
  {
    src: "/images/glam/jar-studio-pedestal.jpg",
    label: "Pot 400g",
  },
  {
    src: "/images/glam/jar-real-hand.jpg",
    label: "Kemasan Asli",
  },
  {
    src: "/images/glam/jar-powder-texture.jpg",
    label: "Tekstur Lulur",
  },
];

export default function IngredientsDeck() {
  const { addToCart } = useCart();
  const { home, produk } = useSiteContent();
  const [activeImg, setActiveImg] = useState(0);

  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      {/* Outer Luxury Container: bg #2D3622, r: 24px */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#2D3622] py-10 sm:py-20 lg:py-24 px-3.5 sm:px-8 lg:px-12 text-[#F1E6D8]">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-14">
          <div className="space-y-2.5 sm:space-y-3.5 max-w-[640px]">
            <Reveal direction="up" delay={0.05}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/[0.08] text-[#D4A359] font-inter text-[11px] sm:text-[13px] font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A359]" />
                <span>PRODUK UTAMA • BERAT BERSIH 400 GRAM</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.12}>
              <h2 className="font-sans text-2xl sm:text-5xl lg:text-[48px] font-normal tracking-[-0.02em] leading-[1.12]">
                {home.deckTitle}
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.18}>
              <p className="font-inter text-[14px] sm:text-[16px] text-[#F1E6D8]/75 leading-relaxed">
                {home.deckSubtitle}
              </p>
            </Reveal>
          </div>

          <Reveal direction="up" delay={0.22}>
            <Link
              href="/produk"
              className="group/btn inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-white/[0.08] hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] font-inter text-[13px] sm:text-[14px] font-medium transition-all shadow-sm w-fit"
            >
              <span>Detail Komposisi</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>

        {/* Single Signature Product Spotlight Card */}
        <div className="rounded-[24px] bg-[#201914] p-4 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center shadow-xl">
          {/* Left: Real Lulur Photo + Interactive Switcher */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative w-full h-[290px] sm:h-[400px] lg:h-[440px] rounded-[18px] overflow-hidden bg-[#2D3622]">
              <Image
                src={PRODUCT_GALLERY[activeImg].src}
                alt={`${PRODUCT_INFO.name} - ${PRODUCT_GALLERY[activeImg].label}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-500"
              />
              <span className="absolute top-3.5 left-3.5 px-3.5 py-1.5 rounded-full bg-[#201914]/85 backdrop-blur-sm text-[#D4A359] font-inter text-[12px] font-medium">
                {PRODUCT_GALLERY[activeImg].label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {PRODUCT_GALLERY.map((thumb, idx) => (
                <button
                  key={thumb.src}
                  type="button"
                  onClick={() => setActiveImg(idx)}
                  className={`relative h-[68px] sm:h-[84px] rounded-[12px] overflow-hidden border transition-all ${
                    activeImg === idx
                      ? "border-[#D4A359] opacity-100"
                      : "border-white/[0.08] opacity-60 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={thumb.src}
                    alt={thumb.label}
                    fill
                    sizes="160px"
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: 1 Product Spec, 5 Ingredients, Price & Purchase CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="font-inter text-[12px] uppercase tracking-[0.12em] text-[#D4A359]">
                Pot 400 Gram • Pemakaian Luar
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-normal text-[#F1E6D8]">
                {produk.productName}
              </h3>
              <p className="font-inter text-[14px] sm:text-[15px] text-[#F1E6D8]/75 leading-relaxed">
                {produk.productDescription}
              </p>
            </div>

            {/* 5 Ingredients Badges */}
            <div className="space-y-2.5">
              <span className="font-inter text-[12px] text-[#F1E6D8]/60 uppercase tracking-wider block">
                5 Komposisi Alami:
              </span>
              <div className="flex flex-wrap gap-2">
                {produk.ingredients.map((ing) => (
                  <span
                    key={ing.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] font-inter text-[12px] text-[#F1E6D8]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A359]" />
                    <span>{ing.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Price & CTAs */}
            <div className="pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block font-inter text-[11px] text-[#F1E6D8]/55 uppercase tracking-wider">
                  Harga Resmi • {produk.productWeightText}
                </span>
                <span className="font-sans text-3xl font-semibold text-[#D4A359]">
                  {formatRupiah(produk.productPrice)}{" "}
                  <span className="text-sm font-normal text-[#F1E6D8]/65">
                    / Pot
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    addToCart({
                      id: "prod-main",
                      name: produk.productName,
                      subtitle: `${produk.productWeightText} • Bahan Alami`,
                      price: produk.productPrice,
                      image: "/images/glam/jar-studio-pedestal.jpg",
                      weightGram: PRODUCT_INFO.weightGram,
                    })
                  }
                  className="h-[46px] px-5 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[13px] font-semibold inline-flex items-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Keranjang</span>
                </button>

                <Link
                  href="/pembelian"
                  className="h-[46px] px-5 rounded-full bg-[#2D3622] hover:bg-[#3a452c] text-[#F1E6D8] font-inter text-[13px] font-medium inline-flex items-center gap-1.5 transition-all"
                >
                  <span>Beli Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
