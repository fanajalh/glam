"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(true);
  const { general } = useSiteContent();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const defaultMessage = encodeURIComponent(
    `Halo Admin ${general.brandName}, saya ingin tanya informasi dan pemesanan Lulur Badda Lotong.`
  );

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 group print:hidden">
      {showTooltip && (
        <div className="hidden sm:flex bg-[#4D2E33] border border-[#E7B6B4]/25 text-[#FBF1F2] px-3.5 py-2 rounded-xl text-xs items-center gap-2 shadow-lg">
          <MessageCircle className="w-3.5 h-3.5 text-[#E7B6B4]" />
          <span>Butuh bantuan? Chat via WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#FBF1F2]/60 hover:text-white"
            aria-label="Tutup tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={`https://wa.me/${general.whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#4D2E33] hover:bg-[#361D22] border border-[#E7B6B4]/25 text-[#FBF1F2] p-3 sm:px-4 sm:py-3 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Hubungi WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-[#E7B6B4]" />
        <span className="font-inter text-sm font-semibold tracking-normal hidden sm:inline">
          Chat WhatsApp
        </span>
      </a>
    </div>
  );
}

