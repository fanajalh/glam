"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { upsertProductAction } from "@/app/actions/admin";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  PRODUCT_IMAGE_PRESETS,
  type SerializedProduct,
} from "@/lib/admin-types";

interface AdminProductModalProps {
  product: SerializedProduct | null;
  onClose: () => void;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
}

export default function AdminProductModal({
  product,
  onClose,
  onSaved,
  onError,
}: AdminProductModalProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(
    product?.category ?? "Signature Lulur"
  );
  const [tagline, setTagline] = useState(
    product?.tagline ?? "Formula Rempah Tradisional Bugis"
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? 35000));
  const [weightGram, setWeightGram] = useState(
    String(product?.weightGram ?? 400)
  );
  const [stock, setStock] = useState(String(product?.stock ?? 100));
  const [imageUrl, setImageUrl] = useState(
    product?.imageUrl ?? "/images/glam/jar-studio-pedestal.jpg"
  );
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? true);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await upsertProductAction({
        id: product?.id,
        name,
        category,
        tagline,
        description,
        price: Number(price),
        weightGram: Number(weightGram),
        stock: Number(stock),
        imageUrl,
        isFeatured,
        isActive,
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
      <div className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[24px] bg-[#2B1B1D] text-[#FBF1F2] border border-white/[0.1] p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="font-sans text-xl font-normal">
              {product ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <p className="font-inter text-[12px] text-[#FBF1F2]/60">
              Data tersimpan langsung ke tabel Product di PostgreSQL.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.14] flex items-center justify-center"
            aria-label="Tutup modal produk"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-inter text-[13px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[#FBF1F2]/80 font-medium">
                Nama Produk *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Glam & Glow Lulur Badda Lotong 400g"
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] focus:outline-none focus:border-[#E7B6B4]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#FBF1F2]/80 font-medium">
                Kategori
              </label>
              <CustomSelect
                value={category}
                onChange={setCategory}
                variant="dark"
                options={[
                  { value: "Signature Lulur", label: "Signature Lulur" },
                  { value: "Paket Bundling", label: "Paket Bundling" },
                  { value: "5 Bahan Alami", label: "5 Bahan Alami" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#FBF1F2]/80 font-medium">
                Tagline Singkat
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] focus:outline-none focus:border-[#E7B6B4]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[#FBF1F2]/80 font-medium">
                Harga (Rp) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] focus:outline-none focus:border-[#E7B6B4]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[#FBF1F2]/80 font-medium">
                  Berat (gram) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={weightGram}
                  onChange={(e) => setWeightGram(e.target.value)}
                  className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] focus:outline-none focus:border-[#E7B6B4]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[#FBF1F2]/80 font-medium">
                  Stok (pot) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full h-[44px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] focus:outline-none focus:border-[#E7B6B4]"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[#FBF1F2]/80 font-medium">
                Gambar Produk (Preset / Path Lokal)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {PRODUCT_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                      imageUrl === preset.url
                        ? "bg-[#E7B6B4] text-[#2B1B1D] border-[#E7B6B4] font-semibold"
                        : "bg-white/[0.04] text-[#FBF1F2]/75 border-white/[0.08] hover:bg-white/[0.1]"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] text-[12px] focus:outline-none focus:border-[#E7B6B4]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[#FBF1F2]/80 font-medium">
                Deskripsi Produk *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan singkat formula, komposisi, dan kegunaan..."
                className="w-full p-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[#FBF1F2] focus:outline-none focus:border-[#E7B6B4] resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-[#E7B6B4] w-4 h-4"
                />
                <span className="text-[#FBF1F2]/85">Produk Unggulan</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#E7B6B4] w-4 h-4"
                />
                <span className="text-[#FBF1F2]/85">Tampilkan / Aktif</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#FBF1F2] font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#FBF1F2] hover:bg-white text-[#2B1B1D] font-semibold inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Produk"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

