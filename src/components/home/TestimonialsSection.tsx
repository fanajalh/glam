"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Animations";
import { useSiteContent } from "@/context/SiteContentContext";

interface TestimonialData {
  id: string;
  title: string;
  quote: string;
  author: string;
  image: string;
}

const TESTIMONIAL_IMAGES = [
  "/images/glam/jar-real-hand.jpg",
  "/images/glam/jar-ingredients-wood.jpg",
  "/images/glam/jar-powder-texture.jpg",
  "/images/glam/jar-studio-pedestal.jpg",
  "/images/glam/jar-batik-spices.jpg",
  "/images/glam/jar-bugis-pinisi.jpg",
];

export default function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);
  const { home, general } = useSiteContent();
  const items: TestimonialData[] = home.testimonials.map((t, idx) => ({
    id: `review-${idx + 1}`,
    title: t.title,
    quote: t.quote,
    author: t.author,
    image: TESTIMONIAL_IMAGES[idx % TESTIMONIAL_IMAGES.length],
  }));
  const loopedItems = [...items, ...items];

  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#F3DFE2] border border-[#C98A8B]/20 py-12 sm:py-20 lg:py-24 px-3 sm:px-8 lg:px-12 flex flex-col justify-between gap-8 sm:gap-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 px-1">
          <Reveal direction="up" delay={0.05} amount={0.05}>
            <h2 className="font-sans font-normal text-2xl sm:text-5xl lg:text-[48px] text-[#2B1B1D] tracking-[-0.02em] leading-[1.15]">
              {home.testimonialsTitle}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.15} amount={0.05}>
            <p className="font-inter text-[12px] sm:text-[13px] text-[#2B1B1D]/70 max-w-[440px]">
              {general.benefitsDisclaimer}
            </p>
          </Reveal>
        </div>

        <div
          className="relative w-full overflow-hidden py-4 -my-4 cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <motion.div
            animate={{
              x: isPaused ? undefined : ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 42,
            }}
            className="flex gap-4 sm:gap-6 w-max"
          >
            {loopedItems.map((t, index) => (
              <div
                key={`${t.id}-${index}`}
                className="w-[280px] sm:w-[370px] shrink-0 rounded-[20px] bg-white border border-[#C98A8B]/15 p-4 sm:p-6 flex flex-col justify-between gap-4 text-[#2B1B1D] transition-transform duration-300 hover:-translate-y-1.5 shadow-soft hover:shadow-card"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-[#C98A8B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-inter text-[12px] text-[#2B1B1D]/65 font-medium">
                      {t.author}
                    </span>
                  </div>

                  <h3 className="font-sans text-[18px] sm:text-[21px] font-normal text-[#2B1B1D] leading-tight">
                    {t.title}
                  </h3>

                  <p className="font-sans text-[13px] sm:text-[15px] text-[#2B1B1D]/75 leading-[1.45]">
                    {t.quote}
                  </p>
                </div>

                <div className="relative w-full h-[170px] sm:h-[210px] rounded-[12px] overflow-hidden bg-[#F3DFE2]">
                  <Image
                    src={t.image}
                    alt={t.title}
                    fill
                    sizes="(max-width: 640px) 280px, 370px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
