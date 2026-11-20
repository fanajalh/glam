"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, MessageCircle } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import {
  StaggerContainer,
  StaggerItem,
  Magnetic,
  RollingText,
  BotanicalMarkDraw,
  ExpandLine,
} from "@/components/ui/Animations";

export default function Footer() {
  const pathname = usePathname();
  const { general } = useSiteContent();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-1.5 pb-3 print:hidden">
      {/* Velvet Rosewood Footer Container (bg #361D22, r: 24px) */}
      <div className="w-full rounded-[24px] bg-[#361D22] border border-[#E7B6B4]/15 text-[#FBF1F2] py-12 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 flex flex-col justify-between gap-10 sm:gap-14 overflow-hidden">
        {/* Top: Botanical Lotus Mark + Wide Brand Typography */}
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 text-center">
          <BotanicalMarkDraw fill="#E7B6B4" />

          <h2 className="font-sans font-normal text-2xl sm:text-6xl lg:text-[84px] tracking-[0.12em] sm:tracking-[0.22em] text-[#FBF1F2] uppercase leading-none">
            {general.brandName}
          </h2>
        </div>

        <ExpandLine className="bg-[#FBF1F2]/16" />

        {/* Center: 3 Info Columns (`VISIT US`, `FOLLOW US`, `GET IN TOUCH`) */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center max-w-[1060px] mx-auto w-full"
        >
          {/* LOKASI KAMI */}
          <StaggerItem className="space-y-3">
            <h3 className="font-inter text-[14px] font-medium tracking-[0.14em] text-[#FBF1F2] uppercase">
              LOKASI KAMI
            </h3>
            <div className="space-y-1 font-sans text-[16px] text-[#FBF1F2]/68">
              <p>{general.locationName}</p>
              <p>{general.locationCity}</p>
            </div>
          </StaggerItem>

          {/* IKUTI KAMI */}
          <StaggerItem className="space-y-4">
            <h3 className="font-inter text-[14px] font-medium tracking-[0.14em] text-[#FBF1F2] uppercase">
              IKUTI KAMI
            </h3>
            <div className="flex items-center justify-center gap-3">
              <Magnetic strength={0.3}>
                <a
                  href={general.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/[0.08] hover:bg-[#FBF1F2] text-[#FBF1F2] hover:text-[#2B1B1D] flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href={`https://wa.me/${general.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/[0.08] hover:bg-[#FBF1F2] text-[#FBF1F2] hover:text-[#2B1B1D] flex items-center justify-center transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </Magnetic>
            </div>
          </StaggerItem>

          {/* HUBUNGI KAMI */}
          <StaggerItem className="space-y-3">
            <h3 className="font-inter text-[14px] font-medium tracking-[0.14em] text-[#FBF1F2] uppercase">
              HUBUNGI KAMI
            </h3>
            <div className="space-y-1 font-sans text-[16px] text-[#FBF1F2]/68">
              <a
                href={`mailto:${general.email}`}
                className="inline-block group/roll text-[#FBF1F2] hover:text-white transition-colors underline underline-offset-4"
              >
                <RollingText text={general.email} />
              </a>
              <p className="text-[14px] text-[#FBF1F2]/50">
                {general.footerNote}
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <ExpandLine className="bg-[#FBF1F2]/16" />

        {/* Bottom Bar: Copyright & Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-inter text-[14px] text-[#FBF1F2]/68">
          <p>© 2026 {general.brandName}. Hak cipta dilindungi.</p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/"
              className="group/roll hover:text-[#FBF1F2] transition-colors"
            >
              <RollingText text="Beranda" />
            </Link>
            <Link
              href="/tentang-kami"
              className="group/roll hover:text-[#FBF1F2] transition-colors"
            >
              <RollingText text="Tentang Kami" />
            </Link>
            <Link
              href="/produk"
              className="group/roll hover:text-[#FBF1F2] transition-colors"
            >
              <RollingText text="Produk" />
            </Link>
            <Link
              href="/panduan"
              className="group/roll hover:text-[#FBF1F2] transition-colors"
            >
              <RollingText text="Panduan" />
            </Link>
            <Link
              href="/pesan"
              className="group/roll text-[#FBF1F2] font-medium transition-colors"
            >
              <RollingText text="Kontak & Pesan" />
            </Link>
            <Link
              href="/batch/GG-BL-2026-01"
              className="group/roll hover:text-[#FBF1F2] transition-colors"
            >
              <RollingText text="Cek Batch Lab" />
            </Link>
            <Link
              href="/admin"
              className="group/roll hover:text-[#FBF1F2] transition-colors"
            >
              <RollingText text="Admin" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
