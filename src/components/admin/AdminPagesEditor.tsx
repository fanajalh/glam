"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  FileEdit,
  Globe,
  RotateCcw,
  Save,
  Wallet,
} from "lucide-react";
import {
  resetSiteSectionAction,
  saveSiteSectionAction,
} from "@/app/actions/admin";
import type {
  SiteContentConfig,
  SiteSectionKey,
} from "@/lib/site-content-types";

const PAGE_TABS: Array<{
  key: SiteSectionKey;
  label: string;
  previewHref?: string;
}> = [
  { key: "home", label: "Beranda", previewHref: "/" },
  { key: "tentangKami", label: "Tentang Kami", previewHref: "/tentang-kami" },
  { key: "produk", label: "Produk", previewHref: "/produk" },
  { key: "panduan", label: "Panduan", previewHref: "/panduan" },
  { key: "pesan", label: "Kontak & Beli", previewHref: "/pesan" },
  { key: "payment", label: "Pembayaran & Tarif", previewHref: "/pembelian" },
  { key: "general", label: "Umum & Footer", previewHref: "/" },
];

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: "text" | "number";
}) {
  return (
    <div className="space-y-1.5">
      <label className="block font-inter text-[12px] font-medium text-[#201914]/80">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[42px] px-3.5 rounded-[12px] bg-[#F1E6D8]/35 border border-[#201914]/15 font-inter text-[13px] text-[#201914] focus:outline-none focus:border-[#2D3622] focus:bg-white transition-colors"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block font-inter text-[12px] font-medium text-[#201914]/80">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-[12px] bg-[#F1E6D8]/35 border border-[#201914]/15 font-inter text-[13px] text-[#201914] focus:outline-none focus:border-[#2D3622] focus:bg-white transition-colors resize-y"
      />
    </div>
  );
}

export default function AdminPagesEditor({
  initialContent,
  onNotify,
  onSaved,
}: {
  initialContent: SiteContentConfig;
  onNotify: (type: "success" | "error", text: string) => void;
  onSaved: () => void;
}) {
  const [sectionKey, setSectionKey] = useState<SiteSectionKey>("home");
  const [draft, setDraft] = useState<SiteContentConfig>(initialContent);
  const [saving, setSaving] = useState(false);

  const currentTab = PAGE_TABS.find((t) => t.key === sectionKey)!;

  const updateSection = <K extends SiteSectionKey>(
    key: K,
    updater: (prev: SiteContentConfig[K]) => SiteContentConfig[K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      [key]: updater(prev[key]),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveSiteSectionAction(sectionKey, draft[sectionKey]);
      if (res.ok) {
        onNotify("success", res.message);
        onSaved();
      } else {
        onNotify("error", res.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      const res = await resetSiteSectionAction(sectionKey);
      if (res.ok && res.data) {
        const nextVal = res.data;
        setDraft((prev) => ({ ...prev, [sectionKey]: nextVal }));
        onNotify("success", res.message);
        onSaved();
      } else {
        onNotify("error", res.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl sm:text-4xl font-normal tracking-[-0.02em]">
            Editor Konten Halaman Web
          </h1>
          <p className="font-inter text-[13px] sm:text-[14px] text-[#201914]/65">
            Ubah teks, judul, nomor rekening, tarif biaya, hingga poin panduan di
            seluruh halaman website langsung dari sini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {currentTab.previewHref && (
            <Link
              href={currentTab.previewHref}
              target="_blank"
              className="px-4 py-2.5 rounded-full bg-white border border-[#201914]/15 hover:border-[#201914] font-inter text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Halaman</span>
            </Link>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={handleReset}
            className="px-4 py-2.5 rounded-full bg-white border border-[#201914]/15 hover:border-red-400 text-[#201914]/80 hover:text-red-700 font-inter text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[13px] font-semibold inline-flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#D4A359]" />
            <span>{saving ? "Menyimpan..." : "Simpan Halaman"}</span>
          </button>
        </div>
      </div>

      {/* Page Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {PAGE_TABS.map((tab) => {
          const active = tab.key === sectionKey;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSectionKey(tab.key)}
              className={`px-4 py-2.5 rounded-full font-inter text-[13px] font-medium whitespace-nowrap transition-colors border inline-flex items-center gap-1.5 ${
                active
                  ? "bg-[#201914] text-[#F1E6D8] border-[#201914]"
                  : "bg-white text-[#201914]/75 border-[#201914]/12 hover:bg-white/80"
              }`}
            >
              {tab.key === "payment" ? (
                <Wallet className="w-3.5 h-3.5 text-[#D4A359]" />
              ) : tab.key === "general" ? (
                <Globe className="w-3.5 h-3.5 text-[#D4A359]" />
              ) : (
                <FileEdit className="w-3.5 h-3.5 text-[#D4A359]" />
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Editor Forms */}
      <div className="rounded-[22px] bg-white border border-[#201914]/10 p-5 sm:p-7 space-y-6">
        {sectionKey === "home" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Judul Hero Baris 1"
                value={draft.home.heroLine1}
                onChange={(v) => updateSection("home", (s) => ({ ...s, heroLine1: v }))}
              />
              <TextField
                label="Judul Hero Baris 2"
                value={draft.home.heroLine2}
                onChange={(v) => updateSection("home", (s) => ({ ...s, heroLine2: v }))}
              />
              <TextField
                label="Tombol Hero Utama"
                value={draft.home.heroPrimaryCta}
                onChange={(v) =>
                  updateSection("home", (s) => ({ ...s, heroPrimaryCta: v }))
                }
              />
              <TextField
                label="Tombol Hero Sekunder"
                value={draft.home.heroSecondaryCta}
                onChange={(v) =>
                  updateSection("home", (s) => ({ ...s, heroSecondaryCta: v }))
                }
              />
            </div>

            <TextAreaField
              label="Subjudul Hero Beranda"
              value={draft.home.heroSubtitle}
              onChange={(v) =>
                updateSection("home", (s) => ({ ...s, heroSubtitle: v }))
              }
            />

            <div className="pt-4 border-t border-[#201914]/10 space-y-4">
              <h3 className="font-sans text-lg font-medium">Bagian Misi &amp; Komitmen</h3>
              <TextAreaField
                label="Teks Pernyataan Misi"
                value={draft.home.missionStatement}
                onChange={(v) =>
                  updateSection("home", (s) => ({ ...s, missionStatement: v }))
                }
              />
              <TextField
                label="Catatan Kiri Bagian Misi"
                value={draft.home.missionSubnote}
                onChange={(v) =>
                  updateSection("home", (s) => ({ ...s, missionSubnote: v }))
                }
              />
              <TextAreaField
                label="Judul Besar 4 Komitmen"
                value={draft.home.promisesHeading}
                onChange={(v) =>
                  updateSection("home", (s) => ({ ...s, promisesHeading: v }))
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {draft.home.promises.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[14px] bg-[#F1E6D8]/35 border border-[#201914]/10 space-y-2"
                  >
                    <TextField
                      label={`Komitmen ${idx + 1} - Judul`}
                      value={item.title}
                      onChange={(v) =>
                        updateSection("home", (s) => ({
                          ...s,
                          promises: s.promises.map((p, i) =>
                            i === idx ? { ...p, title: v } : p
                          ),
                        }))
                      }
                    />
                    <TextAreaField
                      label={`Komitmen ${idx + 1} - Deskripsi`}
                      rows={2}
                      value={item.desc}
                      onChange={(v) =>
                        updateSection("home", (s) => ({
                          ...s,
                          promises: s.promises.map((p, i) =>
                            i === idx ? { ...p, desc: v } : p
                          ),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#201914]/10 space-y-4">
              <h3 className="font-sans text-lg font-medium">
                Statement Pill, Bahan &amp; Program Tani
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Pill Baris 1 (Kiri)"
                  value={draft.home.statementRow1Left}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, statementRow1Left: v }))
                  }
                />
                <TextField
                  label="Pill Baris 1 (Kanan)"
                  value={draft.home.statementRow1Right}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, statementRow1Right: v }))
                  }
                />
                <TextField
                  label="Pill Baris 2 (Kiri)"
                  value={draft.home.statementRow2Left}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, statementRow2Left: v }))
                  }
                />
                <TextField
                  label="Pill Baris 2 (Kanan)"
                  value={draft.home.statementRow2Right}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, statementRow2Right: v }))
                  }
                />
                <TextField
                  label="Judul Bagian Produk & 5 Bahan"
                  value={draft.home.deckTitle}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, deckTitle: v }))
                  }
                />
                <TextField
                  label="Subjudul Produk & 5 Bahan"
                  value={draft.home.deckSubtitle}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, deckSubtitle: v }))
                  }
                />
                <TextField
                  label="Judul Bagian Kesan Pengguna"
                  value={draft.home.testimonialsTitle}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, testimonialsTitle: v }))
                  }
                />
                <TextField
                  label="Judul Program Petani (Baris 1)"
                  value={draft.home.fundTitleLine1}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, fundTitleLine1: v }))
                  }
                />
                <TextField
                  label="Judul Program Petani (Baris 2)"
                  value={draft.home.fundTitleLine2}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, fundTitleLine2: v }))
                  }
                />
                <TextField
                  label="Deskripsi Program Petani"
                  value={draft.home.fundSubtitle}
                  onChange={(v) =>
                    updateSection("home", (s) => ({ ...s, fundSubtitle: v }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {draft.home.testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[14px] bg-[#F1E6D8]/35 border border-[#201914]/10 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <TextField
                        label={`Kesan ${idx + 1} - Judul`}
                        value={t.title}
                        onChange={(v) =>
                          updateSection("home", (s) => ({
                            ...s,
                            testimonials: s.testimonials.map((it, i) =>
                              i === idx ? { ...it, title: v } : it
                            ),
                          }))
                        }
                      />
                      <TextField
                        label="Penulis"
                        value={t.author}
                        onChange={(v) =>
                          updateSection("home", (s) => ({
                            ...s,
                            testimonials: s.testimonials.map((it, i) =>
                              i === idx ? { ...it, author: v } : it
                            ),
                          }))
                        }
                      />
                    </div>
                    <TextAreaField
                      label="Kutipan"
                      rows={2}
                      value={t.quote}
                      onChange={(v) =>
                        updateSection("home", (s) => ({
                          ...s,
                          testimonials: s.testimonials.map((it, i) =>
                            i === idx ? { ...it, quote: v } : it
                          ),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {sectionKey === "tentangKami" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Judul Hero Baris 1"
                value={draft.tentangKami.heroLine1}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, heroLine1: v }))
                }
              />
              <TextField
                label="Judul Hero Baris 2"
                value={draft.tentangKami.heroLine2}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, heroLine2: v }))
                }
              />
            </div>
            <TextAreaField
              label="Subjudul Hero"
              value={draft.tentangKami.heroSubtitle}
              onChange={(v) =>
                updateSection("tentangKami", (s) => ({ ...s, heroSubtitle: v }))
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#201914]/10">
              <TextField
                label="Badge Asal Produk"
                value={draft.tentangKami.originBadge}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, originBadge: v }))
                }
              />
              <TextField
                label="Judul Cerita Asal Usul"
                value={draft.tentangKami.originTitle}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, originTitle: v }))
                }
              />
            </div>
            <TextAreaField
              label="Paragraf 1 Tentang Produk"
              value={draft.tentangKami.originPara1}
              onChange={(v) =>
                updateSection("tentangKami", (s) => ({ ...s, originPara1: v }))
              }
            />
            <TextAreaField
              label="Paragraf 2 Pembuat & Kemasan"
              value={draft.tentangKami.originPara2}
              onChange={(v) =>
                updateSection("tentangKami", (s) => ({ ...s, originPara2: v }))
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Statistik 1 - Angka"
                value={draft.tentangKami.stat1Value}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, stat1Value: v }))
                }
              />
              <TextField
                label="Statistik 2 - Angka"
                value={draft.tentangKami.stat2Value}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, stat2Value: v }))
                }
              />
              <TextField
                label="Statistik 3 - Angka"
                value={draft.tentangKami.stat3Value}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, stat3Value: v }))
                }
              />
              <TextField
                label="Statistik 1 - Label"
                value={draft.tentangKami.stat1Label}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, stat1Label: v }))
                }
              />
              <TextField
                label="Statistik 2 - Label"
                value={draft.tentangKami.stat2Label}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, stat2Label: v }))
                }
              />
              <TextField
                label="Statistik 3 - Label"
                value={draft.tentangKami.stat3Label}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, stat3Label: v }))
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#201914]/10">
              <TextField
                label="Label Standar Kami"
                value={draft.tentangKami.standardsEyebrow}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, standardsEyebrow: v }))
                }
              />
              <TextField
                label="Judul Standar Kami"
                value={draft.tentangKami.standardsTitle}
                onChange={(v) =>
                  updateSection("tentangKami", (s) => ({ ...s, standardsTitle: v }))
                }
              />
            </div>
            <TextAreaField
              label="Kutipan Sorotan Standar"
              value={draft.tentangKami.standardsQuote}
              onChange={(v) =>
                updateSection("tentangKami", (s) => ({ ...s, standardsQuote: v }))
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {draft.tentangKami.values.map((val, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[14px] bg-[#F1E6D8]/35 border border-[#201914]/10 space-y-2"
                >
                  <TextField
                    label={`Nilai ${idx + 1} - Judul`}
                    value={val.title}
                    onChange={(v) =>
                      updateSection("tentangKami", (s) => ({
                        ...s,
                        values: s.values.map((it, i) =>
                          i === idx ? { ...it, title: v } : it
                        ),
                      }))
                    }
                  />
                  <TextAreaField
                    label="Deskripsi"
                    rows={2}
                    value={val.desc}
                    onChange={(v) =>
                      updateSection("tentangKami", (s) => ({
                        ...s,
                        values: s.values.map((it, i) =>
                          i === idx ? { ...it, desc: v } : it
                        ),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {sectionKey === "produk" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Judul Hero Baris 1"
                value={draft.produk.heroLine1}
                onChange={(v) =>
                  updateSection("produk", (s) => ({ ...s, heroLine1: v }))
                }
              />
              <TextField
                label="Judul Hero Baris 2"
                value={draft.produk.heroLine2}
                onChange={(v) =>
                  updateSection("produk", (s) => ({ ...s, heroLine2: v }))
                }
              />
              <TextField
                label="Nama Produk Utama"
                value={draft.produk.productName}
                onChange={(v) =>
                  updateSection("produk", (s) => ({ ...s, productName: v }))
                }
              />
              <TextField
                label="Harga Resmi (Rp)"
                type="number"
                value={draft.produk.productPrice}
                onChange={(v) =>
                  updateSection("produk", (s) => ({
                    ...s,
                    productPrice: Math.max(0, Number(v) || 0),
                  }))
                }
              />
              <TextField
                label="Tagline Produk"
                value={draft.produk.productTagline}
                onChange={(v) =>
                  updateSection("produk", (s) => ({ ...s, productTagline: v }))
                }
              />
              <TextField
                label="Keterangan Berat Bersih"
                value={draft.produk.productWeightText}
                onChange={(v) =>
                  updateSection("produk", (s) => ({
                    ...s,
                    productWeightText: v,
                  }))
                }
              />
            </div>

            <TextAreaField
              label="Subjudul Hero Halaman Produk"
              value={draft.produk.heroSubtitle}
              onChange={(v) =>
                updateSection("produk", (s) => ({ ...s, heroSubtitle: v }))
              }
            />
            <TextAreaField
              label="Deskripsi Lengkap Produk"
              value={draft.produk.productDescription}
              onChange={(v) =>
                updateSection("produk", (s) => ({ ...s, productDescription: v }))
              }
            />

            <div className="pt-4 border-t border-[#201914]/10 space-y-3">
              <h3 className="font-sans text-lg font-medium">5 Bahan Alami</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {draft.produk.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[14px] bg-[#F1E6D8]/35 border border-[#201914]/10 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <TextField
                        label={`Bahan 0${idx + 1} - Nama`}
                        value={ing.name}
                        onChange={(v) =>
                          updateSection("produk", (s) => ({
                            ...s,
                            ingredients: s.ingredients.map((it, i) =>
                              i === idx ? { ...it, name: v } : it
                            ),
                          }))
                        }
                      />
                      <TextField
                        label="Peran"
                        value={ing.role}
                        onChange={(v) =>
                          updateSection("produk", (s) => ({
                            ...s,
                            ingredients: s.ingredients.map((it, i) =>
                              i === idx ? { ...it, role: v } : it
                            ),
                          }))
                        }
                      />
                    </div>
                    <TextAreaField
                      label="Deskripsi"
                      rows={2}
                      value={ing.description}
                      onChange={(v) =>
                        updateSection("produk", (s) => ({
                          ...s,
                          ingredients: s.ingredients.map((it, i) =>
                            i === idx ? { ...it, description: v } : it
                          ),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {sectionKey === "panduan" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Judul Hero Baris 1"
                value={draft.panduan.heroLine1}
                onChange={(v) =>
                  updateSection("panduan", (s) => ({ ...s, heroLine1: v }))
                }
              />
              <TextField
                label="Judul Hero Baris 2"
                value={draft.panduan.heroLine2}
                onChange={(v) =>
                  updateSection("panduan", (s) => ({ ...s, heroLine2: v }))
                }
              />
              <TextField
                label="Judul Seksi Cara Penggunaan"
                value={draft.panduan.stepsTitle}
                onChange={(v) =>
                  updateSection("panduan", (s) => ({ ...s, stepsTitle: v }))
                }
              />
              <TextField
                label="Judul Seksi Manfaat Utama"
                value={draft.panduan.benefitsTitle}
                onChange={(v) =>
                  updateSection("panduan", (s) => ({ ...s, benefitsTitle: v }))
                }
              />
            </div>

            <TextAreaField
              label="Subjudul Hero Panduan"
              value={draft.panduan.heroSubtitle}
              onChange={(v) =>
                updateSection("panduan", (s) => ({ ...s, heroSubtitle: v }))
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-[#201914]/10">
              {draft.panduan.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[14px] bg-[#F1E6D8]/35 border border-[#201914]/10 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <TextField
                      label={`Langkah ${idx + 1} - Judul`}
                      value={step.title}
                      onChange={(v) =>
                        updateSection("panduan", (s) => ({
                          ...s,
                          steps: s.steps.map((it, i) =>
                            i === idx ? { ...it, title: v } : it
                          ),
                        }))
                      }
                    />
                    <TextField
                      label="Badge"
                      value={step.badge}
                      onChange={(v) =>
                        updateSection("panduan", (s) => ({
                          ...s,
                          steps: s.steps.map((it, i) =>
                            i === idx ? { ...it, badge: v } : it
                          ),
                        }))
                      }
                    />
                  </div>
                  <TextAreaField
                    label="Deskripsi Langkah"
                    rows={2}
                    value={step.desc}
                    onChange={(v) =>
                      updateSection("panduan", (s) => ({
                        ...s,
                        steps: s.steps.map((it, i) =>
                          i === idx ? { ...it, desc: v } : it
                        ),
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#201914]/10 space-y-3">
              <TextField
                label="Judul Penyimpanan"
                value={draft.panduan.storageTitle}
                onChange={(v) =>
                  updateSection("panduan", (s) => ({ ...s, storageTitle: v }))
                }
              />
              <TextAreaField
                label="Deskripsi Penyimpanan"
                value={draft.panduan.storageDesc}
                onChange={(v) =>
                  updateSection("panduan", (s) => ({ ...s, storageDesc: v }))
                }
              />
              <div className="space-y-2">
                <label className="block font-inter text-[12px] font-medium text-[#201914]/80">
                  5 Poin Perhatian Penggunaan
                </label>
                {draft.panduan.cautions.map((c, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={c}
                    onChange={(e) =>
                      updateSection("panduan", (s) => ({
                        ...s,
                        cautions: s.cautions.map((it, i) =>
                          i === idx ? e.target.value : it
                        ),
                      }))
                    }
                    className="w-full h-[40px] px-3.5 rounded-[12px] bg-[#F1E6D8]/35 border border-[#201914]/15 font-inter text-[13px] text-[#201914] focus:outline-none focus:border-[#2D3622]"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {sectionKey === "pesan" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Badge Hero Kontak & Pesan"
                value={draft.pesan.heroBadge}
                onChange={(v) =>
                  updateSection("pesan", (s) => ({ ...s, heroBadge: v }))
                }
              />
              <TextField
                label="Judul Hero Baris 1"
                value={draft.pesan.heroLine1}
                onChange={(v) =>
                  updateSection("pesan", (s) => ({ ...s, heroLine1: v }))
                }
              />
              <TextField
                label="Judul Hero Baris 2"
                value={draft.pesan.heroLine2}
                onChange={(v) =>
                  updateSection("pesan", (s) => ({ ...s, heroLine2: v }))
                }
              />
              <TextField
                label="Judul Halaman Pembelian (/pembelian)"
                value={draft.pesan.pembelianTitle}
                onChange={(v) =>
                  updateSection("pesan", (s) => ({ ...s, pembelianTitle: v }))
                }
              />
            </div>

            <TextAreaField
              label="Subjudul Hero Kontak & Pesan"
              value={draft.pesan.heroSubtitle}
              onChange={(v) =>
                updateSection("pesan", (s) => ({ ...s, heroSubtitle: v }))
              }
            />
            <TextAreaField
              label="Subjudul Halaman Pembelian (/pembelian)"
              value={draft.pesan.pembelianSubtitle}
              onChange={(v) =>
                updateSection("pesan", (s) => ({ ...s, pembelianSubtitle: v }))
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#201914]/10">
              <TextField
                label="Judul Kartu Sosial"
                value={draft.pesan.socialTitle}
                onChange={(v) =>
                  updateSection("pesan", (s) => ({ ...s, socialTitle: v }))
                }
              />
              <TextField
                label="Badge Buletin Info"
                value={draft.pesan.newsletterBadge}
                onChange={(v) =>
                  updateSection("pesan", (s) => ({ ...s, newsletterBadge: v }))
                }
              />
            </div>
            <TextAreaField
              label="Deskripsi Kartu Sosial"
              value={draft.pesan.socialDesc}
              onChange={(v) =>
                updateSection("pesan", (s) => ({ ...s, socialDesc: v }))
              }
            />
            <TextField
              label="Judul Kartu Buletin"
              value={draft.pesan.newsletterTitle}
              onChange={(v) =>
                updateSection("pesan", (s) => ({ ...s, newsletterTitle: v }))
              }
            />
            <TextAreaField
              label="Deskripsi Kartu Buletin"
              value={draft.pesan.newsletterDesc}
              onChange={(v) =>
                updateSection("pesan", (s) => ({ ...s, newsletterDesc: v }))
              }
            />
          </div>
        )}

        {sectionKey === "payment" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-sans text-lg font-medium mb-3">
                Tarif Biaya Admin, Layanan, COD &amp; Paket Kurir
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TextField
                  label="Biaya Admin (Semua Metode)"
                  type="number"
                  value={draft.payment.adminFee}
                  onChange={(v) =>
                    updateSection("payment", (s) => ({
                      ...s,
                      adminFee: Math.max(0, Number(v) || 0),
                    }))
                  }
                />
                <TextField
                  label="Biaya Layanan (Transfer / E-Wallet)"
                  type="number"
                  value={draft.payment.serviceFee}
                  onChange={(v) =>
                    updateSection("payment", (s) => ({
                      ...s,
                      serviceFee: Math.max(0, Number(v) || 0),
                    }))
                  }
                />
                <TextField
                  label="Biaya Layanan COD"
                  type="number"
                  value={draft.payment.codFee}
                  onChange={(v) =>
                    updateSection("payment", (s) => ({
                      ...s,
                      codFee: Math.max(0, Number(v) || 0),
                    }))
                  }
                />
                <TextField
                  label="Paket Ambil Stand PLB (Rp)"
                  type="number"
                  value={draft.payment.shippingFeeStand}
                  onChange={(v) =>
                    updateSection("payment", (s) => ({
                      ...s,
                      shippingFeeStand: Math.max(0, Number(v) || 0),
                    }))
                  }
                />
                <TextField
                  label="Paket Kurir Lokal Makassar (Rp)"
                  type="number"
                  value={draft.payment.shippingFeeLocal}
                  onChange={(v) =>
                    updateSection("payment", (s) => ({
                      ...s,
                      shippingFeeLocal: Math.max(0, Number(v) || 0),
                    }))
                  }
                />
                <TextField
                  label="Paket Ekspedisi Reguler (Rp)"
                  type="number"
                  value={draft.payment.shippingFeeRegular}
                  onChange={(v) =>
                    updateSection("payment", (s) => ({
                      ...s,
                      shippingFeeRegular: Math.max(0, Number(v) || 0),
                    }))
                  }
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#201914]/10 space-y-3">
              <h3 className="font-sans text-lg font-medium">
                Nomor Rekening Transfer Bank (BCA / BRI / Mandiri)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {draft.payment.bankAccounts.map((bank, idx) => (
                  <div
                    key={bank.id}
                    className="p-4 rounded-[14px] bg-[#F1E6D8]/35 border border-[#201914]/10 space-y-2"
                  >
                    <TextField
                      label="Nama Bank"
                      value={bank.bank}
                      onChange={(v) =>
                        updateSection("payment", (s) => ({
                          ...s,
                          bankAccounts: s.bankAccounts.map((b, i) =>
                            i === idx ? { ...b, bank: v } : b
                          ),
                        }))
                      }
                    />
                    <TextField
                      label="Nomor Rekening"
                      value={bank.accountNumber}
                      onChange={(v) =>
                        updateSection("payment", (s) => ({
                          ...s,
                          bankAccounts: s.bankAccounts.map((b, i) =>
                            i === idx ? { ...b, accountNumber: v } : b
                          ),
                        }))
                      }
                    />
                    <TextField
                      label="Atas Nama"
                      value={bank.holderName}
                      onChange={(v) =>
                        updateSection("payment", (s) => ({
                          ...s,
                          bankAccounts: s.bankAccounts.map((b, i) =>
                            i === idx ? { ...b, holderName: v } : b
                          ),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#201914]/10 space-y-3">
              <h3 className="font-sans text-lg font-medium">
                Nomor Tujuan E-Wallet (GoPay / DANA / OVO)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {draft.payment.ewalletAccounts.map((wallet, idx) => (
                  <div
                    key={wallet.id}
                    className="p-4 rounded-[14px] bg-[#F1E6D8]/35 border border-[#201914]/10 space-y-2"
                  >
                    <TextField
                      label="Penyedia"
                      value={wallet.provider}
                      onChange={(v) =>
                        updateSection("payment", (s) => ({
                          ...s,
                          ewalletAccounts: s.ewalletAccounts.map((w, i) =>
                            i === idx ? { ...w, provider: v } : w
                          ),
                        }))
                      }
                    />
                    <TextField
                      label="Nomor Tujuan"
                      value={wallet.phoneNumber}
                      onChange={(v) =>
                        updateSection("payment", (s) => ({
                          ...s,
                          ewalletAccounts: s.ewalletAccounts.map((w, i) =>
                            i === idx ? { ...w, phoneNumber: v } : w
                          ),
                        }))
                      }
                    />
                    <TextField
                      label="Atas Nama"
                      value={wallet.holderName}
                      onChange={(v) =>
                        updateSection("payment", (s) => ({
                          ...s,
                          ewalletAccounts: s.ewalletAccounts.map((w, i) =>
                            i === idx ? { ...w, holderName: v } : w
                          ),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {sectionKey === "general" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Nama Brand di Header & Footer"
                value={draft.general.brandName}
                onChange={(v) =>
                  updateSection("general", (s) => ({ ...s, brandName: v }))
                }
              />
              <TextField
                label="Nomor WhatsApp Admin (628...)"
                value={draft.general.whatsappNumber}
                onChange={(v) =>
                  updateSection("general", (s) => ({ ...s, whatsappNumber: v }))
                }
              />
              <TextField
                label="Username Instagram"
                value={draft.general.instagramHandle}
                onChange={(v) =>
                  updateSection("general", (s) => ({ ...s, instagramHandle: v }))
                }
              />
              <TextField
                label="URL Instagram"
                value={draft.general.instagramUrl}
                onChange={(v) =>
                  updateSection("general", (s) => ({ ...s, instagramUrl: v }))
                }
              />
              <TextField
                label="Email Resmi"
                value={draft.general.email}
                onChange={(v) =>
                  updateSection("general", (s) => ({ ...s, email: v }))
                }
              />
              <TextField
                label="Keterangan Kontak Footer"
                value={draft.general.footerNote}
                onChange={(v) =>
                  updateSection("general", (s) => ({ ...s, footerNote: v }))
                }
              />
              <TextField
                label="Nama Usaha (Footer Lokasi)"
                value={draft.general.locationName}
                onChange={(v) =>
                  updateSection("general", (s) => ({ ...s, locationName: v }))
                }
              />
              <TextField
                label="Kota / Provinsi (Footer Lokasi)"
                value={draft.general.locationCity}
                onChange={(v) =>
                  updateSection("general", (s) => ({ ...s, locationCity: v }))
                }
              />
            </div>

            <TextAreaField
              label="Catatan Disclaimer Manfaat (Dipakai di Beranda, Produk & Panduan)"
              value={draft.general.benefitsDisclaimer}
              onChange={(v) =>
                updateSection("general", (s) => ({
                  ...s,
                  benefitsDisclaimer: v,
                }))
              }
            />
          </div>
        )}

        <div className="pt-4 border-t border-[#201914]/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-inter text-[12px] text-[#201914]/65">
            <CheckCircle2 className="w-4 h-4 text-[#2D3622] shrink-0" />
            <span>
              Setiap perubahan disimpan dan langsung berlaku pada halaman publik.
            </span>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[13px] font-semibold inline-flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#D4A359]" />
            <span>{saving ? "Menyimpan..." : "Simpan Halaman"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

