"use client";

import React from "react";
import Link from "next/link";
import { Reveal, Magnetic, RollingText } from "@/components/ui/Animations";

export default function BotanistFundSection() {
  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      {/* Orvéli Botanist Fund Container: compact responsive, r: 24px */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#2D3622] py-14 sm:py-24 px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center gap-6 sm:gap-8">
        <div className="max-w-[680px] space-y-3 sm:space-y-4 relative z-10">
          <Reveal direction="up" delay={0.05} amount={0.04}>
            <h2 className="font-sans font-normal text-3xl sm:text-5xl lg:text-[64px] text-[#F1E6D8] tracking-[-0.03em] leading-[1.08] text-center">
              The Botanist<br />Fund
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.2} amount={0.04}>
            <p className="font-sans text-[15px] sm:text-[19px] text-[#F1E6D8]/80 font-normal leading-[1.5] max-w-[500px] mx-auto">
              Sebagian keuntungan disalurkan langsung untuk petani rempah lokal Sulawesi Selatan.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.3} amount={0.04} className="relative z-10">
          <Magnetic strength={0.22}>
            <Link
              href="/pesan"
              className="group/roll px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#F1E6D8]/20 hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] backdrop-blur-[10px] font-sans text-[14px] sm:text-[16px] font-medium transition-all duration-300 inline-block"
            >
              <RollingText text="Pesan Sekarang" />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
