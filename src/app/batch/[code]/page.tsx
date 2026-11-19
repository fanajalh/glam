import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FlaskConical,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { canConnectToDatabase, prisma } from "@/lib/prisma";
import { BATCH_STATUS_META, type SerializedLabBatch } from "@/lib/admin-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sertifikat Uji Lab Batch • Glam & Glow",
  description:
    "Data transparansi uji mutu sediaan Teknologi Farmasi Lulur Badda Lotong Glam & Glow.",
};

const FALLBACK_PUBLIC_BATCHES: Record<string, SerializedLabBatch> = {
  "GG-BL-2026-01": {
    id: "sample-batch-1",
    batchCode: "GG-BL-2026-01",
    productId: null,
    productName: "Glam & Glow Lulur Badda Lotong (400g)",
    productionDate: "2026-11-01T00:00:00.000Z",
    expiryDate: "2027-02-01T00:00:00.000Z",
    phLevel: "5.7",
    colorResult: "Cokelat kehijauan-gelap merata khas racikan beras ketan dan kunyit",
    aromaResult: "Harum alami daun pandan, jeruk nipis segar, dan rempah cengkeh",
    textureResult: "Butiran halus beras ketan putih yang mudah dibentuk pasta",
    homogeneity: "Homogen, tercampur merata tanpa gumpalan kasar",
    irritationTest: "Negatif (Aman pada uji tempel kulit utuh 24 jam)",
    hedonicScore: 4.8,
    formulatorName: "Tim Teknologi Farmasi PLB",
    qcStatus: "PASSED",
    notes:
      "Simpan produk dalam wadah tertutup di tempat kering. Jangan menyimpan kembali lulur yang sudah dicampur air.",
    createdAt: "2026-11-01T00:00:00.000Z",
  },
  "GG-BL-2026-02": {
    id: "sample-batch-2",
    batchCode: "GG-BL-2026-02",
    productId: null,
    productName: "Glam & Glow Lulur Badda Lotong (400g)",
    productionDate: "2026-11-12T00:00:00.000Z",
    expiryDate: "2027-09-08T00:00:00.000Z",
    phLevel: "5.6",
    colorResult: "Cokelat herbal homogen",
    aromaResult: "Aroma daun pandan dan cengkeh berpadu jeruk nipis segar",
    textureResult:
      "Halus, nyaman dioleskan perlahan pada kulit utuh bersama air bersih",
    homogeneity: "Homogen tanpa gumpalan kasar",
    irritationTest: "Negatif / Aman untuk pemakaian luar",
    hedonicScore: 4.9,
    formulatorName: "Tim Teknologi Farmasi PLB",
    qcStatus: "PASSED",
    notes:
      "Peningkatan kehalusan pengayakan pati beras ketan untuk meminimalkan gesekan berlebih pada kulit sensitif.",
    createdAt: "2026-11-12T00:00:00.000Z",
  },
};

function formatDateID(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BatchVerificationPage({
  params,
}: {
  params: { code: string };
}) {
  const batchCode = decodeURIComponent(params.code || "").trim().toUpperCase();
  let batch: SerializedLabBatch | null = null;
  let allBatchCodes: string[] = ["GG-BL-2026-01", "GG-BL-2026-02"];

  if (await canConnectToDatabase()) {
    try {
      const [found, recent] = await Promise.all([
        prisma.labBatch.findUnique({ where: { batchCode } }),
        prisma.labBatch.findMany({
          select: { batchCode: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

      if (recent.length > 0) {
        allBatchCodes = recent.map((r) => r.batchCode);
      }

      if (found) {
        batch = {
          id: found.id,
          batchCode: found.batchCode,
          productId: found.productId,
          productName: found.productName,
          productionDate: found.productionDate.toISOString(),
          expiryDate: found.expiryDate.toISOString(),
          phLevel: found.phLevel,
          colorResult: found.colorResult,
          aromaResult: found.aromaResult,
          textureResult: found.textureResult,
          homogeneity: found.homogeneity,
          irritationTest: found.irritationTest,
          hedonicScore: found.hedonicScore,
          formulatorName: found.formulatorName,
          qcStatus: found.qcStatus,
          notes: found.notes,
          createdAt: found.createdAt.toISOString(),
        };
      }
    } catch {
      batch = FALLBACK_PUBLIC_BATCHES[batchCode] ?? null;
    }
  } else {
    batch = FALLBACK_PUBLIC_BATCHES[batchCode] ?? null;
  }

  return (
    <div className="w-full bg-[#F1E6D8] pt-24 sm:pt-28 pb-1.5 min-h-[82vh]">
      <div className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 font-inter text-[13px] font-medium text-[#201914]/75 hover:text-[#201914] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Produk</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {allBatchCodes.map((code) => (
              <Link
                key={code}
                href={`/batch/${encodeURIComponent(code)}`}
                className={`px-3 py-1 rounded-full font-mono text-[11px] border transition-colors ${
                  code === batchCode
                    ? "bg-[#201914] text-[#F1E6D8] border-[#201914]"
                    : "bg-white text-[#201914]/75 border-[#201914]/15 hover:border-[#201914]"
                }`}
              >
                {code}
              </Link>
            ))}
          </div>
        </div>

        {!batch ? (
          <div className="rounded-[24px] bg-[#201914] text-[#F1E6D8] p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-white/[0.08] text-[#D4A359] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="font-sans text-2xl sm:text-4xl font-normal">
              Kode Batch Tidak Ditemukan
            </h1>
            <p className="font-inter text-[14px] text-[#F1E6D8]/70 max-w-md mx-auto">
              Data uji laboratorium untuk kode{" "}
              <strong className="font-mono text-[#D4A359]">{batchCode}</strong>{" "}
              belum tercatat dalam sistem.
            </p>
            <div className="pt-2">
              <Link
                href="/batch/GG-BL-2026-01"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F1E6D8] text-[#201914] font-inter text-[13px] font-semibold"
              >
                <span>Lihat Contoh Batch GG-BL-2026-01</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] bg-[#201914] text-[#F1E6D8] p-6 sm:p-10 lg:p-12 space-y-8 border border-white/[0.08] shadow-xl">
            {/* Header Certificate */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] text-[#D4A359] font-inter text-[11px] uppercase tracking-[0.12em]">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Sertifikat Uji Mutu Teknologi Farmasi</span>
                </div>
                <h1 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
                  {batch.productName}
                </h1>
                <p className="font-mono text-[14px] text-[#D4A359]">
                  Batch: {batch.batchCode}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-inter text-[12px] font-semibold ${
                    batch.qcStatus === "PASSED"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                      : batch.qcStatus === "TESTING"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                      : "bg-red-500/20 text-red-300 border-red-400/30"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{BATCH_STATUS_META[batch.qcStatus].label}</span>
                </span>
                <span className="font-inter text-[12px] text-[#F1E6D8]/60 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#D4A359]" />
                  <span>{batch.formulatorName}</span>
                </span>
              </div>
            </div>

            {/* Key Lab Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-[18px] bg-[#2D3622] border border-white/[0.08] space-y-1">
                <span className="font-inter text-[11px] uppercase tracking-[0.1em] text-[#D4A359]">
                  Tingkat Keasaman (pH)
                </span>
                <div className="font-sans text-3xl font-semibold text-[#F1E6D8]">
                  pH {batch.phLevel}
                </div>
                <p className="font-inter text-[12px] text-[#F1E6D8]/70">
                  Ideal untuk pH fisiologis kulit tubuh (4.5 – 6.5)
                </p>
              </div>

              <div className="p-5 rounded-[18px] bg-white/[0.04] border border-white/[0.08] space-y-2">
                <span className="font-inter text-[11px] uppercase tracking-[0.1em] text-[#D4A359]">
                  Skor Uji Hedonik Panelis
                </span>
                <div className="font-sans text-3xl font-semibold text-[#F1E6D8]">
                  {batch.hedonicScore.toFixed(1)}{" "}
                  <span className="text-base font-normal text-[#F1E6D8]/55">
                    / 5.0
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full bg-[#D4A359] rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, (batch.hedonicScore / 5) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-[18px] bg-white/[0.04] border border-white/[0.08] space-y-2 font-inter text-[13px]">
                <div className="flex items-center gap-2 text-[#D4A359] text-[11px] uppercase tracking-[0.1em]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Periode Sediaan (BUD)</span>
                </div>
                <div className="space-y-1 text-[#F1E6D8]/85">
                  <p>
                    Produksi:{" "}
                    <strong className="text-white">
                      {formatDateID(batch.productionDate)}
                    </strong>
                  </p>
                  <p>
                    Batas Simpan:{" "}
                    <strong className="text-white">
                      {formatDateID(batch.expiryDate)}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Detail Organoleptik & Keamanan */}
            <div className="space-y-4">
              <h2 className="font-sans text-xl font-normal flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4A359]" />
                <span>Parameter Evaluasi Fisik &amp; Organoleptik</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-inter text-[13px]">
                <div className="p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.06] space-y-1">
                  <span className="text-[#F1E6D8]/55 text-[11px] uppercase tracking-wider block">
                    Warna Sediaan
                  </span>
                  <p className="text-[#F1E6D8] leading-relaxed">
                    {batch.colorResult}
                  </p>
                </div>

                <div className="p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.06] space-y-1">
                  <span className="text-[#F1E6D8]/55 text-[11px] uppercase tracking-wider block">
                    Aroma Rempah
                  </span>
                  <p className="text-[#F1E6D8] leading-relaxed">
                    {batch.aromaResult}
                  </p>
                </div>

                <div className="p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.06] space-y-1">
                  <span className="text-[#F1E6D8]/55 text-[11px] uppercase tracking-wider block">
                    Tekstur &amp; Konsistensi
                  </span>
                  <p className="text-[#F1E6D8] leading-relaxed">
                    {batch.textureResult}
                  </p>
                </div>

                <div className="p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.06] space-y-1">
                  <span className="text-[#F1E6D8]/55 text-[11px] uppercase tracking-wider block">
                    Homogenitas &amp; Uji Iritasi
                  </span>
                  <p className="text-[#F1E6D8] leading-relaxed">
                    {batch.homogeneity} • {batch.irritationTest}
                  </p>
                </div>
              </div>

              {batch.notes && (
                <div className="p-4 rounded-[16px] bg-[#2D3622]/60 border border-white/[0.08] font-inter text-[13px] text-[#F1E6D8]/85 leading-relaxed">
                  <span className="text-[#D4A359] font-semibold block mb-1">
                    Catatan Formulator:
                  </span>
                  {batch.notes}
                </div>
              )}
            </div>

            {/* Bottom CTAs */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="font-inter text-[12px] text-[#F1E6D8]/60">
                Produk riset kolaborasi PLB Rekayasa Perangkat Lunak &amp;
                Teknologi Farmasi.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/panduan"
                  className="px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#F1E6D8] font-inter text-[13px] font-medium transition-colors"
                >
                  Panduan &amp; Patch Test
                </Link>
                <Link
                  href="/pesan"
                  className="px-5 py-2.5 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pesan Batch Ini</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

