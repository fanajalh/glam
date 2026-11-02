"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Droplets,
  ShieldAlert,
  Refrigerator,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { USAGE_STEPS, CAUTIONS } from "@/lib/constants";
import {
  Reveal,
  StaggerContainer,
  StaggerItem,
  Magnetic,
  RollingText,
  CharReveal,
} from "@/components/ui/Animations";

const DIY_RECIPES = [
  {
    title: "Racikan Mawar Menyegarkan",
    mixer: "Air Mawar Murni",
    image: "/images/diy-air-mawar.jpg",
    description:
      "Kombinasikan pasta lulur dengan air mawar untuk memberikan sensasi dingin yang menyegarkan, mengecilkan pori-pori, dan memberikan aroma floral alami yang menenangkan.",
    benefits: [
      "Sensasi dingin relaksasi",
      "Aroma wangi menenangkan",
      "Menenangkan kulit kemerahan",
    ],
    tag: "Paling Populer",
  },
  {
    title: "Racikan Susu Kelembapan Ekstra",
    mixer: "Susu Beruang / Susu UHT Plain",
    image: "/images/diy-susu.jpg",
    description:
      "Asam laktat alami pada susu bersinergi dengan beras ketan sangrai untuk melembapkan kulit kering secara intensif, menjadikan kulit terasa kenyal dan halus.",
    benefits: [
      "Hidrasi mendalam seketika",
      "Tekstur kulit ekstra lembut",
      "Mengurangi kulit kering di siku & lutut",
    ],
    tag: "Kelembapan Maksimal",
  },
  {
    title: "Racikan Tradisional Klasik",
    mixer: "Air Matang Bersih",
    image: "/images/diy-tradisional.jpg",
    description:
      "Cara paling praktis dan autentik. Menggunakan air matang bersih menjaga kemurnian aroma alami cengkeh, pandan, kunyit, dan kopi tanpa mengubah khasiat alaminya.",
    benefits: [
      "Praktis tanpa bahan tambahan",
      "Aroma rempah asli terasa kuat",
      "Eksfoliasi tuntas dan higienis",
    ],
    tag: "Praktis Sehari-hari",
  },
];

export default function PanduanPage() {
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

  return (
    <div className="w-full bg-[#F1E6D8]">
      {/* 1. Hero with Animated Scroll Parallax */}
      <section
        ref={heroRef}
        className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-3 pb-1.5"
      >
        <div className="relative w-full rounded-[24px] overflow-hidden h-[62vh] min-h-[460px] max-h-[640px] flex items-center justify-center bg-[#201914]">
          <motion.div
            style={{ y: heroBgY, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/images/orveli/hero-bg.png"
              alt="Panduan Penggunaan Lulur Badda Lotong"
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
            <h1 className="font-sans font-normal text-4xl sm:text-6xl lg:text-[74px] text-[#F1E6D8] tracking-[-0.04em] leading-[1.06] flex flex-col items-center">
              <CharReveal
                text="The Botanical"
                delay={0.1}
                stagger={0.02}
                animateImmediate
              />
              <CharReveal
                text="Ritual Guide"
                delay={0.26}
                stagger={0.02}
                animateImmediate
              />
            </h1>
            <Reveal direction="up" delay={0.42}>
              <p className="font-sans text-[17px] sm:text-[19px] text-[#F1E6D8]/85 max-w-[480px] mx-auto leading-[1.5]">
                Ikuti 8 langkah mudah serta variasi campuran alami untuk hasil
                kulit cerah, halus, dan wangi sepanjang hari.
              </p>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* 2. 8 Langkah Penggunaan with Interactive Step Cards */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#201914] text-[#F1E6D8] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/[0.08]">
            <div className="space-y-2">
              <Reveal direction="up" delay={0.05}>
                <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#D4A359] block">
                  Step-by-Step Ritual
                </span>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <h2 className="font-sans text-3xl sm:text-5xl font-normal tracking-[-0.03em]">
                  8 Tahapan Menggunakan Lulur
                </h2>
              </Reveal>
            </div>
            <Reveal direction="up" delay={0.18}>
              <span className="px-5 py-2.5 rounded-full bg-white/[0.08] font-inter text-[14px] text-[#F1E6D8]">
                Durasi Ritual: ±15 Menit (2–3x Seminggu)
              </span>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {USAGE_STEPS.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: (idx % 4) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-[18px] bg-white/[0.04] overflow-hidden flex flex-col justify-between h-full group transition-all duration-300 hover:bg-white/[0.07] shadow-lg cursor-default"
              >
                <div>
                  <div className="relative w-full h-44 overflow-hidden bg-[#2D3622]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-[#201914]/90 text-[#F1E6D8] group-hover:bg-[#D4A359] group-hover:text-[#201914] font-inter text-[13px] font-semibold flex items-center justify-center transition-colors shadow-sm">
                      0{item.step}
                    </span>
                    <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-white text-[#201914] font-inter text-[12px] font-medium shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 space-y-2">
                    <h3 className="font-sans text-[18px] sm:text-[19px] font-medium text-[#F1E6D8] group-hover:text-[#D4A359] transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[14px] text-[#F1E6D8]/70 leading-[1.55]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 3 Variasi Campuran Lulur Favorit */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#2D3622] text-[#F1E6D8] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Reveal direction="up" delay={0.05}>
              <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#D4A359] block">
                Custom Botanical Mixers
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <h2 className="font-sans text-3xl sm:text-5xl font-normal tracking-[-0.03em]">
                3 Variasi Campuran Lulur Favorit
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.18}>
              <p className="font-sans text-[17px] text-[#F1E6D8]/75">
                Pasta lulur Glam & Glow sangat fleksibel untuk dicampurkan dengan
                cairan favorit sesuai kondisi kulit Anda.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIY_RECIPES.map((recipe, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-[24px] p-6 sm:p-7 text-[#201914] flex flex-col justify-between gap-6 h-full shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default"
              >
                <div className="space-y-4">
                  <div className="relative w-full h-44 rounded-[14px] overflow-hidden bg-[#D7D1C3]">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-3 left-3 px-3.5 py-1 rounded-full bg-white text-[#201914] font-inter text-[12px] font-medium shadow-xs">
                      {recipe.tag}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-inter text-[13px] text-[#2D3622] font-medium">
                      <Droplets className="w-4 h-4 text-[#D4A359]" />
                      <span>Campuran: {recipe.mixer}</span>
                    </div>
                    <h3 className="font-sans text-[22px] font-medium text-[#201914] group-hover:text-[#4E2719] transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="font-sans text-[15px] text-[#201914]/70 leading-[1.55]">
                      {recipe.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#201914]/10 space-y-2">
                  {recipe.benefits.map((b, bIdx) => (
                    <div
                      key={bIdx}
                      className="flex items-center gap-2.5 font-sans text-[14px] text-[#201914]/85"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2D3622] shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Cara Penyimpanan & Perhatian */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Storage Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="bg-[#D7D1C3] rounded-[24px] p-8 sm:p-12 text-[#201914] space-y-6 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#201914] shadow-sm">
              <Refrigerator className="w-5 h-5 text-[#2D3622]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-sans text-2xl sm:text-3xl font-normal">
                Cara Penyimpanan yang Tepat
              </h3>
              <p className="font-sans text-[16px] text-[#201914]/75">
                Karena diracik dari rempah alami murni tanpa pengawet kimia,
                simpan lulur dengan cara berikut:
              </p>
            </div>
            <ul className="space-y-3 font-sans text-[15px] text-[#201914]/85">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#201914] mt-2 shrink-0" />
                <span>
                  <strong>Simpan di dalam kulkas (chiller):</strong> Menjaga
                  kesegaran rempah hingga 3–6 bulan dan memberi efek dingin
                  menyegarkan saat dipakai.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#201914] mt-2 shrink-0" />
                <span>
                  <strong>Tutup rapat pot setelah dipakai:</strong> Mencegah
                  udara lembap masuk ke dalam wadah utama.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#201914] mt-2 shrink-0" />
                <span>
                  <strong>Gunakan sendok kering & bersih:</strong> Hindari
                  mengambil lulur langsung dengan jari basah.
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Caution & Patch Test Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-[24px] p-8 sm:p-12 text-[#201914] flex flex-col justify-between gap-6 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-[#D7D1C3] flex items-center justify-center text-[#201914] shadow-sm">
                <ShieldAlert className="w-5 h-5 text-[#201914]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans text-2xl sm:text-3xl font-normal">
                  Uji Kepekaan Kulit (Patch Test)
                </h3>
                <p className="font-sans text-[16px] text-[#201914]/75">
                  Oleskan sedikit pasta lulur pada lipatan siku selama 5 menit
                  sebelum pemakaian pertama untuk memastikan kecocokan kulit.
                </p>
              </div>
              <ul className="space-y-2.5 font-sans text-[15px] text-[#201914]/80">
                {CAUTIONS.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#201914] mt-2 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Magnetic strength={0.22}>
                <Link
                  href="/pesan"
                  className="group/roll whitespace-nowrap px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[14px] sm:text-[15px] font-medium inline-flex items-center gap-2.5 transition-all shadow-md active:scale-95 shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4A359] shrink-0" />
                  <RollingText text="Pesan Sekarang • Rp 35.000" />
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
