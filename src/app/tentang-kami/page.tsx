"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Leaf,
  HeartHandshake,
  FlaskConical,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Reveal,
  StaggerContainer,
  StaggerItem,
  Magnetic,
  RollingText,
  CharReveal,
  ScrollWordReveal,
  ExpandLine,
} from "@/components/ui/Animations";

const VALUES = [
  {
    icon: Search,
    title: "Radical Transparency",
    desc: "100% komposisi rempah asli terbuka tanpa zat kimia tersembunyi.",
  },
  {
    icon: Leaf,
    title: "Rooted Botanicals",
    desc: "Bahan nabati murni: beras ketan, pandan, kunyit, cengkeh, kopi, dan jeruk nipis.",
  },
  {
    icon: HeartHandshake,
    title: "Quiet Responsibility",
    desc: "Diproduksi higienis bersama petani lokal dalam kemasan ramah lingkungan.",
  },
  {
    icon: FlaskConical,
    title: "Proven Performance",
    desc: "Resep warisan bangsawan Bugis teruji lintas generasi melembutkan kulit.",
  },
];

const TEAM = [
  {
    name: "Dapur Rempah Tradisi",
    role: "Sangrai & Formulasi Badda Lotong",
    image: "/images/orveli/team-1.jpg",
  },
  {
    name: "4 Saudara Kuki Sukses",
    role: "Pendiri & Kurator Bahan Alami",
    image: "/images/orveli/team-2.jpg",
  },
  {
    name: "Quality & Customer Care",
    role: "Pengemasan Higienis & Layanan Pelanggan",
    image: "/images/orveli/team-3.jpg",
  },
];

export default function TentangKamiPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);

  // Hero Parallax Scroll
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1.12, 1.0]);
  const heroContentY = useTransform(heroScroll, [0, 1], [0, 40]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  // Origin Section Zoom-Out
  const { scrollYProgress: originScroll } = useScroll({
    target: originRef,
    offset: ["start end", "end start"],
  });
  const rawOriginScale = useTransform(originScroll, [0.1, 0.5, 0.9], [1.2, 1.0, 0.98]);
  const originScale = useSpring(rawOriginScale, { stiffness: 90, damping: 26 });
  const originY = useTransform(originScroll, [0.1, 0.9], [-20, 20]);

  return (
    <div className="w-full bg-[#F1E6D8]">
      {/* 1. Hero with Animated Parallax & Zoom-out */}
      <section
        ref={heroRef}
        className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-3 pb-1.5"
      >
        <div className="relative w-full rounded-[24px] overflow-hidden h-[66vh] min-h-[480px] max-h-[680px] flex items-center justify-center bg-[#201914]">
          <motion.div
            style={{ y: heroBgY, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/images/orveli/about-hero.png"
              alt="Born from the belief that less is more"
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
            className="relative z-20 max-w-[720px] mx-auto px-4 sm:px-6 text-center space-y-5 pt-10"
          >
            <h1 className="font-sans font-normal text-4xl sm:text-6xl lg:text-[76px] text-[#F1E6D8] tracking-[-0.04em] leading-[1.06] flex flex-col items-center">
              <CharReveal
                text="Born from the belief"
                delay={0.1}
                stagger={0.02}
                animateImmediate
              />
              <CharReveal
                text="that less is more"
                delay={0.28}
                stagger={0.02}
                animateImmediate
              />
            </h1>
            <Reveal direction="up" delay={0.45}>
              <p className="font-sans text-[17px] sm:text-[19px] text-[#F1E6D8]/85 max-w-[480px] mx-auto leading-[1.5]">
                Mengangkat rahasia lulur hitam tradisional masyarakat Bugis ke
                dalam perawatan tubuh modern yang murni, jujur, dan menenangkan.
              </p>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* 2. Origin Story Section with Dynamic Zoom-out & Parallax */}
      <section
        ref={originRef}
        className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5"
      >
        <div className="w-full rounded-[24px] bg-[#2D3622] text-[#F1E6D8] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Portrait Image with Dynamic Scroll-Traced Zoom */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-[460px] sm:h-[580px] rounded-[20px] bg-[#201914] overflow-hidden shadow-2xl">
              <motion.div
                style={{ scale: originScale, y: originY }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/orveli/about-origin.png"
                  alt="Origin of Glam & Glow Badda Lotong"
                  fill
                  className="object-cover object-center"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Narrative + 3 Stats */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <Reveal direction="up" delay={0.05}>
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.08] font-inter text-[13px] text-[#D4A359]">
                  Our Origin • Tradisi Sulawesi Selatan
                </span>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <h2 className="font-sans text-3xl sm:text-5xl lg:text-[54px] font-normal text-[#F1E6D8] tracking-[-0.03em] leading-[1.08]">
                  Started at a kitchen table, rooted in Bugis heritage
                </h2>
              </Reveal>
            </div>

            <div className="space-y-4 font-sans text-[16px] sm:text-[18px] text-[#F1E6D8]/78 leading-[1.6]">
              <Reveal direction="up" delay={0.18}>
                <p>
                  Secara etimologis, <em>Badda Lotong</em> dalam bahasa Bugis
                  berarti <strong>“Bedak / Lulur Hitam”</strong>. Sejak ratusan
                  tahun silam di Sulawesi Selatan, racikan ini digunakan oleh para
                  putri bangsawan dan calon mempelai dalam ritual <em>Mappacci</em>{" "}
                  untuk menghaluskan serta mencerahkan kulit secara alami.
                </p>
              </Reveal>
              <Reveal direction="up" delay={0.24}>
                <p>
                  Dipelopori oleh <strong>4 Saudara Kuki Sukses</strong> di
                  Makassar, Glam & Glow menghadirkan kembali keaslian beras ketan
                  sangrai, daun pandan, cengkeh, kunyit, jeruk nipis, dan kopi
                  murni dalam kemasan pot 400 gram yang praktis tanpa pengawet
                  sintetis.
                </p>
              </Reveal>
            </div>

            {/* 3 Stat Columns with Smooth Stagger Reveal */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="font-sans text-3xl sm:text-5xl font-normal text-[#F1E6D8]">
                  6
                </div>
                <div className="font-inter text-[13px] sm:text-[14px] text-[#F1E6D8]/68 mt-1">
                  Rempah Murni Pilihan
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="font-sans text-3xl sm:text-5xl font-normal text-[#F1E6D8]">
                  0%
                </div>
                <div className="font-inter text-[13px] sm:text-[14px] text-[#F1E6D8]/68 mt-1">
                  Bahan Kimia Sintetis
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="font-sans text-3xl sm:text-5xl font-normal text-[#D4A359]">
                  400g
                </div>
                <div className="font-inter text-[13px] sm:text-[14px] text-[#F1E6D8]/68 mt-1">
                  Rp 35.000 / Pot Hemat
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values Section with Floating Interactive Cards */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#201914] text-[#F1E6D8] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-14">
          <div className="max-w-[680px] space-y-4">
            <Reveal direction="up" delay={0.05}>
              <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#D4A359] block">
                Our Standards
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <h2 className="font-sans text-3xl sm:text-5xl lg:text-[56px] font-normal text-[#F1E6D8] tracking-[-0.03em] leading-[1.08]">
                Four things we don’t move on
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * idx,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-[18px] bg-white/[0.04] p-6 sm:p-7 flex flex-col justify-between gap-6 h-full transition-colors duration-300 hover:bg-white/[0.07] shadow-lg group cursor-default"
                >
                  <div className="w-12 h-12 rounded-full bg-white/[0.08] group-hover:bg-[#D4A359] group-hover:text-[#201914] flex items-center justify-center text-[#D4A359] shrink-0 transition-colors duration-300 shadow-sm">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="space-y-2.5">
                    <h3 className="font-sans text-[20px] sm:text-[22px] font-normal text-[#F1E6D8] group-hover:text-[#D4A359] transition-colors">
                      {val.title}
                    </h3>
                    <p className="font-sans text-[15px] text-[#F1E6D8]/70 leading-[1.55]">
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-6">
            <ScrollWordReveal
              text="“Kecantikan sejati tidak membutuhkan bahan kimia keras; alam Nusantara telah menyediakan segala rempah terbaik untuk merawat kelembutan kulit Anda.”"
              highlightWords={["sejati", "alam", "Nusantara", "terbaik"]}
              className="font-sans text-2xl sm:text-3xl lg:text-[34px] leading-[1.3]"
              activeColor="#F1E6D8"
              highlightColor="#F1E6D8"
            />
          </div>
        </div>
      </section>

      {/* 4. People / Makers Section with Hover Tilt */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#D7D1C3] text-[#201914] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <Reveal direction="up" delay={0.05}>
                <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#201914]/65 block">
                  The Makers
                </span>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <h2 className="font-sans text-3xl sm:text-5xl lg:text-[56px] font-normal text-[#201914] tracking-[-0.03em] leading-[1.08]">
                  Small team, long view
                </h2>
              </Reveal>
            </div>

            <Reveal direction="up" delay={0.18}>
              <Magnetic strength={0.22}>
                <Link
                  href="/pesan"
                  className="group/roll whitespace-nowrap px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[14px] sm:text-[15px] font-medium inline-flex items-center gap-2.5 transition-all shadow-md active:scale-95 shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4A359] shrink-0" />
                  <RollingText text="Pesan Lulur • Rp 35.000" />
                </Link>
              </Magnetic>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.12 * i }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[22px] p-5 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative w-full h-[340px] sm:h-[380px] rounded-[14px] overflow-hidden bg-[#2D3622]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="px-1 space-y-1">
                  <h3 className="font-sans text-[20px] font-medium text-[#201914] group-hover:text-[#4E2719] transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-sans text-[15px] text-[#201914]/68">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
