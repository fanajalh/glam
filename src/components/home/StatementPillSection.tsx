"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CharReveal } from "@/components/ui/Animations";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function StatementPillSection() {
  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      {/* Orvéli Statement Section: compact on mobile, r: 24px */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#201914] min-h-[260px] sm:min-h-[380px] lg:h-[428px] py-10 sm:py-16 px-4 sm:px-8 lg:px-12 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 text-center">
          {/* Row 1: [Pill 1] + "Koleksi lulur" + [Pill 2] + "alami" */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-5">
            {/* Pill 1 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
              className="relative w-[68px] sm:w-[125px] h-[46px] sm:h-[86px] rounded-[78px] overflow-hidden shrink-0"
            >
              <Image
                src="/images/orveli/pill-1.png"
                alt="Botanical leaf detail"
                fill
                className="object-cover object-center"
              />
            </motion.div>

            <span className="font-sans text-xl sm:text-4xl lg:text-[48px] font-normal text-[#F1E6D8] tracking-[-0.02em] leading-[1.15]">
              <CharReveal text="Koleksi lulur" mode="word" delay={0.12} />
            </span>

            {/* Pill 2 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, delay: 0.22, ease: EASE }}
              className="relative w-[68px] sm:w-[125px] h-[46px] sm:h-[86px] rounded-[78px] overflow-hidden shrink-0"
            >
              <Image
                src="/images/orveli/pill-2.png"
                alt="Natural skincare texture"
                fill
                className="object-cover object-center"
              />
            </motion.div>

            <span className="font-sans text-xl sm:text-4xl lg:text-[48px] font-normal text-[#F1E6D8] tracking-[-0.02em] leading-[1.15]">
              <CharReveal text="alami" mode="word" delay={0.28} />
            </span>
          </div>

          {/* Row 2: "rempah murni Bugis" + [Pill 3] + "setiap hari" */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-5">
            <span className="font-sans text-xl sm:text-4xl lg:text-[48px] font-normal text-[#F1E6D8] tracking-[-0.02em] leading-[1.15]">
              <CharReveal text="rempah murni Bugis" mode="word" delay={0.2} />
            </span>

            {/* Pill 3 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, delay: 0.32, ease: EASE }}
              className="relative w-[68px] sm:w-[125px] h-[46px] sm:h-[86px] rounded-[78px] overflow-hidden shrink-0"
            >
              <Image
                src="/images/orveli/pill-3.png"
                alt="Botanical dropper care"
                fill
                className="object-cover object-center"
              />
            </motion.div>

            <span className="font-sans text-xl sm:text-4xl lg:text-[48px] font-normal text-[#F1E6D8] tracking-[-0.02em] leading-[1.15]">
              <CharReveal text="setiap hari" mode="word" delay={0.38} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
