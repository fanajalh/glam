"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Magnetic,
  RollingText,
  CharReveal,
  Reveal,
} from "@/components/ui/Animations";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Subtle scroll parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-2 sm:pt-3 pb-1.5"
    >
      {/* Orvéli Hero Container: responsive height, r: 24px */}
      <div className="relative w-full rounded-[24px] overflow-hidden h-[86vh] sm:h-[92vh] min-h-[500px] sm:min-h-[640px] max-h-[960px] flex items-center justify-center bg-[#201914]">
        {/* Hero Background Photo: Zoom scale(1.12 -> 1) */}
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          style={{ y: bgY }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/orveli/hero-bg.png"
            alt="Gentle on Skin, Gentle on Nature"
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        {/* Orvéli Centered Vertical Glass Panel */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[560px] lg:w-[688px] z-10 bg-black/[0.04] pointer-events-none" />

        {/* Hero Content: Centered exactly within the panel */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-20 max-w-[700px] mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6 pt-6 sm:pt-10 flex flex-col items-center justify-center"
        >
          {/* Main Heading: 2 baris rapi dan simetris */}
          <h1 className="font-sans font-normal text-3xl sm:text-6xl lg:text-[76px] text-[#F1E6D8] tracking-[-0.04em] leading-[1.08] flex flex-col items-center text-center">
            <CharReveal
              text="Gentle on Skin,"
              delay={0.1}
              stagger={0.02}
              animateImmediate
            />
            <CharReveal
              text="Gentle on Nature"
              delay={0.28}
              stagger={0.02}
              animateImmediate
            />
          </h1>

          {/* Subtitle: Ringkas langsung ke inti */}
          <Reveal direction="up" delay={0.42}>
            <p className="font-sans text-[15px] sm:text-[19px] text-[#F1E6D8]/85 max-w-[460px] mx-auto leading-[1.45] text-center">
              Lulur rempah alami Bugis. Mencerahkan dan menghaluskan kulit tanpa bahan kimia.
            </p>
          </Reveal>

          {/* Frosted Pill Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5"
          >
            <Magnetic strength={0.22}>
              <Link
                href="/produk"
                className="group/roll inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#F1E6D8]/20 hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] backdrop-blur-[10px] text-[14px] sm:text-[16px] font-inter font-medium transition-all duration-300"
              >
                <RollingText text="Lihat Produk" />
              </Link>
            </Magnetic>

            <Magnetic strength={0.22}>
              <Link
                href="/pesan"
                className="group/roll inline-flex items-center justify-center px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-black/30 hover:bg-[#F1E6D8]/20 text-[#F1E6D8] backdrop-blur-[10px] text-[14px] sm:text-[16px] font-inter font-medium transition-all duration-300"
              >
                <RollingText text="Pesan Lulur • Rp 35k" />
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
