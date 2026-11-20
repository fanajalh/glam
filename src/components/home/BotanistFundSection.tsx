"use client";

import React from "react";
import Link from "next/link";
import { Reveal, Magnetic, RollingText } from "@/components/ui/Animations";
import { useSiteContent } from "@/context/SiteContentContext";

export default function BotanistFundSection() {
  const { home } = useSiteContent();
  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      {/* Soft Rose Blush Pre-Footer CTA Container, r: 24px */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#F9E6E9] via-[#F2D6DB] to-[#EAC8CF] border border-[#C98A8B]/25 py-14 sm:py-24 px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center gap-6 sm:gap-8">
        <div className="max-w-[680px] space-y-3 sm:space-y-4 relative z-10">
          <Reveal direction="up" delay={0.05} amount={0.04}>
            <h2 className="font-sans font-normal text-3xl sm:text-5xl lg:text-[64px] text-[#2B1B1D] tracking-[-0.03em] leading-[1.08] text-center">
              {home.fundTitleLine1}<br />{home.fundTitleLine2}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.2} amount={0.04}>
            <p className="font-sans text-[15px] sm:text-[19px] text-[#6E5156] font-normal leading-[1.5] max-w-[500px] mx-auto">
              {home.fundSubtitle}
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.3} amount={0.04} className="relative z-10">
          <Magnetic strength={0.22}>
            <Link
              href="/pembelian"
              className="group/roll px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#4D2E33] hover:bg-[#2B1B1D] text-[#FBF1F2] font-sans text-[14px] sm:text-[16px] font-medium transition-all duration-300 inline-block shadow-soft"
            >
              <RollingText text={home.fundCtaText} />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
