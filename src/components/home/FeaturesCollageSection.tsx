"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Leaf,
  HeartHandshake,
  FlaskConical,
  LucideIcon,
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Reveal,
  ScrollWordReveal,
  BotanicalMarkDraw,
  Magnetic,
  RollingText,
} from "@/components/ui/Animations";

interface FrostedGlassCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

function FrostedGlassCard({ icon: Icon, title, desc }: FrostedGlassCardProps) {
  return (
    <div
      style={{
        backgroundColor: "rgba(50, 60, 40, 0.55)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
      }}
      className="w-full rounded-[18px] sm:rounded-[20px] p-4 sm:p-7 text-[#F1E6D8] space-y-2.5 sm:space-y-4"
    >
      {/* Icon Circle */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/[0.08] flex items-center justify-center text-[#F1E6D8]">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A359]" />
      </div>

      {/* Title */}
      <h3 className="font-sans text-[17px] sm:text-[22px] font-normal tracking-[-0.01em] text-[#F1E6D8] leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="font-sans text-[13px] sm:text-[15px] font-normal text-[#F1E6D8]/75 leading-[1.5]">
        {desc}
      </p>
    </div>
  );
}

export default function FeaturesCollageSection() {
  const collageRef = useRef<HTMLDivElement>(null);

  // Scroll parallax & zoom progress tracking
  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });

  // Balanced floating parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [35, -45]);
  const y2 = useTransform(scrollYProgress, [0, 1], [20, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [45, -55]);
  const y4 = useTransform(scrollYProgress, [0, 1], [55, -65]);
  const bottleY = useTransform(scrollYProgress, [0, 1], [15, -20]);

  // Zoom-out transform on the central bottle image: 1.22 -> 1.0 -> 0.98
  const rawBottleScale = useTransform(
    scrollYProgress,
    [0.08, 0.48, 0.9],
    [1.22, 1.0, 0.98]
  );
  const bottleScale = useSpring(rawBottleScale, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  // Animated drawing arrow clip
  const arrowClip = useTransform(
    scrollYProgress,
    [0.18, 0.62],
    ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]
  );
  const arrowOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);

  // Spring physics for silky, stutter-free 60fps scrolling
  const smoothY1 = useSpring(y1, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const smoothY2 = useSpring(y2, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const smoothY3 = useSpring(y3, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const smoothY4 = useSpring(y4, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const smoothBottleY = useSpring(bottleY, { stiffness: 90, damping: 26, restDelta: 0.001 });

  const promises = [
    {
      icon: Search,
      title: "Radical Transparency",
      desc: "100% komposisi rempah asli terbuka tanpa zat kimia tersembunyi.",
    },
    {
      icon: Leaf,
      title: "Rooted Botanicals",
      desc: "Bahan nabati murni dari petani lokal Sulawesi Selatan.",
    },
    {
      icon: HeartHandshake,
      title: "Quiet Responsibility",
      desc: "Diproduksi higienis, ramah lingkungan, dan tanpa uji hewan.",
    },
    {
      icon: FlaskConical,
      title: "Proven Performance",
      desc: "Khasiat lulur tradisional Bugis teruji melembutkan kulit.",
    },
  ];

  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      {/* Outer Card: bg #2D3622, r: 24px, overflow-clip allows sticky children to follow scroll */}
      <div className="relative w-full rounded-[24px] overflow-clip bg-[#2D3622] py-12 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-between">
        
        {/* Top Header Row */}
        <div className="relative z-20 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-10 lg:pb-16 max-w-[1360px] mx-auto w-full">
          <div className="max-w-[660px] space-y-4">
            <BotanicalMarkDraw />

            <ScrollWordReveal
              text="Four promises in every bottle. Transparansi penuh, rempah nabati murni, produksi etis, dan hasil nyata untuk kulit Anda."
              highlightWords={[
                "promises",
                "Transparansi",
                "rempah",
                "nabati",
                "etis",
                "nyata",
              ]}
              className="font-sans text-2xl sm:text-3xl lg:text-[36px] leading-[1.24] tracking-[-0.01em]"
              activeColor="#F1E6D8"
              highlightColor="#F1E6D8"
            />
          </div>

          <Reveal direction="up" delay={0.2} className="shrink-0">
            <Magnetic strength={0.22}>
              <Link
                href="/pesan"
                className="group/roll px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#F1E6D8]/20 hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] backdrop-blur-[10px] font-sans text-[14px] sm:text-[16px] font-medium transition-all duration-300 inline-block"
              >
                <RollingText text="Pesan Sekarang" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        {/* Collage Container */}
        <div ref={collageRef} className="relative z-10 w-full max-w-[1360px] mx-auto">
          
          {/* ================= DESKTOP STICKY SCROLL COLLAGE (xl and above) ================= */}
          <div className="hidden xl:block relative w-full min-h-[1750px]">
            {/* Sticky Bottle Track: Pinned in viewport center while scrolling through 4 promises */}
            <div className="sticky top-20 xl:top-24 w-full flex justify-center pointer-events-none z-0">
              <motion.div
                style={{
                  y: smoothBottleY,
                  scale: bottleScale,
                }}
                className="w-[820px] xl:w-[872px] h-[78vh] min-h-[580px] max-h-[860px] rounded-[24px] overflow-hidden bg-[#201914] shadow-2xl relative"
              >
                <Image
                  src="/images/orveli/feature-bottle.png"
                  alt="Four Promises in Every Bottle"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="872px"
                />
              </motion.div>
            </div>

            {/* Curved Arrow SVG with Dynamic Drawing Traced by Scroll */}
            <div className="sticky top-[180px] left-0 w-full flex justify-center pointer-events-none z-10 -mt-[70vh]">
              <div className="relative w-[872px] h-[624px]">
                <div className="absolute top-[60px] left-[780px] w-[407px] h-[624px]">
                  <motion.svg
                    style={{ clipPath: arrowClip, opacity: arrowOpacity }}
                    viewBox="0 0 407.228 623.695"
                    xmlns="http://www.w3.org/2000/svg"
                    width="407"
                    height="624"
                    fill="none"
                    className="w-full h-auto transition-all duration-150"
                  >
                    <path
                      fill="#F1E6D8"
                      fillOpacity=".45"
                      d="m87.014.64 4.6 3.287.546-5.627zM235.257 610.9a.49.49 0 0 0 .464.513l4.401.223a.49.49 0 0 0 .05-.978l-3.912-.198.198-3.912a.49.49 0 1 0-.978-.05zM91.424 1.068l-.05.487C241.825 17.1 329.636 122.49 353.946 247.449c24.313 124.98-14.915 269.48-118.529 363.112l.329.363.328.363c103.891-93.881 143.206-238.74 118.832-364.024C330.531 121.957 242.427 16.177 91.474.582z"
                    />
                  </motion.svg>
                </div>
              </div>
            </div>

            {/* Floating Cards that scroll past the sticky bottle */}
            <div className="relative z-20 pointer-events-auto -mt-[64vh] space-y-[320px] pb-36">
              {/* Row 1: Radical Transparency & Rooted Botanicals */}
              <div className="flex justify-between items-start px-2">
                <motion.div
                  style={{ y: smoothY1 }}
                  className="w-[320px] cursor-default"
                >
                  <FrostedGlassCard
                    icon={promises[0].icon}
                    title={promises[0].title}
                    desc={promises[0].desc}
                  />
                </motion.div>

                <motion.div
                  style={{ y: smoothY2 }}
                  className="w-[320px] cursor-default mt-16"
                >
                  <FrostedGlassCard
                    icon={promises[1].icon}
                    title={promises[1].title}
                    desc={promises[1].desc}
                  />
                </motion.div>
              </div>

              {/* Row 2: Quiet Responsibility & Proven Performance */}
              <div className="flex justify-between items-start px-8">
                <motion.div
                  style={{ y: smoothY3 }}
                  className="w-[320px] cursor-default"
                >
                  <FrostedGlassCard
                    icon={promises[2].icon}
                    title={promises[2].title}
                    desc={promises[2].desc}
                  />
                </motion.div>

                <motion.div
                  style={{ y: smoothY4 }}
                  className="w-[320px] cursor-default mt-20"
                >
                  <FrostedGlassCard
                    icon={promises[3].icon}
                    title={promises[3].title}
                    desc={promises[3].desc}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* ================= TABLET & MOBILE RESPONSIVE LAYOUT (< xl) ================= */}
          <div className="xl:hidden flex flex-col items-center gap-8 w-full">
            {/* Centered Compact Bottle Image with Smooth Scale */}
            <div className="relative w-full max-w-[420px] h-[300px] sm:h-[400px] rounded-[20px] overflow-hidden bg-[#201914] shadow-xl">
              <motion.div style={{ scale: bottleScale }} className="w-full h-full relative">
                <Image
                  src="/images/orveli/feature-bottle.png"
                  alt="Four Promises in Every Bottle"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, 420px"
                />
              </motion.div>
            </div>

            {/* 4 Promises Clean Mobile Grid (2x2 on sm, 1-col on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full">
              {promises.map((item, idx) => (
                <Reveal key={item.title} direction="up" delay={0.06 * idx}>
                  <FrostedGlassCard
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
