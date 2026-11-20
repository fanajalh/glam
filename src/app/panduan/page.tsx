"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldAlert,
  Refrigerator,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  USAGE_STEPS,
} from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";
import { useSiteContent } from "@/context/SiteContentContext";
import {
  Reveal,
  Magnetic,
  RollingText,
  CharReveal,
} from "@/components/ui/Animations";

export default function PanduanPage() {
  const { panduan, produk, general } = useSiteContent();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "24%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1.12, 1.0]);
  const heroContentY = useTransform(heroScroll, [0, 1], [0, 40]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  return (
    <div className="w-full bg-[#FFF5F6]">
      {/* 1. Hero with Animated Scroll Parallax */}
      <section
        ref={heroRef}
        className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-3 pb-1.5"
      >
        <div className="relative w-full rounded-[24px] overflow-hidden h-[62vh] min-h-[460px] max-h-[640px] flex items-center justify-center bg-[#2B1B1D]">
          <motion.div
            style={{ y: heroBgY, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/images/glam/jar-batik-spices.jpg"
              alt="Panduan Penggunaan Lulur Badda Lotong"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2B1B1D]/45 via-[#4D2E33]/30 to-[#2B1B1D]/55" />
          </motion.div>

          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[345px] sm:w-[560px] lg:w-[688px] z-10 bg-black/[0.06] pointer-events-none" />

          <motion.div
            style={{ y: heroContentY, opacity: heroOpacity }}
            className="relative z-20 max-w-[700px] mx-auto px-4 sm:px-6 text-center space-y-5 pt-10"
          >
            <h1 className="font-sans font-normal text-4xl sm:text-6xl lg:text-[74px] text-[#FBF1F2] tracking-[-0.04em] leading-[1.06] flex flex-col items-center">
              <CharReveal
                text={panduan.heroLine1}
                delay={0.1}
                stagger={0.02}
                animateImmediate
              />
              <CharReveal
                text={panduan.heroLine2}
                delay={0.26}
                stagger={0.02}
                animateImmediate
              />
            </h1>
            <Reveal direction="up" delay={0.42}>
              <p className="font-sans text-[17px] sm:text-[19px] text-[#FBF1F2]/90 max-w-[500px] mx-auto leading-[1.5]">
                {panduan.heroSubtitle}
              </p>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* 2. 4 Cara Penggunaan Resmi */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#F9E6E9] border border-[#C98A8B]/20 text-[#2B1B1D] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#C98A8B]/20">
            <div className="space-y-2">
              <Reveal direction="up" delay={0.05}>
                <span className="font-inter text-[13px] uppercase tracking-[0.14em] font-semibold text-[#9E5E63] block">
                  {panduan.stepsEyebrow}
                </span>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <h2 className="font-sans text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-[#2B1B1D]">
                  {panduan.stepsTitle}
                </h2>
              </Reveal>
            </div>
            <Reveal direction="up" delay={0.18}>
              <span className="px-5 py-2.5 rounded-full bg-white/85 border border-[#C98A8B]/25 font-inter text-[14px] text-[#4D2E33] font-medium">
                {panduan.stepsSubtitle}
              </span>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {panduan.steps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="rounded-[18px] bg-white border border-[#C98A8B]/20 overflow-hidden flex flex-col justify-between h-full group transition-all duration-300 hover:shadow-card shadow-soft cursor-default"
              >
                <div>
                  <div className="relative w-full h-48 overflow-hidden bg-[#F3DFE2]">
                    <Image
                      src={USAGE_STEPS[idx]?.image || "/images/glam/jar-real-hand.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B1D]/55 via-transparent to-transparent" />
                    <span className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-[#4D2E33]/90 text-[#FBF1F2] group-hover:bg-[#C98A8B] group-hover:text-white font-inter text-[13px] font-semibold flex items-center justify-center transition-colors shadow-sm">
                      0{idx + 1}
                    </span>
                    <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-white/95 text-[#2B1B1D] font-inter text-[12px] font-medium shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 space-y-2">
                    <h3 className="font-sans text-[18px] sm:text-[19px] font-medium text-[#2B1B1D] group-hover:text-[#9E5E63] transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[14px] text-[#6E5156] leading-[1.55]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Manfaat Utama & Catatan Resmi */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#4D2E33] text-[#FBF1F2] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Reveal direction="up" delay={0.05}>
              <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#E7B6B4] block">
                {panduan.benefitsEyebrow}
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <h2 className="font-sans text-3xl sm:text-5xl font-normal tracking-[-0.03em]">
                {panduan.benefitsTitle}
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {produk.benefits.map((b, idx) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-[20px] p-6 text-[#2B1B1D] flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <CheckCircle2 className="w-5 h-5 text-[#4D2E33]" />
                    <span className="px-3 py-1 rounded-full bg-[#FBF1F2] font-inter text-[11px] font-semibold text-[#2B1B1D]">
                      {b.highlight}
                    </span>
                  </div>
                  <h3 className="font-sans text-[18px] font-semibold">
                    {b.title}
                  </h3>
                  <p className="font-sans text-[14px] text-[#2B1B1D]/75 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="w-full px-4 sm:px-6 py-4 rounded-[18px] bg-[#2B1B1D]/60 border border-white/[0.1] text-center font-inter text-[13px] text-[#FBF1F2]/85 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#E7B6B4] shrink-0" />
            <span>{general.benefitsDisclaimer}</span>
          </div>
        </div>
      </section>

      {/* 4. Penyimpanan & Perhatian */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Storage Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#F3DFE2] rounded-[24px] p-8 sm:p-12 text-[#2B1B1D] space-y-6 shadow-md"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2B1B1D] shadow-sm">
              <Refrigerator className="w-5 h-5 text-[#4D2E33]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-sans text-2xl sm:text-3xl font-normal">
                {panduan.storageTitle}
              </h3>
              <p className="font-sans text-[16px] text-[#2B1B1D]/75">
                {panduan.storageDesc}
              </p>
            </div>
            <ul className="space-y-3 font-sans text-[15px] text-[#2B1B1D]/85">
              {panduan.storageTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2B1B1D] mt-2 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Caution Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[24px] p-8 sm:p-12 text-[#2B1B1D] flex flex-col justify-between gap-6 shadow-md"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-[#F3DFE2] flex items-center justify-center text-[#2B1B1D] shadow-sm">
                <ShieldAlert className="w-5 h-5 text-[#2B1B1D]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans text-2xl sm:text-3xl font-normal">
                  {panduan.cautionsTitle}
                </h3>
                <p className="font-sans text-[16px] text-[#2B1B1D]/75">
                  Perhatikan hal berikut demi kenyamanan kulit saat penggunaan:
                </p>
              </div>
              <ul className="space-y-2.5 font-sans text-[15px] text-[#2B1B1D]/85">
                {panduan.cautions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B1B1D] mt-2 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Magnetic strength={0.22}>
                <Link
                  href="/pembelian"
                  className="group/roll whitespace-nowrap px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#2B1B1D] hover:bg-[#4D2E33] text-[#FBF1F2] font-inter text-[14px] sm:text-[15px] font-medium inline-flex items-center gap-2.5 transition-all shadow-md active:scale-95 shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E7B6B4] shrink-0" />
                  <RollingText
                    text={`Pesan Sekarang • ${formatRupiah(produk.productPrice)}`}
                  />
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
