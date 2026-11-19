"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
  Plus,
  Minus,
  ArrowRight,
  FlaskConical,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  PRODUCT_INFO,
} from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useSiteContent } from "@/context/SiteContentContext";
import {
  Reveal,
  Magnetic,
  RollingText,
  CharReveal,
  ExpandLine,
} from "@/components/ui/Animations";

const PRODUCT_PHOTOS = [
  {
    src: "/images/glam/jar-studio-pedestal.jpg",
    label: "Kemasan Pot 400g",
  },
  {
    src: "/images/glam/jar-real-hand.jpg",
    label: "Foto Produk Asli",
  },
  {
    src: "/images/glam/jar-powder-texture.jpg",
    label: "Tekstur Serbuk Lulur",
  },
  {
    src: "/images/glam/jar-batik-spices.jpg",
    label: "Racikan 5 Bahan Alami",
  },
];

export default function ProdukPage() {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { produk, general } = useSiteContent();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "24%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1.12, 1.0]);
  const heroContentY = useTransform(heroScroll, [0, 1], [0, 40]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  const handleAddProduct = () => {
    addToCart(
      {
        id: "prod-main",
        name: produk.productName,
        subtitle: `${produk.productWeightText} • Bahan Alami`,
        price: produk.productPrice,
        image: "/images/glam/jar-studio-pedestal.jpg",
        weightGram: PRODUCT_INFO.weightGram,
      },
      qty
    );
  };

  return (
    <div className="w-full bg-[#F1E6D8]">
      {/* 1. Shop Hero with Animated Scroll Parallax */}
      <section
        ref={heroRef}
        className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-3 pb-1.5"
      >
        <div className="relative w-full rounded-[24px] overflow-hidden h-[64vh] min-h-[460px] max-h-[660px] flex items-center justify-center bg-[#201914]">
          <motion.div
            style={{ y: heroBgY, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/images/glam/jar-bugis-pinisi.jpg"
              alt="Glam & Glow Lulur Badda Lotong"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/45" />
          </motion.div>

          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[345px] sm:w-[560px] lg:w-[688px] z-10 bg-black/[0.06] pointer-events-none" />

          <motion.div
            style={{ y: heroContentY, opacity: heroOpacity }}
            className="relative z-20 max-w-[720px] mx-auto px-4 sm:px-6 text-center space-y-5 pt-10"
          >
            <h1 className="font-sans font-normal text-4xl sm:text-6xl lg:text-[72px] text-[#F1E6D8] tracking-[-0.04em] leading-[1.06] flex flex-col items-center">
              <CharReveal
                text={produk.heroLine1}
                delay={0.1}
                stagger={0.02}
                animateImmediate
              />
              <CharReveal
                text={produk.heroLine2}
                delay={0.26}
                stagger={0.02}
                animateImmediate
              />
            </h1>
            <Reveal direction="up" delay={0.45}>
              <p className="font-sans text-[16px] sm:text-[19px] text-[#F1E6D8]/90 max-w-[500px] mx-auto leading-[1.5]">
                {produk.heroSubtitle}
              </p>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* 2. Single Signature Product Showcase */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#2D3622] py-14 sm:py-20 px-4 sm:px-8 lg:px-12 space-y-12">
          {/* Trust Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-10 border-b border-white/[0.08]">
            {[
              { icon: Leaf, label: produk.trustBadges[0] || "5 Bahan Alami Pilihan" },
              { icon: ShieldCheck, label: produk.trustBadges[1] || "Khusus Pemakaian Luar" },
              { icon: Sparkles, label: produk.trustBadges[2] || "Berat Bersih: 400 gram" },
              { icon: Truck, label: produk.trustBadges[3] || "Rp35.000 / Pot" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-center gap-3 text-[#F1E6D8]/85 font-inter text-[13px] sm:text-[15px]"
                >
                  <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center text-[#D4A359] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Main Single Product Purchase Card */}
          <div className="rounded-[24px] bg-[#D7D1C3] text-[#201914] p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-xl">
            {/* Gallery Left */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="relative w-full h-[300px] sm:h-[420px] rounded-[18px] overflow-hidden bg-[#201914]">
                <Image
                  src={PRODUCT_PHOTOS[selectedPhoto].src}
                  alt={PRODUCT_PHOTOS[selectedPhoto].label}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <span className="absolute top-3.5 left-3.5 px-3.5 py-1.5 rounded-full bg-white/95 text-[#201914] font-inter text-[12px] font-semibold shadow-sm">
                  {PRODUCT_PHOTOS[selectedPhoto].label}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {PRODUCT_PHOTOS.map((photo, idx) => (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => setSelectedPhoto(idx)}
                    className={`relative h-[64px] sm:h-[82px] rounded-[12px] overflow-hidden border-2 transition-all ${
                      selectedPhoto === idx
                        ? "border-[#201914] opacity-100"
                        : "border-transparent opacity-65 hover:opacity-95"
                    }`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.label}
                      fill
                      sizes="140px"
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info & Quantity Control Right */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 font-inter text-[12px] font-semibold text-[#2D3622]">
                  {produk.productTagline}
                </span>
                <h2 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
                  {produk.productName}
                </h2>
                <p className="font-sans text-[15px] sm:text-[16px] text-[#201914]/80 leading-relaxed">
                  {produk.productDescription}
                </p>
              </div>

              <div className="p-4 rounded-[16px] bg-white/75 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-inter text-[11px] uppercase tracking-wider text-[#201914]/60 block">
                    Harga Satuan ({produk.productWeightText})
                  </span>
                  <span className="font-sans text-3xl font-bold text-[#201914]">
                    {formatRupiah(produk.productPrice)}
                    <span className="text-sm font-normal text-[#201914]/65">
                      {" "}
                      / Pot
                    </span>
                  </span>
                </div>

                {/* Quantity Picker */}
                <div className="flex items-center gap-2 bg-[#201914] text-[#F1E6D8] rounded-full px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors"
                    aria-label="Kurangi jumlah pot"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-inter text-[14px] font-semibold min-w-[44px] text-center">
                    {qty} Pot
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors"
                    aria-label="Tambah jumlah pot"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="flex-1 h-[50px] px-6 rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4A359]" />
                  <span>
                    Tambah ke Keranjang • {formatRupiah(produk.productPrice * qty)}
                  </span>
                </button>

                <Link
                  href="/pembelian"
                  onClick={handleAddProduct}
                  className="h-[50px] px-6 rounded-full bg-white hover:bg-[#F1E6D8] text-[#201914] font-inter text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-colors border border-[#201914]/15"
                >
                  <span>Beli Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-2 border-t border-[#201914]/10 flex flex-wrap items-center justify-between gap-2 font-inter text-[12px] text-[#201914]/70">
                <span>
                  Pemesanan juga dilayani melalui {general.instagramHandle}
                </span>
                <Link
                  href="/batch/GG-BL-2026-01"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#2D3622] hover:underline"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Lihat Data Uji Lab Batch</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sticky Product Photo + 5 Komposisi & Manfaat Utama */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5 pb-6">
        <div className="w-full rounded-[24px] bg-[#201914] text-[#F1E6D8] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-10 lg:gap-14 items-start relative">
          {/* Left Column: Real Glam & Glow Photo (Sticky Scroll Follower) */}
          <div className="w-full lg:w-[46%] lg:sticky lg:top-24 xl:top-28 self-start z-10 transition-all">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-[400px] sm:h-[520px] lg:h-[620px] rounded-[22px] overflow-hidden bg-[#2D3622] shadow-2xl border border-white/[0.08] group"
            >
              <Image
                src="/images/glam/jar-ingredients-wood.jpg"
                alt="Glam & Glow Lulur Badda Lotong Komposisi Alami"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between gap-2">
                <span className="font-inter text-[11px] sm:text-[13px] bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 font-medium text-[#F1E6D8]">
                  5 Komposisi Alami
                </span>
                <span className="font-inter text-[11px] sm:text-[13px] text-[#D4A359] font-medium bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                  400g • Rp35.000
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Content + 5 Ingredients Breakdown + Manfaat Utama */}
          <div className="w-full lg:w-[54%] space-y-8">
            <div className="space-y-4">
              <Reveal direction="up" delay={0.05}>
                <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#D4A359] block">
                  {produk.compositionEyebrow} • {produk.productName}
                </span>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <h2 className="font-sans text-3xl sm:text-5xl lg:text-[52px] font-normal text-[#F1E6D8] tracking-[-0.03em] leading-[1.08]">
                  {produk.compositionTitle}
                </h2>
              </Reveal>
              <Reveal direction="up" delay={0.18}>
                <p className="font-sans text-[17px] text-[#F1E6D8]/75 leading-[1.55] max-w-[600px]">
                  {produk.compositionNote}
                </p>
              </Reveal>
            </div>

            <ExpandLine className="bg-white/[0.08]" />

            {/* 5 Ingredients List — symmetric grid (5th card spans full width on sm+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {produk.ingredients.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.08 * idx }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`p-5 rounded-[18px] bg-white/[0.04] space-y-2 transition-colors duration-300 hover:bg-white/[0.07] cursor-default shadow-sm border border-white/[0.06] ${
                    idx === produk.ingredients.length - 1 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-[13px] text-[#D4A359] font-medium">
                      0{idx + 1}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/[0.08] font-inter text-[12px] text-[#F1E6D8]">
                      {item.role}
                    </span>
                  </div>
                  <h3 className="font-sans text-[19px] font-normal text-[#F1E6D8]">
                    {item.name}
                  </h3>
                  <p className="font-sans text-[14px] text-[#F1E6D8]/68 leading-[1.5]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Manfaat Utama + Catatan Resmi */}
            <div className="p-5 sm:p-6 rounded-[18px] bg-[#2D3622]/75 border border-white/[0.08] space-y-3.5">
              <h3 className="font-sans text-lg font-medium text-[#D4A359]">
                {produk.benefitsSectionTitle}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-inter text-[13px] text-[#F1E6D8]/90">
                {produk.benefits.map((b) => (
                  <li key={b.title} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] mt-1.5 shrink-0" />
                    <span>{b.description}</span>
                  </li>
                ))}
              </ul>
              <p className="font-inter text-[12px] text-[#F1E6D8]/60 pt-3 border-t border-white/[0.08] leading-relaxed">
                {general.benefitsDisclaimer}
              </p>
            </div>

            {/* Balanced Bottom Price & CTA Bar */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-inter text-[11px] uppercase tracking-wider text-[#F1E6D8]/55 block">
                  Harga Resmi • {produk.productWeightText}
                </span>
                <span className="font-sans text-2xl sm:text-3xl font-semibold text-[#D4A359]">
                  {formatRupiah(produk.productPrice)}{" "}
                  <span className="text-sm font-normal text-[#F1E6D8]/65">
                    / Pot
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="h-[48px] px-5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-[#F1E6D8] font-inter text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4A359]" />
                  <span>+ Keranjang</span>
                </button>

                <Magnetic strength={0.18}>
                  <Link
                    href="/pembelian"
                    className="group/roll whitespace-nowrap h-[48px] px-7 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
                  >
                    <RollingText text="Pesan Sekarang" />
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
