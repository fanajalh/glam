"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Reveal,
  ScrollWordReveal,
  RollingText,
} from "@/components/ui/Animations";

export default function MissionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Hook scroll progress for dynamic zoom out & arrow trace
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Zoom-out transform: starts zoomed in (1.2) when entering, zooms out smoothly to (1.0)
  const rawModelScale = useTransform(
    scrollYProgress,
    [0.1, 0.45, 0.85],
    [1.22, 1.0, 0.98]
  );
  const modelScale = useSpring(rawModelScale, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  });

  const rawProductScale = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.9],
    [1.18, 1.0, 1.02]
  );
  const productScale = useSpring(rawProductScale, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  });

  // Parallax Y drift
  const modelY = useTransform(scrollYProgress, [0.1, 0.9], [-25, 25]);
  const smoothModelY = useSpring(modelY, { stiffness: 90, damping: 25 });

  // Arrow drawing progress percentage (0 to 100)
  const arrowClip = useTransform(
    scrollYProgress,
    [0.2, 0.55],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );
  const arrowOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5"
    >
      {/* Outer Container: bg #201914, r: 24px, tighter padding to edges */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#201914] min-h-0 py-12 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-12 flex flex-col justify-between gap-10">
        {/* Top Word-by-Word Scroll Opacity Statement */}
        <div className="relative z-10 w-full">
          <ScrollWordReveal
            text="Glam & Glow diformulasikan dari beras ketan pilihan, daun pandan, kunyit, kopi, dan rempah tradisi Bugis untuk merawat kulit tanpa bahan kimia sintetik."
            highlightWords={[
              "Glam",
              "Glow",
              "rempah",
              "Bugis",
              "merawat",
              "kulit",
            ]}
            className="font-sans text-xl sm:text-3xl lg:text-[36px] leading-[1.3] sm:leading-[1.25] tracking-[-0.01em]"
            activeColor="#F1E6D8"
            highlightColor="#F1E6D8"
          />
        </div>

        {/* Bottom Content Row: Left Exclusion + Animated Drawing Arrow, Right 2 Zoom-out Images */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-4 sm:pt-8">
          {/* Left Column: Exclusion text + Dynamically Drawn Curved Arrow */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full relative">
            <Reveal direction="up" delay={0.1}>
              <p className="font-sans text-[16px] sm:text-[20px] text-[#F1E6D8]/90 font-normal leading-[1.5] max-w-[340px]">
                Bebas dari 1.500+ zat kimia berbahaya, pewarna sintetik, paraben, dan merkuri.
              </p>
            </Reveal>

            {/* Exact Orvéli Curved Arc Arrow with Dynamic Scroll-Traced Drawing */}
            <div className="mt-6 lg:mt-12 overflow-visible">
              <motion.svg
                style={{ clipPath: arrowClip, opacity: arrowOpacity }}
                width="557"
                height="363"
                viewBox="0 0 557 363"
                fill="none"
                className="w-[260px] sm:w-[460px] lg:w-[520px] h-auto pointer-events-none transition-all duration-150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.55079 1.25155e-05L7.53085 5.29584L1.9545 4.36271L5.55079 1.25155e-05ZM556.405 301.582C556.67 301.638 556.838 301.899 556.781 302.163L555.854 306.471C555.797 306.736 555.536 306.904 555.272 306.847C555.007 306.79 554.839 306.53 554.896 306.265L555.72 302.436L551.891 301.612C551.627 301.555 551.459 301.294 551.515 301.03C551.572 300.765 551.833 300.597 552.097 300.654L556.405 301.582ZM4.81953 4.36997L5.30295 4.44781C-18.7425 153.778 60.2407 265.938 174.604 321.852C288.987 377.776 438.717 377.405 556.037 301.649L556.302 302.06L556.568 302.472C438.934 378.431 288.837 378.793 174.174 322.732C59.4923 266.662 -19.7893 154.119 4.33612 4.29213L4.81953 4.36997Z"
                  fill="#F1E6D8"
                  fillOpacity="0.45"
                />
              </motion.svg>
            </div>
          </div>

          {/* Right Column: Primary Model Portrait + Secondary Product with Zoom-Out Animation */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-end gap-5 justify-end">
            {/* Primary Model Portrait: Zooms out smoothly from 1.2 to 1.0 */}
            <div className="w-full sm:w-[360px] lg:w-[424px]">
              <div className="relative w-full h-[320px] sm:h-[460px] lg:h-[600px] rounded-[16px] bg-[#2D3622] overflow-hidden shadow-2xl">
                <motion.div
                  style={{
                    scale: modelScale,
                    y: smoothModelY,
                  }}
                  className="w-full h-full relative"
                >
                  <Image
                    src="/images/orveli/mission-model.png"
                    alt="Glam & Glow Botanical Skincare"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 424px"
                  />
                </motion.div>
              </div>
            </div>

            {/* Secondary Column: Product Card (with zoom out) + Rolling Shop Now Link */}
            <div className="w-full sm:w-[200px] flex flex-col justify-between h-auto sm:h-[460px] lg:h-[600px] gap-4">
              {/* Product Card with Zoom-Out Scale */}
              <div className="relative w-full h-[180px] sm:h-[240px] rounded-[16px] bg-[#D7D1C3] overflow-hidden flex items-center justify-center p-4 shadow-md">
                <motion.div
                  style={{ scale: productScale }}
                  className="w-full h-full relative flex items-center justify-center"
                >
                  <Image
                    src="/images/orveli/mission-small.png"
                    alt="Glam & Glow Botanical Formula"
                    fill
                    className="object-contain object-center p-3 hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              </div>

              {/* Orvéli Rolling Link with Bottom Line */}
              <Reveal direction="up" delay={0.2} className="pb-2">
                <Link
                  href="/produk"
                  className="group/roll inline-flex flex-col text-[#F1E6D8] font-inter text-[15px] sm:text-[16px] font-medium"
                >
                  <span className="pb-1">
                    <RollingText text="Lihat Produk" />
                  </span>
                  <span className="h-[1.5px] w-full bg-[#F1E6D8]" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
