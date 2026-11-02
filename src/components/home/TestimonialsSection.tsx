"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Animations";

interface TestimonialData {
  id: string;
  title: string;
  quote: string;
  author: string;
  image: string;
}

const TESTIMONIALS: TestimonialData[] = [
  {
    id: "review-1",
    title: "Kulit Cerah Merata",
    quote: "“Dua minggu pakai rutin, kulit terasa jauh lebih cerah, halus merata, dan lembap alami.”",
    author: "Amara K.",
    image: "/images/orveli/testi-1.png",
  },
  {
    id: "review-2",
    title: "Aroma Rempah Menenangkan",
    quote: "“Tekstur lembut dan aroma rempah alaminya sangat menenangkan setiap selesai mandi.”",
    author: "Hannah L.",
    image: "/images/orveli/testi-2.png",
  },
  {
    id: "review-3",
    title: "Kenyal & Glowing",
    quote: "“Dicampur susu beruang atau air mawar, kulit langsung kenyal dan bercahaya seketika.”",
    author: "Sofia R.",
    image: "/images/orveli/testi-3.png",
  },
  {
    id: "review-4",
    title: "Eksfoliasi Tanpa Perih",
    quote: "“Mengangkat sel kulit mati tanpa perih. Kulit jadi glowing bersih dan halus alami.”",
    author: "Dian P.",
    image: "/images/orveli/testi-1.png",
  },
  {
    id: "review-5",
    title: "Lembap Sepanjang Hari",
    quote: "“Kulit kering langsung terhidrasi dalam seminggu. 100% rempah murni tanpa kimia.”",
    author: "Nadira S.",
    image: "/images/orveli/testi-2.png",
  },
  {
    id: "review-6",
    title: "Sensasi Spa Tradisional",
    quote: "“Beras ketan sangrai dan rempahnya juara! Halus seperti habis spa tradisional Bugis.”",
    author: "Citra W.",
    image: "/images/orveli/testi-3.png",
  },
];

export default function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items for infinite seamless looping
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      {/* Orvéli Testimonials Container */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#D7D1C3] py-12 sm:py-20 lg:py-28 flex flex-col justify-between gap-8 sm:gap-16">
        
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto px-4">
          <Reveal direction="up" delay={0.05} amount={0.1}>
            <h2 className="font-sans font-normal text-2xl sm:text-5xl lg:text-[64px] text-[#201914] tracking-[-0.03em] leading-[1.08]">
              Kata Mereka
            </h2>
          </Reveal>
        </div>

        {/* Infinite Marquee Ticker Track */}
        <div
          className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Subtle edge fade overlays matching Orvéli's beige-gray background */}
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-[#D7D1C3] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-[#D7D1C3] to-transparent z-10 pointer-events-none" />

          {/* Continuous scrolling motion track */}
          <motion.div
            className="flex items-stretch gap-4 sm:gap-6 w-max pl-4"
            animate={{
              x: isPaused ? undefined : ["0%", "-50%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 38,
                ease: "linear",
              },
            }}
          >
            {marqueeItems.map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                className="w-[280px] sm:w-[380px] lg:w-[420px] shrink-0 bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-7 flex flex-col justify-between gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Top Content: Title + 5 Stars + Quote + Author */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-sans text-[18px] sm:text-[22px] font-normal text-[#201914] tracking-[-0.01em]">
                      {t.title}
                    </h3>

                    {/* 5 Stars */}
                    <div className="flex items-center gap-1 text-[#201914]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#201914] text-[#201914]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="font-sans text-[13px] sm:text-[16px] text-[#201914]/85 leading-[1.5] font-normal">
                    {t.quote}
                  </p>

                  {/* Author */}
                  <p className="font-sans text-[13px] sm:text-[15px] font-medium text-[#201914]">
                    {t.author}
                  </p>
                </div>

                {/* Bottom: Image Comparison */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 border-t border-black/[0.04]">
                  {/* After Column */}
                  <div className="space-y-1 text-center">
                    <div className="relative w-full h-[140px] sm:h-[220px] rounded-[10px] sm:rounded-[12px] overflow-hidden bg-[#D7D1C3]">
                      <Image
                        src={t.image}
                        alt={`${t.author} After`}
                        fill
                        sizes="(max-width: 640px) 140px, 200px"
                        className="object-cover object-center"
                      />
                    </div>
                    <span className="font-sans text-[12px] sm:text-[14px] text-[#201914] block font-medium">
                      After
                    </span>
                  </div>

                  {/* Before Column */}
                  <div className="space-y-1 text-center">
                    <div className="relative w-full h-[140px] sm:h-[220px] rounded-[10px] sm:rounded-[12px] overflow-hidden bg-[#D7D1C3]">
                      <Image
                        src={t.image}
                        alt={`${t.author} Before`}
                        fill
                        sizes="(max-width: 640px) 140px, 200px"
                        style={{
                          filter:
                            "brightness(0.92) contrast(0.88) saturate(0.65) sepia(0.1)",
                        }}
                        className="object-cover object-center"
                      />
                    </div>
                    <span className="font-sans text-[12px] sm:text-[14px] text-[#201914] block font-medium">
                      Before
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
