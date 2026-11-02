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
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { INGREDIENTS, PRODUCT_INFO, PACKAGES } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import {
  Reveal,
  StaggerContainer,
  StaggerItem,
  ParallaxImageBox,
  Magnetic,
  RollingText,
  CharReveal,
  ExpandLine,
} from "@/components/ui/Animations";

const SHOP_COLLECTION = [
  {
    id: "prod-main",
    category: "Signature Lulur",
    tag: "Mist of Radiance",
    title1: "GLAM & GLOW LULUR",
    title2: "BADDA LOTONG 400G",
    price: 35000,
    weightGram: 400,
    formattedPrice: "Rp 35.000",
    image: "/images/orveli/prod-3.png",
    desc: "Lulur Badda Lotong asli Bugis 400g dari 6 rempah murni.",
  },
  {
    id: "bundle-2",
    category: "Paket Bundling",
    tag: "Paling Laris",
    title1: "PAKET GLOWING",
    title2: "2 POT (800G)",
    price: 70000,
    weightGram: 800,
    formattedPrice: "Rp 70.000",
    image: "/images/orveli/prod-6.png",
    desc: "Paket hemat 2 pot (800g) untuk pemakaian rutin 1-2 bulan.",
  },
  {
    id: "bundle-3",
    category: "Paket Bundling",
    tag: "Super Value",
    title1: "PAKET KELUARGA",
    title2: "3 POT (1.2KG)",
    price: 105000,
    weightGram: 1200,
    formattedPrice: "Rp 105.000",
    image: "/images/orveli/prod-7.png",
    desc: "Paket super value 3 pot (1.2kg) untuk seluruh keluarga.",
  },
  {
    id: "prod-scrub",
    category: "6 Rempah Alami",
    tag: "Exfoliate Deep",
    title1: "BERAS KETAN PUTIH",
    title2: "SCRUB / MASK BASE",
    price: 35000,
    weightGram: 400,
    formattedPrice: "Rp 35.000",
    image: "/images/orveli/prod-1.png",
    desc: "Eksfoliasi alami yang mengangkat sel kulit mati tanpa perih.",
  },
  {
    id: "prod-pandan",
    category: "6 Rempah Alami",
    tag: "Fresh Balance",
    title1: "DAUN PANDAN & CENGKEH",
    title2: "BOTANICAL AROMA",
    price: 35000,
    weightGram: 400,
    formattedPrice: "Rp 35.000",
    image: "/images/orveli/prod-2.png",
    desc: "Keharuman rempah Bugis relaksasi dan antibakteri alami.",
  },
  {
    id: "prod-kunyit",
    category: "6 Rempah Alami",
    tag: "Gentle Clarity",
    title1: "KUNYIT & JERUK NIPIS",
    title2: "BRIGHTENING ACTIVE",
    price: 35000,
    weightGram: 400,
    formattedPrice: "Rp 35.000",
    image: "/images/orveli/prod-4.png",
    desc: "Kaya kurkumin dan vitamin C untuk mencerahkan kulit kusam.",
  },
  {
    id: "prod-kopi",
    category: "6 Rempah Alami",
    tag: "Hydrating Care",
    title1: "BUBUK KOPI MURNI",
    title2: "ANTIOXIDANT RELAX",
    price: 35000,
    weightGram: 400,
    formattedPrice: "Rp 35.000",
    image: "/images/orveli/prod-5.png",
    desc: "Menyamarkan noda belang dan menyegarkan kulit tubuh.",
  },
];

const CATEGORIES = [
  "All Formulas",
  "Signature Lulur",
  "6 Rempah Alami",
  "Paket Bundling",
];

export default function ProdukPage() {
  const [activeCategory, setActiveCategory] = useState("All Formulas");
  const { addToCart } = useCart();
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax Hero
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "24%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1.12, 1.0]);
  const heroContentY = useTransform(heroScroll, [0, 1], [0, 40]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  const filteredProducts =
    activeCategory === "All Formulas"
      ? SHOP_COLLECTION
      : SHOP_COLLECTION.filter((item) => item.category === activeCategory);

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
              src="/images/orveli/shop-hero.png"
              alt="Considered formulas, every single one"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/25" />
          </motion.div>

          {/* Centered Vertical Glass Panel */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[345px] sm:w-[560px] lg:w-[688px] z-10 bg-black/[0.04] pointer-events-none" />

          <motion.div
            style={{ y: heroContentY, opacity: heroOpacity }}
            className="relative z-20 max-w-[700px] mx-auto px-4 sm:px-6 text-center space-y-5 pt-10"
          >
            <h1 className="font-sans font-normal text-4xl sm:text-6xl lg:text-[76px] text-[#F1E6D8] tracking-[-0.04em] leading-[1.06] flex flex-col items-center">
              <CharReveal
                text="Considered formulas,"
                delay={0.1}
                stagger={0.02}
                animateImmediate
              />
              <CharReveal
                text="every single one"
                delay={0.28}
                stagger={0.02}
                animateImmediate
              />
            </h1>
            <Reveal direction="up" delay={0.45}>
              <p className="font-sans text-[17px] sm:text-[19px] text-[#F1E6D8]/85 max-w-[460px] mx-auto leading-[1.5]">
                Small-batch botanical body care, made with traceable Bugis
                herbal ingredients and nothing to hide.
              </p>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* 2. Shop Catalog with Gliding Filter Pills & Card Animations */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#2D3622] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-12">
          {/* Trust Bar (4 Columns) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-10 border-b border-white/[0.08]">
            {[
              { icon: Leaf, label: "100% Plant-Derived Ingredients" },
              { icon: ShieldCheck, label: "1,500+ Banned Synthetics" },
              { icon: Sparkles, label: "Fresh Batch • Pot 400g (Rp 35k)" },
              { icon: Truck, label: "Pengiriman Seluruh Indonesia" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-center gap-3 text-[#F1E6D8]/85 font-inter text-[14px] sm:text-[15px]"
                >
                  <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center text-[#D4A359] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Gliding Filter Pills Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth max-w-full touch-pan-x -mx-1 px-1">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative h-[40px] sm:h-[44px] px-4 sm:px-6 rounded-full font-inter text-[13px] sm:text-[14px] font-medium transition-colors duration-200 z-10 whitespace-nowrap shrink-0 ${
                      active ? "text-[#201914]" : "text-[#F1E6D8] hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-[#F1E6D8] shadow-md z-[-1]"
                      />
                    )}
                    {!active && (
                      <div className="absolute inset-0 rounded-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors z-[-1]" />
                    )}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 font-inter text-[13px] sm:text-[14px] text-[#D4A359] font-medium shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{filteredProducts.length} Formula Pilihan</span>
            </div>
          </div>

          {/* Animated Product Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((prod) => (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8 }}
                  className="rounded-[18px] bg-[#D7D1C3] p-5 sm:p-6 flex flex-col justify-between min-h-[430px] group shadow-md hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Top Row: Tag Pill + Cart Button */}
                  <div className="flex items-center justify-between w-full">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-[#201914] font-inter text-[12px] font-medium shadow-xs">
                      {prod.tag}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: prod.id,
                          name: `${prod.title1} ${prod.title2}`,
                          subtitle: prod.tag,
                          price: prod.price,
                          image: prod.image,
                          weightGram: prod.weightGram,
                        })
                      }
                      className="w-9 h-9 rounded-full bg-white hover:bg-[#201914] text-[#201914] hover:text-white flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-xs active:scale-95"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Center Studio Cutout Image with Hover Scale */}
                  <div className="relative w-full h-[220px] my-4 flex items-center justify-center">
                    <Image
                      src={prod.image}
                      alt={`${prod.title1} ${prod.title2}`}
                      fill
                      className="object-contain object-center p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Bottom Info + Quick Order */}
                  <div className="space-y-3 pt-3 border-t border-[#201914]/10">
                    <div className="flex items-end justify-between">
                      <div className="font-sans">
                        <span className="block text-[14px] font-medium text-[#201914] uppercase leading-tight">
                          {prod.title1}
                        </span>
                        <span className="block text-[12px] text-[#201914]/70 uppercase leading-tight mt-0.5">
                          {prod.title2}
                        </span>
                      </div>
                      <span className="font-sans text-[16px] font-semibold text-[#201914]">
                        {prod.formattedPrice}
                      </span>
                    </div>
                    <p className="font-sans text-[13px] text-[#201914]/70 leading-relaxed line-clamp-2">
                      {prod.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: prod.id,
                          name: `${prod.title1} ${prod.title2}`,
                          subtitle: prod.tag,
                          price: prod.price,
                          image: prod.image,
                          weightGram: prod.weightGram,
                        })
                      }
                      className="group/roll w-full h-[44px] rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[13px] font-medium flex items-center justify-center transition-colors cursor-pointer active:scale-98 shadow-sm"
                    >
                      <RollingText text="Quick Add • Masukkan Bag" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 3. Powered by Earth, Proven by Tradition */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#201914] text-[#F1E6D8] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-10 lg:gap-14 items-start relative">
          {/* Left Column: Signature Leaf Bottle (Sticky Scroll Follower) */}
          <div className="w-full lg:w-[46%] lg:sticky lg:top-24 xl:top-28 self-start z-10 transition-all">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-[400px] sm:h-[520px] lg:h-[620px] rounded-[22px] overflow-hidden bg-[#2D3622] shadow-2xl border border-white/[0.08] group"
            >
              <Image
                src="/images/orveli/bottle-leaf.jpg"
                alt="Glam & Glow Lulur Badda Lotong Formula"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between gap-2">
                <span className="font-inter text-[11px] sm:text-[13px] bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 font-medium text-[#F1E6D8]">
                  Formula Rempah Bugis
                </span>
                <span className="font-inter text-[11px] sm:text-[13px] text-[#D4A359] font-medium bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                  Pot 400g • Rp 35.000
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Content + 6 Ingredients Breakdown */}
          <div className="w-full lg:w-[54%] space-y-8">
            <div className="space-y-4">
              <Reveal direction="up" delay={0.05}>
                <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#D4A359] block">
                  6 Komposisi Utama • {PRODUCT_INFO.name}
                </span>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <h2 className="font-sans text-3xl sm:text-5xl lg:text-[56px] font-normal text-[#F1E6D8] tracking-[-0.03em] leading-[1.08]">
                  Powered by earth, proven by tradition
                </h2>
              </Reveal>
              <Reveal direction="up" delay={0.18}>
                <p className="font-sans text-[17px] text-[#F1E6D8]/75 leading-[1.55] max-w-[600px]">
                  {PRODUCT_INFO.description}
                </p>
              </Reveal>
            </div>

            <ExpandLine className="bg-white/[0.08]" />

            {/* 6 Ingredients List with Hover Tilt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {INGREDIENTS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.08 * idx }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="p-5 rounded-[16px] bg-white/[0.04] space-y-2 transition-colors duration-300 hover:bg-white/[0.07] cursor-default shadow-sm border border-white/[0.04]"
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

            <div className="pt-2">
              <Magnetic strength={0.22}>
                <Link
                  href="/pesan"
                  className="group/roll whitespace-nowrap px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[14px] sm:text-[15px] font-medium inline-flex items-center gap-2.5 transition-all shadow-md active:scale-95 shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <RollingText
                    text={`Pesan Sekarang • ${formatRupiah(PRODUCT_INFO.price)}`}
                  />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pilihan Paket Bundling */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#D7D1C3] text-[#201914] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Reveal direction="up" delay={0.05}>
              <h2 className="font-sans text-3xl sm:text-5xl font-normal tracking-[-0.03em]">
                Pilih Paket Sesuai Kebutuhan
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <p className="font-sans text-[17px] text-[#201914]/75">
                Semakin banyak pot, semakin hemat ongkos kirim ke seluruh kota di
                Indonesia.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PACKAGES.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-[24px] p-7 sm:p-8 flex flex-col justify-between gap-6 h-full shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full bg-[#D7D1C3] text-[#201914] font-inter text-[13px] font-medium">
                      {pkg.badge}
                    </span>
                    <span className="font-inter text-[14px] text-[#201914]/65">
                      {pkg.weight}
                    </span>
                  </div>
                  <h3 className="font-sans text-2xl font-medium text-[#201914]">
                    {pkg.title}
                  </h3>
                  <p className="font-sans text-[15px] text-[#201914]/70 leading-relaxed">
                    {pkg.subtitle}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#201914]/10">
                  <div className="font-sans text-3xl font-semibold text-[#201914]">
                    {formatRupiah(pkg.price)}
                  </div>
                  <Link
                    href="/pesan"
                    className="group/roll w-full h-[50px] rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[15px] font-medium flex items-center justify-center transition-colors active:scale-98 shadow-sm"
                  >
                    <RollingText text="Pilih Paket Ini" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
