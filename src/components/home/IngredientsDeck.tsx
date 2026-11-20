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
      {/* Outer Luxury Soft Pink Container: bg #F9E6E9, r: 24px */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#F9E6E9] border border-[#C98A8B]/20 py-10 sm:py-20 lg:py-24 px-3.5 sm:px-8 lg:px-12 text-[#2B1B1D]">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-14">
          <div className="space-y-2.5 sm:space-y-3.5 max-w-[640px]">
            <Reveal direction="up" delay={0.05}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/80 border border-[#C98A8B]/25 text-[#9E5E63] font-inter text-[11px] sm:text-[13px] font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C98A8B]" />
                <span>PRODUK UTAMA • BERAT BERSIH 400 GRAM</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.12}>
              <h2 className="font-sans text-2xl sm:text-5xl lg:text-[48px] font-normal tracking-[-0.02em] leading-[1.12] text-[#2B1B1D]">
                {home.deckTitle}
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.18}>
              <p className="font-inter text-[14px] sm:text-[16px] text-[#6E5156] leading-relaxed">
                {home.deckSubtitle}
              </p>
            </Reveal>
          </div>

          <Reveal direction="up" delay={0.22}>
            <Link
              href="/produk"
              className="group/btn inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-white/85 hover:bg-[#4D2E33] text-[#2B1B1D] hover:text-[#FBF1F2] border border-[#C98A8B]/30 hover:border-[#4D2E33] font-inter text-[13px] sm:text-[14px] font-medium transition-all shadow-sm w-fit"
            >
              <span>Detail Komposisi</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>

        {/* Single Signature Product Spotlight Card */}
        <div className="rounded-[24px] bg-white/95 border border-[#C98A8B]/20 p-4 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center shadow-soft">
          {/* Left: Real Lulur Photo + Interactive Switcher */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative w-full h-[290px] sm:h-[400px] lg:h-[440px] rounded-[18px] overflow-hidden bg-[#F3DFE2]">
              <Image
                src={PRODUCT_GALLERY[activeImg].src}
                alt={`${PRODUCT_INFO.name} - ${PRODUCT_GALLERY[activeImg].label}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-500"
              />
              <span className="absolute top-3.5 left-3.5 px-3.5 py-1.5 rounded-full bg-[#2B1B1D]/85 backdrop-blur-sm text-[#E7B6B4] font-inter text-[12px] font-medium">
                {PRODUCT_GALLERY[activeImg].label}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {PRODUCT_GALLERY.map((thumb, idx) => (
                <button
                  key={thumb.src}
                  type="button"
                  onClick={() => setActiveImg(idx)}
                  className={`relative h-[68px] sm:h-[84px] rounded-[12px] overflow-hidden border-2 transition-all ${
                    activeImg === idx
                      ? "border-[#C98A8B] opacity-100 shadow-sm"
                      : "border-transparent opacity-65 hover:opacity-95"
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
              <span className="font-inter text-[12px] uppercase tracking-[0.12em] font-semibold text-[#9E5E63]">
                Pot 400 Gram • Pemakaian Luar
              </span>
              <h3 className="font-sans text-2xl sm:text-3xl font-normal text-[#2B1B1D]">
                {produk.productName}
              </h3>
              <p className="font-inter text-[14px] sm:text-[15px] text-[#6E5156] leading-relaxed">
                {produk.productDescription}
              </p>
            </div>

            {/* 5 Ingredients Badges */}
            <div className="space-y-2.5">
              <span className="font-inter text-[12px] text-[#6E5156] uppercase tracking-wider font-medium block">
                5 Komposisi Alami:
              </span>
              <div className="flex flex-wrap gap-2">
                {produk.ingredients.map((ing) => (
                  <span
                    key={ing.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FBF1F2] border border-[#C98A8B]/25 font-inter text-[12px] font-medium text-[#2B1B1D]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9E5E63]" />
                    <span>{ing.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Price & CTAs */}
            <div className="pt-5 border-t border-[#C98A8B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block font-inter text-[11px] text-[#6E5156] uppercase tracking-wider">
                  Harga Resmi • {produk.productWeightText}
                </span>
                <span className="font-sans text-3xl font-semibold text-[#9E5E63]">
                  {formatRupiah(produk.productPrice)}{" "}
                  <span className="text-sm font-normal text-[#6E5156]">
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
                  className="h-[46px] px-5 rounded-full bg-[#4D2E33] hover:bg-[#2B1B1D] text-[#FBF1F2] font-inter text-[13px] font-semibold inline-flex items-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E7B6B4]" />
                  <span>+ Keranjang</span>
                </button>

                <Link
                  href="/pembelian"
                  className="h-[46px] px-5 rounded-full bg-[#F3DFE2] hover:bg-[#EAD0D5] text-[#2B1B1D] border border-[#C98A8B]/30 font-inter text-[13px] font-semibold inline-flex items-center gap-1.5 transition-all"
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
