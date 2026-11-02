import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { USAGE_STEPS } from "@/lib/constants";

export default function StepGuideSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#F7F0E6]/60 rounded-3xl border border-[#32160C]/10 my-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#32160C] text-[#D4A359] text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah Mudah Spa di Rumah</span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-semibold text-[#32160C] tracking-tight">
          8 Tahapan Penggunaan Lulur
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#5C4D44] leading-relaxed">
          Ikuti petunjuk praktis berikut untuk mendapatkan hasil kulit halus, cerah merata, dan harum rempah yang maksimal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {USAGE_STEPS.map((item) => (
          <div
            key={item.step}
            className="bg-white rounded-2xl p-6 border border-[#32160C]/10 hover:border-[#32160C]/25 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-full bg-[#32160C] text-[#D4A359] font-inter font-bold text-sm flex items-center justify-center">
                  {item.step}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4E2719] bg-[#F1E6D8] px-2.5 py-1 rounded-md">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-[#32160C] mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-[#5C4D44] leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-[#2D3622] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Langkah {item.step} dari 8</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/panduan"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-[#32160C] hover:text-[#4E2719] uppercase border-b-2 border-[#D4A359] pb-1 hover:border-[#32160C] transition-colors"
        >
          <span>Baca Resep Campuran Khusus (Air Mawar / Susu)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

