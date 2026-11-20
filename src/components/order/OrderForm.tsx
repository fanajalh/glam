"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { PRODUCT_INFO, PACKAGES, SHIPPING_OPTIONS, PAYMENT_OPTIONS } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";
import { createOrderAction } from "@/app/actions/order";
import { Reveal, ExpandLine } from "@/components/ui/Animations";
import CustomSelect from "@/components/ui/CustomSelect";
import { useCart } from "@/context/CartContext";

export default function OrderForm({
  variant = "default",
}: {
  variant?: "default" | "checkout";
}) {
  const router = useRouter();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalCount,
    totalWeightGram,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [cityOrDistrict, setCityOrDistrict] = useState("");
  const [shippingMethod, setShippingMethod] = useState(
    SHIPPING_OPTIONS[0].value
  );
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0].value);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handlePackageSelect = (pkgQty: number) => {
    clearCart();
    addToCart(
      {
        id: "prod-main",
        name: PRODUCT_INFO.name,
        subtitle: "Berat bersih: 400 gram • Bahan Alami",
        price: PRODUCT_INFO.price,
        image: "/images/glam/jar-studio-pedestal.jpg",
        weightGram: PRODUCT_INFO.weightGram,
      },
      pkgQty
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !cityOrDistrict.trim() ||
      !shippingAddress.trim()
    ) {
      setFormError(
        "Mohon lengkapi Nama, Nomor WhatsApp, Kota/Kecamatan, dan Alamat Lengkap."
      );
      return;
    }

    if (cartItems.length === 0) {
      setFormError(
        "Keranjang belanja masih kosong. Pilih produk atau paket di atas terlebih dahulu."
      );
      return;
    }

    setLoading(true);
    try {
      const itemsPayload = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await createOrderAction({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: shippingAddress.trim(),
        cityOrDistrict: cityOrDistrict.trim(),
        shippingMethod,
        paymentMethod,
        quantity: totalCount,
        items: itemsPayload,
        notes: notes.trim(),
        channel: "DIRECT_WEB",
      });

      if (res.success) {
        const receiptData = {
          orderNumber: res.orderNumber,
          createdAt: res.createdAt,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || null,
          shippingAddress: shippingAddress.trim(),
          cityOrDistrict: cityOrDistrict.trim(),
          shippingMethod,
          paymentMethod,
          notes: notes.trim() || null,
          totalAmount: res.totalAmount,
          totalWeightGram,
          status: "PENDING",
          whatsAppUrl: res.whatsAppUrl,
          items: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          })),
        };

        try {
          sessionStorage.setItem(
            `gg_receipt_${res.orderNumber}`,
            JSON.stringify(receiptData)
          );
        } catch {
          // Abaikan jika storage diblokir
        }

        clearCart();
        router.push(`/pembayaran/${encodeURIComponent(res.orderNumber)}`);
      }
    } catch (err) {
      console.error(err);
      setFormError("Terjadi kendala saat membuat pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#4D2E33] rounded-[24px] py-8 sm:py-16 lg:py-20 px-3.5 sm:px-8 lg:px-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start max-w-[1360px] mx-auto w-full relative"
      >
        {/* LEFT COLUMN: Checkout Form */}
        <div className="w-full lg:w-[58%] flex flex-col gap-6 sm:gap-7">
          <div className="space-y-2">
            <Reveal direction="up" delay={0.05} amount={0.05}>
              <h2 className="font-sans font-normal text-2xl sm:text-5xl lg:text-[46px] text-[#FBF1F2] tracking-[-0.02em] leading-[1.12]">
                {variant === "checkout"
                  ? "Detail Pembelian & Pengiriman"
                  : "Formulir Pembelian"}
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.12} amount={0.05}>
              <p className="font-inter text-[14px] sm:text-[16px] text-[#FBF1F2]/75 font-normal leading-relaxed max-w-[560px]">
                Lengkapi data pengiriman untuk melanjutkan ke halaman pembayaran
                dan menerbitkan struk resmi pesanan.
              </p>
            </Reveal>
          </div>

          <ExpandLine className="bg-white/[0.08]" />

          {formError && (
            <div className="p-3.5 rounded-[14px] bg-red-500/15 border border-red-400/35 text-red-100 font-inter text-[13px] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Step 1: Items In Cart Review & Steppers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-inter text-[13px] sm:text-[15px] text-[#FBF1F2] font-medium">
                1. Rincian Produk ({totalCount} item)
              </label>
              <Link
                href="/produk"
                className="font-inter text-[12px] sm:text-[13px] text-[#E7B6B4] hover:underline flex items-center gap-1"
              >
                <span>Tambah Produk Lain</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-6 rounded-[18px] bg-white/[0.04] text-center space-y-4">
                <p className="font-inter text-[14px] text-[#FBF1F2]/70">
                  Keranjang kosong. Pilih paket lulur di bawah ini:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PACKAGES.map((pkg) => (
                    <button
                      type="button"
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg.quantity)}
                      className="p-4 rounded-[16px] bg-white/[0.06] hover:bg-[#FBF1F2] hover:text-[#2B1B1D] text-[#FBF1F2] transition-all text-left flex flex-col justify-between"
                    >
                      <span className="font-inter font-semibold text-[15px]">
                        {pkg.quantity} Pot ({pkg.weight})
                      </span>
                      <span className="font-inter text-[13px] font-medium text-[#E7B6B4] mt-2">
                        {formatRupiah(pkg.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 rounded-[18px] bg-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-[#2B1B1D] shrink-0 overflow-hidden p-1 border border-white/[0.06]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-sans text-[14px] sm:text-[15px] font-medium text-[#FBF1F2] leading-snug break-words">
                          {item.name}
                        </h4>
                        <p className="font-inter text-[12px] text-[#E7B6B4] mt-0.5">
                          {formatRupiah(item.price)}{" "}
                          <span className="text-[#FBF1F2]/50">/ unit</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="sm:hidden text-[#FBF1F2]/40 hover:text-red-400 p-1.5 shrink-0"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t border-white/[0.04] sm:border-t-0">
                      <div className="flex items-center gap-1.5 bg-white/[0.06] rounded-full px-2 py-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[#FBF1F2]/70 hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-inter text-[13px] text-[#FBF1F2] min-w-[20px] text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[#FBF1F2]/70 hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-inter text-[14px] sm:text-[15px] font-semibold text-[#E7B6B4] min-w-[80px] text-right">
                        {formatRupiah(item.price * item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="hidden sm:block text-[#FBF1F2]/40 hover:text-red-400 p-1 transition-colors"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Package Presets */}
          <div className="space-y-2 pt-1">
            <label className="font-inter text-[13px] text-[#FBF1F2]/70">
              Atau pilih paket hemat langsung:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PACKAGES.map((pkg) => (
                <button
                  type="button"
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg.quantity)}
                  className="p-3 rounded-[14px] bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.05] text-left transition-colors"
                >
                  <div className="font-inter text-[13px] font-medium text-[#FBF1F2]">
                    {pkg.quantity} Pot
                  </div>
                  <div className="font-inter text-[12px] text-[#E7B6B4]">
                    {formatRupiah(pkg.price)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <ExpandLine className="bg-white/[0.08]" />

          {/* Step 2: Shipping & Payment Form Inputs */}
          <div className="space-y-4">
            <div className="font-inter text-[13px] sm:text-[15px] text-[#FBF1F2] font-medium">
              2. Data Penerima, Pengiriman &amp; Pembayaran
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-inter text-[13px] text-[#FBF1F2]/90 font-medium">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Siti Rahmawati"
                  className="w-full h-[50px] px-4 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] focus:bg-white/[0.08] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-inter text-[13px] text-[#FBF1F2]/90 font-medium">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full h-[50px] px-4 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-inter text-[13px] text-[#FBF1F2]/90 font-medium">
                  Kota / Kecamatan *
                </label>
                <input
                  type="text"
                  required
                  value={cityOrDistrict}
                  onChange={(e) => setCityOrDistrict(e.target.value)}
                  placeholder="Contoh: Makassar / Kec. Panakkukang"
                  className="w-full h-[50px] px-4 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] focus:bg-white/[0.08] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-inter text-[13px] text-[#FBF1F2]/90 font-medium">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-[50px] px-4 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            {/* Styled Custom Select Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-inter text-[13px] text-[#FBF1F2]/90 font-medium">
                  Metode Pengiriman / Kurir
                </label>
                <CustomSelect
                  value={shippingMethod}
                  onChange={setShippingMethod}
                  options={SHIPPING_OPTIONS}
                  variant="dark"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-inter text-[13px] text-[#FBF1F2]/90 font-medium">
                  Metode Pembayaran
                </label>
                <CustomSelect
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  options={PAYMENT_OPTIONS}
                  variant="dark"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-inter text-[13px] text-[#FBF1F2]/90 font-medium">
                Alamat Lengkap Pengiriman *
              </label>
              <textarea
                required
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Nama Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan, Kota & Kode Pos..."
                className="w-full p-4 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] focus:bg-white/[0.08] transition-all resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-inter text-[13px] text-[#FBF1F2]/90 font-medium">
                Catatan Pesanan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Titip ke satpam / kirim sore hari"
                className="w-full h-[50px] px-4 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-[#FBF1F2] placeholder-[#FBF1F2]/35 font-inter text-[14px] focus:outline-none focus:border-[#E7B6B4] focus:bg-white/[0.08] transition-all"
              />
            </div>
          </div>

          {/* Submit Button: Proceed to Payment Page before Receipt */}
          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full min-h-[54px] py-3.5 px-6 rounded-full bg-[#FBF1F2] hover:bg-white text-[#2B1B1D] font-inter text-[14px] sm:text-[16px] font-semibold flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-98 cursor-pointer"
          >
            <Receipt className="w-5 h-5 text-[#2B1B1D] shrink-0" />
            <span className="leading-snug text-center">
              {loading
                ? "Menyiapkan Halaman Pembayaran..."
                : `Lanjut ke Pembayaran • ${formatRupiah(totalAmount)}`}
            </span>
          </button>
        </div>

        {/* RIGHT COLUMN: Order Summary Card (Sticky Follow on Scroll) */}
        <div className="w-full lg:w-[42%] lg:sticky lg:top-24 xl:top-28 self-start z-10 transition-all">
          <div className="bg-[#2B1B1D] text-[#FBF1F2] rounded-[24px] p-6 sm:p-8 space-y-6 shadow-2xl border border-white/[0.06]">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#E7B6B4]" />
                <h3 className="font-sans text-[20px] font-normal">
                  Ringkasan Belanja
                </h3>
              </div>
              <span className="font-inter text-[12px] bg-white/[0.08] px-2.5 py-1 rounded-full text-[#FBF1F2]/80">
                {totalCount} Produk
              </span>
            </div>

            <div className="space-y-3 font-inter text-[14px]">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-[#FBF1F2]/80 text-[13px]"
                >
                  <span className="truncate max-w-[200px]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-[#FBF1F2]">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center text-[#FBF1F2]/60 text-[13px] pt-2 border-t border-white/[0.06]">
                <span>Estimasi Berat</span>
                <span>{(totalWeightGram / 1000).toFixed(1)} kg</span>
              </div>

              <div className="flex justify-between items-center text-[#FBF1F2]/60 text-[13px]">
                <span>Kurir Dipilih</span>
                <span className="text-[#FBF1F2]/85 truncate max-w-[190px] text-right">
                  {shippingMethod}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#FBF1F2]/60 text-[13px]">
                <span>Ongkos Kirim</span>
                <span className="text-[#E7B6B4]">Dihitung saat konfirmasi</span>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center">
                <span className="font-sans text-[18px]">Total Produk</span>
                <span className="font-sans text-[24px] font-semibold text-[#E7B6B4]">
                  {formatRupiah(totalAmount)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-3 font-inter text-[13px] text-[#FBF1F2]/75">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#E7B6B4] shrink-0" />
                <span>100% Asli Formula Rempah Bugis</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#E7B6B4] shrink-0" />
                <span>Pembayaran &amp; struk resmi sebelum konfirmasi WA</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#E7B6B4] shrink-0" />
                <span>Garansi Penggantian Produk Jika Pecah</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Summary Pill Bar */}
        {cartItems.length > 0 && (
          <div className="lg:hidden sticky bottom-4 left-0 right-0 z-30 w-full pt-2">
            <div className="bg-[#2B1B1D]/95 text-[#FBF1F2] rounded-full p-2.5 px-5 shadow-2xl flex items-center justify-between border border-white/[0.1] backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#E7B6B4]" />
                <div className="text-[12px] font-inter">
                  <span className="text-[#FBF1F2]/70 block">
                    {totalCount} Produk Dipilih
                  </span>
                  <span className="font-semibold text-[#E7B6B4]">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-full bg-[#FBF1F2] text-[#2B1B1D] text-[12px] font-inter font-semibold hover:bg-white transition-colors"
              >
                Lanjut Bayar
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
