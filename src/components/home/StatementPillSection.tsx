"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CharReveal } from "@/components/ui/Animations";
import { useSiteContent } from "@/context/SiteContentContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function StatementPillSection() {
  const { home } = useSiteContent();
  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      {/* Statement Section: Soft Blush Silk #F9E6E9, r: 24px */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#F9E6E9] border border-[#C98A8B]/20 min-h-[260px] sm:min-h-[380px] lg:h-[428px] py-10 sm:py-16 px-4 sm:px-8 lg:px-12 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 text-center">
          {/* Row 1: [Pill 1] + "Koleksi lulur" + [Pill 2] + "alami" */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-5">
            {/* Pill 1 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
              className="relative w-[68px] sm:w-[125px] h-[46px] sm:h-[86px] rounded-[78px] overflow-hidden shrink-0 ring-2 ring-[#C98A8B]/30 shadow-sm"
            >
              <Image
                src="/images/glam/jar-ingredients-wood.jpg"
                alt="Komposisi 5 bahan alami"
                fill
                className="object-cover object-center"
              />
            </motion.div>

            <span className="font-sans text-xl sm:text-4xl lg:text-[48px] font-normal text-[#2B1B1D] tracking-[-0.02em] leading-[1.15]">
              <CharReveal text={home.statementRow1Left} mode="word" delay={0.12} />
            </span>

            {/* Pill 2 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, delay: 0.22, ease: EASE }}
              className="relative w-[68px] sm:w-[125px] h-[46px] sm:h-[86px] rounded-[78px] overflow-hidden shrink-0 ring-2 ring-[#C98A8B]/30 shadow-sm"
            >
              <Image
                src="/images/glam/jar-powder-texture.jpg"
                alt="Tekstur serbuk lulur alami"
                fill
                className="object-cover object-center"
              />
            </motion.div>

            <span className="font-sans text-xl sm:text-4xl lg:text-[48px] font-normal text-[#9E5E63] tracking-[-0.02em] leading-[1.15]">
              <CharReveal text={home.statementRow1Right} mode="word" delay={0.28} />
            </span>
          </div>

          {/* Row 2: "perawatan kulit" + [Pill 3] + "sederhana & praktis" */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-5">
            <span className="font-sans text-xl sm:text-4xl lg:text-[48px] font-normal text-[#2B1B1D] tracking-[-0.02em] leading-[1.15]">
              <CharReveal text={home.statementRow2Left} mode="word" delay={0.2} />
            </span>

            {/* Pill 3 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, delay: 0.32, ease: EASE }}
              className="relative w-[68px] sm:w-[125px] h-[46px] sm:h-[86px] rounded-[78px] overflow-hidden shrink-0 ring-2 ring-[#C98A8B]/30 shadow-sm"
            >
              <Image
                src="/images/glam/jar-batik-spices.jpg"
                alt="Racikan rempah alami"
                fill
                className="object-cover object-center"
              />
            </motion.div>

            <span className="font-sans text-xl sm:text-4xl lg:text-[48px] font-normal text-[#2B1B1D] tracking-[-0.02em] leading-[1.15]">
              <CharReveal text={home.statementRow2Right} mode="word" delay={0.38} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
