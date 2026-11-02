"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Plus,
  Minus,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  Sparkles,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { PRODUCT_INFO, PACKAGES } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";
import { createOrderAction } from "@/app/actions/order";
import { Reveal, ExpandLine } from "@/components/ui/Animations";
import { useCart } from "@/context/CartContext";

export default function OrderForm() {
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
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string;
    totalAmount: number;
    whatsAppUrl: string;
    itemsSummary: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Quick preset package selection
  const handlePackageSelect = (pkgQty: number) => {
    clearCart();
    if (pkgQty === 2) {
      addToCart(
        {
          id: "bundle-2",
          name: "Paket Glowing • 2 Pot (800g)",
          subtitle: "Paket 2 Pot Hemat • Rempah Murni Bugis",
          price: 70000,
          image: "/images/orveli/prod-6.png",
          weightGram: 800,
        },
        1
      );
    } else if (pkgQty === 3) {
      addToCart(
        {
          id: "bundle-3",
          name: "Paket Keluarga • 3 Pot (1.2kg)",
          subtitle: "Paket 3 Pot Super Value • Rempah Murni Bugis",
          price: 105000,
          image: "/images/orveli/prod-7.png",
          weightGram: 1200,
        },
        1
      );
    } else {
      addToCart(
        {
          id: "prod-main",
          name: PRODUCT_INFO.name,
          subtitle: "Kemasan Pot 400g • Rempah Murni Bugis",
          price: PRODUCT_INFO.price,
          image: "/images/orveli/prod-3.png",
          weightGram: PRODUCT_INFO.weightGram,
        },
        1
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !shippingAddress.trim()
    ) {
      alert("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman Anda.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Keranjang belanja Anda masih kosong. Silakan pilih produk terlebih dahulu.");
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
        quantity: totalCount,
        items: itemsPayload,
        notes: notes.trim(),
        channel: "WHATSAPP",
      });

      if (res.success) {
        const summary = cartItems
          .map((i) => `${i.name} (${i.quantity}x)`)
          .join(", ");

        setOrderResult({
          orderNumber: res.orderNumber,
          totalAmount: res.totalAmount,
          whatsAppUrl: res.whatsAppUrl,
          itemsSummary: summary,
        });

        clearCart();
        window.open(res.whatsAppUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kendala saat memproses pesanan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const copyOrderDetails = () => {
    if (!orderResult) return;
    const text = `Kode Pesanan: ${orderResult.orderNumber} | Nama: ${customerName} | Produk: ${orderResult.itemsSummary} | Total: ${formatRupiah(
      orderResult.totalAmount
    )}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#2D3622] rounded-[24px] py-8 sm:py-16 lg:py-20 px-3.5 sm:px-8 lg:px-10">
      {orderResult ? (
        /* Success Screen */
        <div className="max-w-2xl mx-auto bg-white rounded-[24px] p-6 sm:p-12 text-center space-y-6 sm:space-y-8 text-[#201914] shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#D7D1C3] text-[#201914] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[12px] sm:text-[13px] font-inter font-medium uppercase tracking-[0.14em] text-[#2D3622]">
              Pesanan Tercatat
            </span>
            <h3 className="font-sans text-2xl sm:text-4xl font-normal text-[#201914] tracking-[-0.02em]">
              Kode: {orderResult.orderNumber}
            </h3>
            <p className="font-inter text-[14px] sm:text-[16px] text-[#201914]/70 max-w-md mx-auto leading-relaxed">
              Format pesanan telah disiapkan. Klik tombol di bawah untuk meneruskan ke WhatsApp resmi admin.
            </p>
          </div>

          {/* Receipt Box */}
          <div className="bg-[#F1E6D8]/45 rounded-[16px] p-4 sm:p-6 text-left space-y-2.5 font-inter text-[13px] sm:text-[15px]">
            <div className="flex justify-between text-[#201914]/70">
              <span>Nama</span>
              <span className="font-medium text-[#201914]">{customerName}</span>
            </div>
            <div className="flex justify-between text-[#201914]/70">
              <span>WhatsApp</span>
              <span className="font-medium text-[#201914]">{customerPhone}</span>
            </div>
            {cityOrDistrict && (
              <div className="flex justify-between text-[#201914]/70">
                <span>Kota / Kec.</span>
                <span className="font-medium text-[#201914]">{cityOrDistrict}</span>
              </div>
            )}
            <div className="flex justify-between text-[#201914]/70">
              <span>Produk</span>
              <span className="font-medium text-[#201914] max-w-[200px] text-right truncate">
                {orderResult.itemsSummary}
              </span>
            </div>
            <div className="flex justify-between text-[#201914]/70 pt-2 border-t border-[#201914]/10">
              <span>Total</span>
              <span className="font-semibold text-[#201914]">
                {formatRupiah(orderResult.totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={orderResult.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 sm:py-4 rounded-full bg-[#201914] hover:bg-[#2D3622] text-[#F1E6D8] font-inter text-[14px] sm:text-[15px] font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#D4A359]" />
              Lanjut ke WhatsApp
            </a>
            <button
              type="button"
              onClick={copyOrderDetails}
              className="px-6 py-3.5 sm:py-4 rounded-full bg-[#201914]/5 hover:bg-[#201914]/10 text-[#201914] font-inter text-[14px] sm:text-[15px] font-medium transition-colors"
            >
              {copied ? "Tersalin!" : "Salin Rincian"}
            </button>
          </div>
        </div>
      ) : (
        /* 2-Column Checkout Layout */
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start max-w-[1360px] mx-auto w-full relative"
        >
          {/* LEFT COLUMN: Modern Luxury Form */}
          <div className="w-full lg:w-[58%] flex flex-col gap-6 sm:gap-7">
            {/* Section Header */}
            <div className="space-y-2">
              <Reveal direction="up" delay={0.05} amount={0.05}>
                <h2 className="font-sans font-normal text-2xl sm:text-5xl lg:text-[46px] text-[#F1E6D8] tracking-[-0.02em] leading-[1.12]">
                  Formulir Pemesanan
                </h2>
              </Reveal>
              <Reveal direction="up" delay={0.12} amount={0.05}>
                <p className="font-inter text-[14px] sm:text-[16px] text-[#F1E6D8]/75 font-normal leading-relaxed max-w-[540px]">
                  Lengkapi data pengiriman. Pesanan terhubung langsung ke WhatsApp resmi admin.
                </p>
              </Reveal>
            </div>

            <ExpandLine className="bg-white/[0.08]" />

            {/* Step 1: Items In Cart Review & Steppers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-inter text-[13px] sm:text-[15px] text-[#F1E6D8] font-medium">
                  Rincian Pesanan ({totalCount} item)
                </label>
                <Link
                  href="/produk"
                  className="font-inter text-[12px] sm:text-[13px] text-[#D4A359] hover:underline flex items-center gap-1"
                >
                  <span>Tambah Produk Lain</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {cartItems.length === 0 ? (
                /* If empty, show quick package selector buttons */
                <div className="p-6 rounded-[16px] bg-white/[0.04] text-center space-y-4">
                  <p className="font-inter text-[14px] text-[#F1E6D8]/70">
                    Keranjang kosong. Pilih paket lulur di bawah ini:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PACKAGES.map((pkg) => (
                      <button
                        type="button"
                        key={pkg.id}
                        onClick={() => handlePackageSelect(pkg.quantity)}
                        className="p-4 rounded-[14px] bg-white/[0.06] hover:bg-[#F1E6D8] hover:text-[#201914] text-[#F1E6D8] transition-all text-left flex flex-col justify-between"
                      >
                        <span className="font-inter font-semibold text-[15px]">
                          {pkg.quantity} Pot ({pkg.weight})
                        </span>
                        <span className="font-inter text-[13px] font-medium text-[#D4A359] mt-2">
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
                      className="p-3.5 sm:p-4 rounded-[16px] bg-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/[0.04] hover:bg-white/[0.06] transition-colors"
                    >
                      {/* Top on Mobile / Left on Desktop: Image + Name + Mobile Delete */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[10px] bg-[#201914] shrink-0 overflow-hidden p-1 border border-white/[0.06]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-sans text-[14px] sm:text-[15px] font-medium text-[#F1E6D8] leading-snug break-words">
                            {item.name}
                          </h4>
                          <p className="font-inter text-[12px] text-[#D4A359] mt-0.5">
                            {formatRupiah(item.price)} <span className="text-[#F1E6D8]/50">/ unit</span>
                          </p>
                        </div>
                        {/* Mobile Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="sm:hidden text-[#F1E6D8]/40 hover:text-red-400 p-1.5 shrink-0"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom on Mobile / Right on Desktop: Stepper + Price + Desktop Delete */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t border-white/[0.04] sm:border-t-0">
                        {/* Stepper */}
                        <div className="flex items-center gap-1.5 bg-white/[0.06] rounded-full px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[#F1E6D8]/70 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Kurangi kuantitas"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-inter text-[13px] text-[#F1E6D8] min-w-[20px] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[#F1E6D8]/70 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Tambah kuantitas"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-inter text-[14px] sm:text-[15px] font-semibold text-[#D4A359] min-w-[80px] text-right">
                          {formatRupiah(item.price * item.quantity)}
                        </span>

                        {/* Desktop Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="hidden sm:block text-[#F1E6D8]/40 hover:text-red-400 p-1 transition-colors"
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
              <label className="font-inter text-[13px] text-[#F1E6D8]/70">
                Atau pilih paket hemat langsung:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {PACKAGES.map((pkg) => (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg.quantity)}
                    className="p-3 rounded-[12px] bg-white/[0.03] hover:bg-white/[0.08] text-left transition-colors"
                  >
                    <div className="font-inter text-[13px] font-medium text-[#F1E6D8]">
                      {pkg.quantity} Pot
                    </div>
                    <div className="font-inter text-[12px] text-[#D4A359]">
                      {formatRupiah(pkg.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <ExpandLine className="bg-white/[0.08]" />

            {/* Step 2: Shipping Form Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-inter text-[13px] text-[#F1E6D8]/90 font-medium">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Siti Rahmawati"
                    className="w-full h-[50px] px-4 rounded-[12px] bg-white/[0.04] text-[#F1E6D8] placeholder-[#F1E6D8]/35 font-inter text-[14px] focus:outline-none focus:bg-white/[0.07] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-inter text-[13px] text-[#F1E6D8]/90 font-medium">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full h-[50px] px-4 rounded-[12px] bg-white/[0.04] text-[#F1E6D8] placeholder-[#F1E6D8]/35 font-inter text-[14px] focus:outline-none focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-inter text-[13px] text-[#F1E6D8]/90 font-medium">
                    Kota / Kecamatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityOrDistrict}
                    onChange={(e) => setCityOrDistrict(e.target.value)}
                    placeholder="Contoh: Makassar / Kec. Panakkukang"
                    className="w-full h-[50px] px-4 rounded-[12px] bg-white/[0.04] text-[#F1E6D8] placeholder-[#F1E6D8]/35 font-inter text-[14px] focus:outline-none focus:bg-white/[0.07] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-inter text-[13px] text-[#F1E6D8]/90 font-medium">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full h-[50px] px-4 rounded-[12px] bg-white/[0.04] text-[#F1E6D8] placeholder-[#F1E6D8]/35 font-inter text-[14px] focus:outline-none focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-inter text-[13px] text-[#F1E6D8]/90 font-medium">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Nama Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan, Kota & Kode Pos..."
                  className="w-full p-4 rounded-[12px] bg-white/[0.04] text-[#F1E6D8] placeholder-[#F1E6D8]/35 font-inter text-[14px] focus:outline-none focus:bg-white/[0.07] transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-inter text-[13px] text-[#F1E6D8]/90 font-medium">
                  Catatan Pesanan (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Titip ke satpam / kirim sore hari"
                  className="w-full h-[50px] px-4 rounded-[12px] bg-white/[0.04] text-[#F1E6D8] placeholder-[#F1E6D8]/35 font-inter text-[14px] focus:outline-none focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full min-h-[54px] py-3.5 px-6 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[14px] sm:text-[16px] font-medium flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-98"
            >
              <MessageCircle className="w-5 h-5 text-[#201914] shrink-0" />
              <span className="leading-snug text-center">
                {loading
                  ? "Menyiapkan Pesanan..."
                  : `Kirim Pesanan ke WhatsApp • ${formatRupiah(totalAmount)}`}
              </span>
            </button>
          </div>

          {/* RIGHT COLUMN: Order Summary Card (Sticky Follow on Scroll) */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-24 xl:top-28 self-start z-10 transition-all">
            <div className="bg-[#201914] text-[#F1E6D8] rounded-[24px] p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4A359]" />
                  <h3 className="font-sans text-[20px] font-normal">
                    Ringkasan Belanja
                  </h3>
                </div>
                <span className="font-inter text-[12px] bg-white/[0.08] px-2.5 py-1 rounded-full text-[#F1E6D8]/80">
                  {totalCount} Produk
                </span>
              </div>

              {/* Items in Summary */}
              <div className="space-y-3 font-inter text-[14px]">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-[#F1E6D8]/80 text-[13px]"
                  >
                    <span className="truncate max-w-[200px]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-[#F1E6D8]">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between items-center text-[#F1E6D8]/60 text-[13px] pt-2 border-t border-white/[0.06]">
                  <span>Estimasi Berat</span>
                  <span>{(totalWeightGram / 1000).toFixed(1)} kg</span>
                </div>

                <div className="flex justify-between items-center text-[#F1E6D8]/60 text-[13px]">
                  <span>Ongkos Kirim</span>
                  <span className="text-[#D4A359]">Dihitung oleh Admin</span>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center">
                  <span className="font-sans text-[18px]">Total Tagihan</span>
                  <span className="font-sans text-[24px] font-semibold text-[#D4A359]">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-white/[0.08] space-y-3 font-inter text-[13px] text-[#F1E6D8]/75">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4A359] shrink-0" />
                  <span>100% Asli Formula Rempah Bugis</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#D4A359] shrink-0" />
                  <span>Kirim ke Seluruh Kota di Indonesia</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-[#D4A359] shrink-0" />
                  <span>Garansi Penggantian Produk Jika Pecah</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sticky Bottom Summary Pill Bar */}
          {cartItems.length > 0 && (
            <div className="lg:hidden sticky bottom-4 left-0 right-0 z-30 w-full pt-2">
              <div className="bg-[#201914]/95 text-[#F1E6D8] rounded-full p-2.5 px-5 shadow-2xl flex items-center justify-between border border-white/[0.1] backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#D4A359]" />
                  <div className="text-[12px] font-inter">
                    <span className="text-[#F1E6D8]/70 block">{totalCount} Produk Dipilih</span>
                    <span className="font-semibold text-[#D4A359]">{formatRupiah(totalAmount)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-full bg-[#F1E6D8] text-[#201914] text-[12px] font-inter font-medium hover:bg-white transition-colors"
                >
                  Kirim Pesanan
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
