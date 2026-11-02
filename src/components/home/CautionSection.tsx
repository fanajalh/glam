import React from "react";
import { AlertTriangle, Refrigerator, ShieldCheck, SunDim } from "lucide-react";
import { CAUTIONS } from "@/lib/constants";

export default function CautionSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Box Perhatian / Safety Notice */}
        <div className="rounded-3xl bg-[#32160C] text-[#F1E6D8] p-8 sm:p-10 border border-[#D4A359]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#D4A359]/20 flex items-center justify-center text-[#D4A359]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#D4A359]">
                  PERHATIAN PENTING
                </h3>
                <span className="text-[11px] uppercase tracking-wider text-[#F1E6D8]/70">
                  Panduan Keamanan Pemakaian
                </span>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#F1E6D8]/85 font-light leading-relaxed">
              {CAUTIONS.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A359] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-4 text-xs text-[#D4A359]">
            Hanya untuk pemakaian luar tubuh (hindari wajah/mata).
          </div>
        </div>

        {/* Box Cara Penyimpanan & Tips Kulkas */}
        <div className="rounded-3xl bg-[#2D3622] text-[#F1E6D8] p-8 sm:p-10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#D4A359]">
                <Refrigerator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#F1E6D8]">
                  CARA PENYIMPANAN
                </h3>
                <span className="text-[11px] uppercase tracking-wider text-[#F1E6D8]/70">
                  Jaga Kesegaran Rempah Alami
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#F1E6D8]/90 font-light leading-relaxed">
              <p>
                Lulur Badda Lotong disimpan dalam <strong>wadah bersih dan tertutup rapat</strong>, di tempat yang sejuk, kering, dan terhindar dari paparan sinar matahari langsung.
              </p>
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="font-medium text-[#D4A359] mb-1 flex items-center gap-2">
                  <SunDim className="w-4 h-4" />
                  Tips Agar Lebih Tahan Lama:
                </p>
                <p className="text-xs text-[#F1E6D8]/80 leading-relaxed">
                  Simpan wadah lulur di dalam kulkas (lemari pendingin). Suhu dingin menjaga formulasi rempah nabati tetap segar dan tahan berbulan-bulan.
                </p>
              </div>
              <p className="text-xs text-red-300/90 italic">
                *Peringatan: Jangan pernah menyimpan kembali lulur yang sudah pernah dicampur dengan air/susu.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 text-xs text-[#F1E6D8]/70">
            Simpan selalu dalam keadaan kering sebelum dicampur.
          </div>
        </div>

      </div>
    </section>
  );
}

