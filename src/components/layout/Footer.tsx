"use client";

import React from "react";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { PRODUCT_INFO } from "@/lib/constants";
import {
  StaggerContainer,
  StaggerItem,
  Magnetic,
  RollingText,
  BotanicalMarkDraw,
  ExpandLine,
} from "@/components/ui/Animations";

export default function Footer() {
  return (
    <footer className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-1.5 pb-3">
      {/* Orvéli Footer Container (`framer-1311`: bg #201914, r: 24px) */}
      <div className="w-full rounded-[24px] bg-[#201914] text-[#F1E6D8] py-12 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-between gap-10 sm:gap-14 overflow-hidden">
        {/* Top: Botanical Lotus Mark + Wide Brand Typography */}
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 text-center">
          <BotanicalMarkDraw />

          <h2 className="font-sans font-normal text-2xl sm:text-6xl lg:text-[84px] tracking-[0.12em] sm:tracking-[0.22em] text-[#F1E6D8] uppercase leading-none">
            GLAM & GLOW
          </h2>
        </div>

        <ExpandLine className="bg-[#F1E6D8]/16" />

        {/* Center: 3 Info Columns (`VISIT US`, `FOLLOW US`, `GET IN TOUCH`) */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center max-w-[1060px] mx-auto w-full"
        >
          {/* VISIT US */}
          <StaggerItem className="space-y-3">
            <h3 className="font-inter text-[14px] font-medium tracking-[0.14em] text-[#F1E6D8] uppercase">
              VISIT US
            </h3>
            <div className="space-y-1 font-sans text-[16px] text-[#F1E6D8]/68">
              <p>4 Saudara Kuki Sukses</p>
              <p>Makassar, Sulawesi Selatan</p>
            </div>
          </StaggerItem>

          {/* FOLLOW US */}
          <StaggerItem className="space-y-4">
            <h3 className="font-inter text-[14px] font-medium tracking-[0.14em] text-[#F1E6D8] uppercase">
              FOLLOW US
            </h3>
            <div className="flex items-center justify-center gap-3">
              <Magnetic strength={0.3}>
                <a
                  href={PRODUCT_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/[0.08] hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href={`https://wa.me/${PRODUCT_INFO.defaultWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/[0.08] hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] flex items-center justify-center transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </Magnetic>
            </div>
          </StaggerItem>

          {/* GET IN TOUCH */}
          <StaggerItem className="space-y-3">
            <h3 className="font-inter text-[14px] font-medium tracking-[0.14em] text-[#F1E6D8] uppercase">
              GET IN TOUCH
            </h3>
            <div className="space-y-1 font-sans text-[16px] text-[#F1E6D8]/68">
              <a
                href={`mailto:${PRODUCT_INFO.email}`}
                className="inline-block group/roll text-[#F1E6D8] hover:text-white transition-colors underline underline-offset-4"
              >
                <RollingText text={PRODUCT_INFO.email} />
              </a>
              <p className="text-[14px] text-[#F1E6D8]/50">
                Customer Care & Pemesanan Resmi
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <ExpandLine className="bg-[#F1E6D8]/16" />

        {/* Bottom Bar: Copyright & Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-inter text-[14px] text-[#F1E6D8]/68">
          <p>© 2026 GLAM & GLOW. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/"
              className="group/roll hover:text-[#F1E6D8] transition-colors"
            >
              <RollingText text="Home" />
            </Link>
            <Link
              href="/tentang-kami"
              className="group/roll hover:text-[#F1E6D8] transition-colors"
            >
              <RollingText text="About" />
            </Link>
            <Link
              href="/produk"
              className="group/roll hover:text-[#F1E6D8] transition-colors"
            >
              <RollingText text="Shop" />
            </Link>
            <Link
              href="/panduan"
              className="group/roll hover:text-[#F1E6D8] transition-colors"
            >
              <RollingText text="Panduan" />
            </Link>
            <Link
              href="/pesan"
              className="group/roll text-[#F1E6D8] font-medium transition-colors"
            >
              <RollingText text="Contact & Order" />
            </Link>
            <Link
              href="/admin/pesanan"
              className="group/roll hover:text-[#F1E6D8] transition-colors"
            >
              <RollingText text="Admin" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
