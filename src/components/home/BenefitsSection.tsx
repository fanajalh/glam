import React from "react";
import Link from "next/link";
import { Check, Sparkles, Feather, Shield, RefreshCw, Smile } from "lucide-react";
import { BENEFITS } from "@/lib/constants";

export default function BenefitsSection() {
  const icons = [Sparkles, RefreshCw, Feather, Shield, Smile];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#32160C]/10 text-[#32160C] text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A359]" />
          <span>Hasil Nyata Perawatan Tubuh</span>
        </div>
        <h2 className="font-sans text-3xl sm:text-5xl font-semibold text-[#32160C] tracking-tight">
          5 Manfaat & Khasiat Utama Lulur
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#5C4D44] leading-relaxed">
          Menggabungkan kebaikan eksfoliasi beras ketan putih dengan nutrisi herbal yang meresap ke kulit,
          memberikan sensasi segar dan halus seketika setelah dibilas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {BENEFITS.map((benefit, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div
              key={benefit.title}
              className="group relative bg-[#F7F0E6] hover:bg-[#32160C] text-[#32160C] hover:text-[#F1E6D8] rounded-2xl p-6 transition-all duration-300 border border-[#32160C]/10 hover:border-[#32160C] hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#32160C]/10 group-hover:bg-[#D4A359] flex items-center justify-center text-[#32160C] transition-colors mb-5">
                  <Icon className="w-6 h-6 text-[#32160C]" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#D4A359]/20 group-hover:bg-[#D4A359]/30 text-[#4E2719] group-hover:text-[#D4A359] text-[10px] font-bold uppercase tracking-wider mb-2">
                  {benefit.highlight}
                </span>
                <h3 className="font-sans text-lg font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[#5C4D44] group-hover:text-[#F1E6D8]/80 leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>

              <div className="mt-6 pt-4 flex items-center text-[11px] font-semibold text-[#D4A359]">
                <Check className="w-4 h-4 mr-1 text-[#2D3622] group-hover:text-[#D4A359]" />
                <span>Terbukti Alami</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

