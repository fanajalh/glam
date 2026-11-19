"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";
import type { BatchStatus } from "@prisma/client";
import { upsertLabBatchAction } from "@/app/actions/admin";
import CustomSelect from "@/components/ui/CustomSelect";
import type { SerializedLabBatch, SerializedProduct } from "@/lib/admin-types";

interface AdminBatchModalProps {
  batch: SerializedLabBatch | null;
  products: SerializedProduct[];
  onClose: () => void;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
}

function toDateInputValue(isoString: string | undefined, fallbackOffsetDays = 0): string {
  const date = isoString
    ? new Date(isoString)
    : new Date(Date.now() + fallbackOffsetDays * 86400000);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export default function AdminBatchModal({
  batch,
  products,
  onClose,
  onSaved,
  onError,
}: AdminBatchModalProps) {
  const [batchCode, setBatchCode] = useState(batch?.batchCode ?? "GG-BL-2026-03");
  const [productId, setProductId] = useState(
    batch?.productId ?? products[0]?.id ?? ""
  );
  const [productName, setProductName] = useState(
    batch?.productName ??
      products[0]?.name ??
      "Glam & Glow Lulur Badda Lotong (400g)"
  );
  const [productionDate, setProductionDate] = useState(
    toDateInputValue(batch?.productionDate, 0)
  );
  const [expiryDate, setExpiryDate] = useState(
    toDateInputValue(batch?.expiryDate, 90)
  );
  const [phLevel, setPhLevel] = useState(batch?.phLevel ?? "5.7");
  const [colorResult, setColorResult] = useState(
    batch?.colorResult ?? "Cokelat kehitaman merata"
  );
  const [aromaResult, setAromaResult] = useState(
    batch?.aromaResult ?? "Harum alami daun pandan, jeruk nipis, dan cengkeh"
  );
  const [textureResult, setTextureResult] = useState(
    batch?.textureResult ?? "Pasta kental dengan butiran pati halus"
  );
  const [homogeneity, setHomogeneity] = useState(
    batch?.homogeneity ?? "Homogen, tidak ada pemisahan fase"
  );
  const [irritationTest, setIrritationTest] = useState(
    batch?.irritationTest ?? "Negatif / Aman (Uji Tempel Panelis)"
  );
  const [hedonicScore, setHedonicScore] = useState(
    String(batch?.hedonicScore ?? 4.8)
  );
  const [formulatorName, setFormulatorName] = useState(
    batch?.formulatorName ?? "Tim Teknologi Farmasi PLB"
  );
  const [qcStatus, setQcStatus] = useState<BatchStatus>(
    batch?.qcStatus ?? "PASSED"
  );
  const [notes, setNotes] = useState(batch?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const handleProductChange = (selectedId: string) => {
    setProductId(selectedId);
    const found = products.find((p) => p.id === selectedId);
    if (found) {
      setProductName(found.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await upsertLabBatchAction({
        id: batch?.id,
        batchCode,
        productId: productId || null,
        productName,
        productionDate,
        expiryDate,
        phLevel,
        colorResult,
        aromaResult,
        textureResult,
        homogeneity,
        irritationTest,
        hedonicScore: Number(hedonicScore),
        formulatorName,
        qcStatus,
        notes,
      });

      if (!res.ok) {
        onError(res.message);
        return;
      }
      onSaved(res.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-[24px] bg-[#201914] text-[#F1E6D8] border border-white/[0.1] p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="font-sans text-xl font-normal">
              {batch ? `Edit Batch ${batch.batchCode}` : "Tambah Batch Uji Lab Farmasi"}
            </h3>
            <p className="font-inter text-[12px] text-[#F1E6D8]/60">
              Data hasil evaluasi sediaan dari tim Teknologi Farmasi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] flex items-center justify-center"
            aria-label="Tutup modal batch lab"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-inter text-[13px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Kode Batch *
              </label>
              <input
                type="text"
                required
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="GG-BL-2026-03"
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] uppercase focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Status QC *
              </label>
              <CustomSelect
                value={qcStatus}
                onChange={(val) => setQcStatus(val as BatchStatus)}
                variant="dark"
                options={[
                  { value: "PASSED", label: "Lulus Uji QC (PASSED)" },
                  { value: "TESTING", label: "Tahap Pengujian (TESTING)" },
                  { value: "RECALLED", label: "Ditahan / Recall (RECALLED)" },
                ]}
              />
            </div>

            {products.length > 0 && (
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[#F1E6D8]/80 font-medium">
                  Tautkan Produk Katalog (Opsional)
                </label>
                <CustomSelect
                  value={productId}
                  onChange={handleProductChange}
                  variant="dark"
                  options={[
                    { value: "", label: "-- Manual tanpa relasi --" },
                    ...products.map((p) => ({
                      value: p.id,
                      label: p.name,
                    })),
                  ]}
                />
              </div>
            )}

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Nama Sediaan / Produk *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Tanggal Produksi *
              </label>
              <input
                type="date"
                required
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Masa Simpan / BUD *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Nilai pH Sediaan *
              </label>
              <input
                type="text"
                required
                value={phLevel}
                onChange={(e) => setPhLevel(e.target.value)}
                placeholder="5.5 - 6.0"
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Skor Uji Hedonik (1.0 - 5.0) *
              </label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={5}
                required
                value={hedonicScore}
                onChange={(e) => setHedonicScore(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Uji Organoleptik: Warna *
              </label>
              <input
                type="text"
                required
                value={colorResult}
                onChange={(e) => setColorResult(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Uji Organoleptik: Aroma *
              </label>
              <input
                type="text"
                required
                value={aromaResult}
                onChange={(e) => setAromaResult(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Uji Organoleptik: Tekstur *
              </label>
              <input
                type="text"
                required
                value={textureResult}
                onChange={(e) => setTextureResult(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Homogenitas *
              </label>
              <input
                type="text"
                required
                value={homogeneity}
                onChange={(e) => setHomogeneity(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Uji Iritasi *
              </label>
              <input
                type="text"
                required
                value={irritationTest}
                onChange={(e) => setIrritationTest(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Penanggung Jawab / Formulator Lab *
              </label>
              <input
                type="text"
                required
                value={formulatorName}
                onChange={(e) => setFormulatorName(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[#F1E6D8]/80 font-medium">
                Catatan Uji &amp; Penyimpanan (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#F1E6D8] focus:outline-none focus:border-[#D4A359] resize-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#F1E6D8] font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-semibold inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Batch Lab"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

