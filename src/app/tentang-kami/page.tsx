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
import { useSiteContent } from "@/context/SiteContentContext";

const VALUE_ICONS = [Search, Leaf, HeartHandshake, FlaskConical];
const GALLERY_IMAGES = [
  "/images/glam/jar-real-hand.jpg",
  "/images/glam/jar-powder-texture.jpg",
  "/images/glam/jar-batik-spices.jpg",
];

export default function TentangKamiPage() {
  const { tentangKami } = useSiteContent();
  const VALUES = tentangKami.values.map((v, idx) => ({
    icon: VALUE_ICONS[idx % VALUE_ICONS.length],
    title: v.title,
    desc: v.desc,
  }));
  const TEAM = tentangKami.gallery.map((g, idx) => ({
    name: g.name,
    role: g.role,
    image: GALLERY_IMAGES[idx % GALLERY_IMAGES.length],
  }));
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
    <div className="w-full bg-[#FFF5F6]">
      {/* 1. Hero with Animated Parallax & Zoom-out */}
      <section
        ref={heroRef}
        className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-3 pb-1.5"
      >
        <div className="relative w-full rounded-[24px] overflow-hidden h-[66vh] min-h-[480px] max-h-[680px] flex items-center justify-center bg-[#2B1B1D]">
          <motion.div
            style={{ y: heroBgY, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/images/glam/jar-studio-pedestal.jpg"
              alt="Tentang Glam & Glow Lulur Badda Lotong"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2B1B1D]/45 via-[#4D2E33]/30 to-[#2B1B1D]/55" />
          </motion.div>

          {/* Centered Vertical Glass Panel */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[345px] sm:w-[560px] lg:w-[688px] z-10 bg-black/[0.04] pointer-events-none" />

          <motion.div
            style={{ y: heroContentY, opacity: heroOpacity }}
            className="relative z-20 max-w-[720px] mx-auto px-4 sm:px-6 text-center space-y-5 pt-10"
          >
            <h1 className="font-sans font-normal text-4xl sm:text-6xl lg:text-[76px] text-[#FBF1F2] tracking-[-0.04em] leading-[1.06] flex flex-col items-center">
              <CharReveal
                text={tentangKami.heroLine1}
                delay={0.1}
                stagger={0.02}
                animateImmediate
              />
              <CharReveal
                text={tentangKami.heroLine2}
                delay={0.28}
                stagger={0.02}
                animateImmediate
              />
            </h1>
            <Reveal direction="up" delay={0.45}>
              <p className="font-sans text-[17px] sm:text-[19px] text-[#FBF1F2]/85 max-w-[480px] mx-auto leading-[1.5]">
                {tentangKami.heroSubtitle}
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
        <div className="w-full rounded-[24px] bg-[#F9E6E9] border border-[#C98A8B]/20 text-[#2B1B1D] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Portrait Image with Dynamic Scroll-Traced Zoom */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-[460px] sm:h-[580px] rounded-[20px] bg-[#EAD0D5] overflow-hidden shadow-card">
              <motion.div
                style={{ scale: originScale, y: originY }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/glam/jar-bugis-pinisi.jpg"
                  alt="Asal usul Glam & Glow Lulur Badda Lotong"
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
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/85 border border-[#C98A8B]/25 font-inter text-[13px] font-semibold text-[#9E5E63]">
                  {tentangKami.originBadge}
                </span>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <h2 className="font-sans text-3xl sm:text-5xl lg:text-[54px] font-normal text-[#2B1B1D] tracking-[-0.03em] leading-[1.08]">
                  {tentangKami.originTitle}
                </h2>
              </Reveal>
            </div>

            <div className="space-y-4 font-sans text-[16px] sm:text-[18px] text-[#6E5156] leading-[1.6]">
              <Reveal direction="up" delay={0.18}>
                <p>{tentangKami.originPara1}</p>
              </Reveal>
              <Reveal direction="up" delay={0.24}>
                <p>{tentangKami.originPara2}</p>
              </Reveal>
            </div>

            {/* 3 Stat Columns with Smooth Stagger Reveal */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#C98A8B]/25">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="font-sans text-3xl sm:text-5xl font-normal text-[#2B1B1D]">
                  {tentangKami.stat1Value}
                </div>
                <div className="font-inter text-[13px] sm:text-[14px] text-[#6E5156] mt-1">
                  {tentangKami.stat1Label}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="font-sans text-3xl sm:text-5xl font-normal text-[#2B1B1D]">
                  {tentangKami.stat2Value}
                </div>
                <div className="font-inter text-[13px] sm:text-[14px] text-[#6E5156] mt-1">
                  {tentangKami.stat2Label}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="font-sans text-3xl sm:text-5xl font-normal text-[#9E5E63]">
                  {tentangKami.stat3Value}
                </div>
                <div className="font-inter text-[13px] sm:text-[14px] text-[#6E5156] mt-1">
                  {tentangKami.stat3Label}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values Section with Floating Interactive Cards */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#4D2E33] text-[#FBF1F2] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-14">
          <div className="max-w-[680px] space-y-4">
            <Reveal direction="up" delay={0.05}>
              <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#E7B6B4] block">
                {tentangKami.standardsEyebrow}
              </span>
            </Reveal>
            <Reveal direction="up" delay={0.12}>
              <h2 className="font-sans text-3xl sm:text-5xl lg:text-[56px] font-normal text-[#FBF1F2] tracking-[-0.03em] leading-[1.08]">
                {tentangKami.standardsTitle}
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
                  <div className="w-12 h-12 rounded-full bg-white/[0.08] group-hover:bg-[#E7B6B4] group-hover:text-[#2B1B1D] flex items-center justify-center text-[#E7B6B4] shrink-0 transition-colors duration-300 shadow-sm">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="space-y-2.5">
                    <h3 className="font-sans text-[20px] sm:text-[22px] font-normal text-[#FBF1F2] group-hover:text-[#E7B6B4] transition-colors">
                      {val.title}
                    </h3>
                    <p className="font-sans text-[15px] text-[#FBF1F2]/70 leading-[1.55]">
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-6">
            <ScrollWordReveal
              text={tentangKami.standardsQuote}
              highlightWords={["sejati", "alam", "Nusantara", "terbaik"]}
              className="font-sans text-2xl sm:text-3xl lg:text-[34px] leading-[1.3]"
              activeColor="#FBF1F2"
              highlightColor="#FBF1F2"
            />
          </div>
        </div>
      </section>

      {/* 4. People / Makers Section with Hover Tilt */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
        <div className="w-full rounded-[24px] bg-[#F3DFE2] text-[#2B1B1D] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <Reveal direction="up" delay={0.05}>
                <span className="font-inter text-[13px] uppercase tracking-[0.14em] text-[#2B1B1D]/65 block">
                  {tentangKami.makersEyebrow}
                </span>
              </Reveal>
              <Reveal direction="up" delay={0.12}>
                <h2 className="font-sans text-3xl sm:text-5xl lg:text-[56px] font-normal text-[#2B1B1D] tracking-[-0.03em] leading-[1.08]">
                  {tentangKami.makersTitle}
                </h2>
              </Reveal>
            </div>

            <Reveal direction="up" delay={0.18}>
              <Magnetic strength={0.22}>
                <Link
                  href="/pembelian"
                  className="group/roll whitespace-nowrap px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#2B1B1D] hover:bg-[#4D2E33] text-[#FBF1F2] font-inter text-[14px] sm:text-[15px] font-medium inline-flex items-center gap-2.5 transition-all shadow-md active:scale-95 shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E7B6B4] shrink-0" />
                  <RollingText text={tentangKami.makersCtaText} />
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
                <div className="relative w-full h-[340px] sm:h-[380px] rounded-[14px] overflow-hidden bg-[#4D2E33]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="px-1 space-y-1">
                  <h3 className="font-sans text-[20px] font-medium text-[#2B1B1D] group-hover:text-[#623B42] transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-sans text-[15px] text-[#2B1B1D]/68">
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
