"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Info,
  Package,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Wallet,
} from "lucide-react";
import {
  PAYMENT_OPTIONS,
  calculateOrderTotals,
} from "@/lib/constants";
import { useSiteContent } from "@/context/SiteContentContext";
import { formatRupiah } from "@/lib/utils";
import { confirmOrderPaymentAction } from "@/app/actions/order";
import CustomSelect from "@/components/ui/CustomSelect";
import type { ReceiptPayload } from "@/components/order/ReceiptView";

function normalizePaymentOption(raw?: string): string {
  const upper = (raw || "").toUpperCase();
  if (upper.includes("COD")) return PAYMENT_OPTIONS[2].value;
  if (
    upper.includes("E-WALLET") ||
    upper.includes("GOPAY") ||
    upper.includes("DANA") ||
    upper.includes("OVO")
  ) {
    return PAYMENT_OPTIONS[1].value;
  }
  return PAYMENT_OPTIONS[0].value;
}

export default function PaymentView({
  orderCode,
  serverReceipt,
}: {
  orderCode: string;
  serverReceipt: ReceiptPayload | null;
}) {
  const router = useRouter();
  const { payment } = useSiteContent();
  const bankAccounts = payment.bankAccounts;
  const ewalletAccounts = payment.ewalletAccounts;

  const [orderData, setOrderData] = useState<ReceiptPayload | null>(serverReceipt);
  const [selectedMethod, setSelectedMethod] = useState(
    normalizePaymentOption(serverReceipt?.paymentMethod)
  );
  const [selectedBankId, setSelectedBankId] = useState(
    bankAccounts[0]?.id || "BCA"
  );
  const [selectedWalletId, setSelectedWalletId] = useState(
    ewalletAccounts[0]?.id || "GoPay"
  );
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState(
    serverReceipt?.paymentReference || ""
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (serverReceipt) return;
    try {
      const cached = sessionStorage.getItem(`gg_receipt_${orderCode}`);
      if (cached) {
        const parsed = JSON.parse(cached) as ReceiptPayload;
        setOrderData(parsed);
        if (parsed.paymentMethod) {
          setSelectedMethod(normalizePaymentOption(parsed.paymentMethod));
        }
        if (parsed.paymentReference) {
          setPaymentReference(parsed.paymentReference);
        }
      }
    } catch {
      // Abaikan jika sessionStorage tidak tersedia
    }
  }, [orderCode, serverReceipt]);

  const isCod = selectedMethod.toUpperCase().includes("COD");
  const isEwallet = selectedMethod.toUpperCase().includes("E-WALLET");

  const activeBank =
    bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];
  const activeWallet =
    ewalletAccounts.find((w) => w.id === selectedWalletId) ||
    ewalletAccounts[0];

  const totals = calculateOrderTotals(
    orderData?.totalAmount ?? 0,
    selectedMethod,
    orderData?.shippingMethod,
    {
      adminFee: payment.adminFee,
      serviceFee: payment.serviceFee,
      codFee: payment.codFee,
      shippingFeeStand: payment.shippingFeeStand,
      shippingFeeLocal: payment.shippingFeeLocal,
      shippingFeeRegular: payment.shippingFeeRegular,
    }
  );
  const totalQuantity =
    orderData?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(id);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData) return;

    setSubmitting(true);
    try {
      const detailedPaymentMethod = isCod
        ? `COD / Bayar di Tempat (Admin ${formatRupiah(totals.adminFee)} + Layanan COD ${formatRupiah(totals.serviceFee)} + Paket ${formatRupiah(totals.packageFee)})`
        : isEwallet
        ? `E-Wallet - ${activeWallet.provider} (${activeWallet.phoneNumber})`
        : `Transfer Bank - ${activeBank.bank} (${activeBank.accountNumber})`;

      const result = await confirmOrderPaymentAction({
        orderNumber: orderData.orderNumber,
        paymentMethod: detailedPaymentMethod,
        paymentReference: paymentReference.trim(),
      });

      const updatedReceipt: ReceiptPayload = {
        ...orderData,
        paymentMethod: detailedPaymentMethod,
        paymentReference: paymentReference.trim() || undefined,
        status: result.status || "CONFIRMED",
        whatsAppUrl: result.whatsAppUrl || orderData.whatsAppUrl,
      };

      try {
        sessionStorage.setItem(
          `gg_receipt_${orderData.orderNumber}`,
          JSON.stringify(updatedReceipt)
        );
      } catch {
        // Abaikan jika storage penuh/diblokir
      }

      router.push(`/struk/${encodeURIComponent(orderData.orderNumber)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!orderData) {
    return (
      <div className="max-w-xl mx-auto rounded-[28px] bg-[#201914] text-[#F1E6D8] p-8 sm:p-12 text-center space-y-5 border border-white/[0.08] shadow-xl">
        <div className="w-14 h-14 rounded-full bg-white/[0.08] text-[#D4A359] flex items-center justify-center mx-auto">
          <CreditCard className="w-7 h-7" />
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-normal">
          Data Pembayaran Tidak Ditemukan
        </h1>
        <p className="font-inter text-[14px] text-[#F1E6D8]/70 leading-relaxed">
          Nomor pesanan{" "}
          <strong className="font-mono text-[#D4A359]">{orderCode}</strong>{" "}
          belum ditemukan atau sesi lokal sudah berakhir.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/pembelian"
            className="px-6 py-3 rounded-full bg-[#F1E6D8] text-[#201914] font-inter text-[13px] font-semibold"
          >
            Buat Pesanan Baru
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-white/[0.08] text-[#F1E6D8] font-inter text-[13px] font-medium"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1560px] mx-auto space-y-4">
      {/* Header Banner */}
      <div className="rounded-[24px] bg-[#201914] text-[#F1E6D8] p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-white/[0.08]">
        <div className="space-y-2.5 max-w-xl">
          <Link
            href="/pembelian"
            className="inline-flex items-center gap-1.5 font-inter text-[12px] text-[#F1E6D8]/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Pembelian</span>
          </Link>
          <h1 className="font-sans text-3xl sm:text-5xl font-normal tracking-[-0.03em] leading-[1.1]">
            Halaman Pembayaran
          </h1>
          <p className="font-inter text-[14px] sm:text-[15px] text-[#F1E6D8]/75">
            Selesaikan rincian pembayaran pesanan{" "}
            <strong className="font-mono text-[#D4A359]">
              {orderData.orderNumber}
            </strong>{" "}
            sebelum menerbitkan struk resmi Anda.
          </p>
        </div>

        {/* 3-Step Flow Indicator */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 font-inter text-[12px] shrink-0">
          <div className="px-3.5 py-3 rounded-[16px] bg-white/[0.06] border border-white/[0.08] space-y-1">
            <ShoppingBag className="w-4 h-4 text-[#D4A359]" />
            <span className="block font-semibold">1. Pengiriman</span>
            <span className="block text-[11px] text-[#F1E6D8]/60">
              Data terisi
            </span>
          </div>
          <div className="px-3.5 py-3 rounded-[16px] bg-[#2D3622] border border-[#D4A359]/50 space-y-1">
            <Wallet className="w-4 h-4 text-[#D4A359]" />
            <span className="block font-semibold">2. Pembayaran</span>
            <span className="block text-[11px] text-[#F1E6D8]/80">
              Langkah aktif
            </span>
          </div>
          <div className="px-3.5 py-3 rounded-[16px] bg-white/[0.06] border border-white/[0.08] space-y-1">
            <Receipt className="w-4 h-4 text-[#D4A359]" />
            <span className="block font-semibold">3. Struk &amp; WA</span>
            <span className="block text-[11px] text-[#F1E6D8]/60">
              Terbit &amp; konfirmasi
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Flush Left/Right to match Header & Navbar */}
      <form
        onSubmit={handleConfirmPayment}
        className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start"
      >
        {/* Left: Payment Method & Dynamic Destination Numbers */}
        <div className="lg:col-span-7 rounded-[24px] bg-[#2D3622] text-[#F1E6D8] p-5 sm:p-8 lg:p-10 space-y-6 border border-white/[0.08]">
          <div className="space-y-1.5">
            <span className="font-inter text-[11px] uppercase tracking-[0.14em] text-[#D4A359] block">
              Tahap Pembayaran
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-normal">
              Pilih &amp; Konfirmasi Pembayaran
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block font-inter text-[13px] text-[#F1E6D8]/90 font-medium">
              Metode Pembayaran
            </label>
            <CustomSelect
              value={selectedMethod}
              onChange={setSelectedMethod}
              options={PAYMENT_OPTIONS}
              variant="dark"
            />
          </div>

          {/* Dynamic Payment Detail Box */}
          {isCod ? (
            <div className="rounded-[20px] bg-[#201914] p-5 sm:p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] text-[#D4A359] flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-[18px] text-[#F1E6D8]">
                    Rincian Biaya COD, Admin &amp; Paket
                  </h3>
                  <p className="font-inter text-[13px] text-[#F1E6D8]/70 leading-relaxed">
                    Siapkan pembayaran tunai kepada kurir saat paket tiba sesuai
                    rincian di bawah ini.
                  </p>
                </div>
              </div>

              <div className="rounded-[14px] bg-white/[0.04] border border-white/[0.06] p-4 space-y-2.5 font-inter text-[13px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#F1E6D8]/70 flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#D4A359] shrink-0" />
                    <span>
                      Harga Paket Produk ({totalQuantity} Pot × 400g)
                    </span>
                  </span>
                  <span className="font-semibold text-[#F1E6D8]">
                    {formatRupiah(totals.productSubtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#F1E6D8]/70">Biaya Admin</span>
                  <span className="font-semibold text-[#F1E6D8]">
                    {formatRupiah(totals.adminFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#F1E6D8]/70">
                    {totals.serviceFeeLabel}
                  </span>
                  <span className="font-semibold text-[#F1E6D8]">
                    {formatRupiah(totals.serviceFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#F1E6D8]/70">
                    Biaya Pengiriman Paket ({orderData.shippingMethod || "Reguler"})
                  </span>
                  <span className="font-semibold text-[#F1E6D8]">
                    {formatRupiah(totals.packageFee)}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <span className="font-medium text-[#F1E6D8]">
                    Total Bayar Tunai di Tempat
                  </span>
                  <span className="text-lg font-bold text-[#D4A359]">
                    {formatRupiah(totals.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          ) : isEwallet ? (
            <div className="rounded-[20px] bg-[#201914] p-5 sm:p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] text-[#D4A359] flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-[18px] text-[#F1E6D8]">
                    Nomor Tujuan E-Wallet (GoPay / DANA / OVO)
                  </h3>
                  <p className="font-inter text-[13px] text-[#F1E6D8]/70">
                    Pilih dompet digital di bawah untuk melihat dan menyalin nomor tujuan.
                  </p>
                </div>
              </div>

              {/* Provider Selector Pills */}
              <div className="grid grid-cols-3 gap-2">
                {ewalletAccounts.map((wallet) => {
                  const active = wallet.id === selectedWalletId;
                  return (
                    <button
                      key={wallet.id}
                      type="button"
                      onClick={() => setSelectedWalletId(wallet.id)}
                      className={`py-2.5 px-3 rounded-[12px] font-inter text-[13px] font-semibold border transition-all cursor-pointer ${
                        active
                          ? "bg-[#2D3622] border-[#D4A359] text-[#F1E6D8]"
                          : "bg-white/[0.04] border-white/[0.08] text-[#F1E6D8]/70 hover:bg-white/[0.08]"
                      }`}
                    >
                      {wallet.provider}
                    </button>
                  );
                })}
              </div>

              {/* Active E-Wallet Number Card */}
              <div className="rounded-[14px] bg-white/[0.05] border border-white/[0.08] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-inter text-[11px] uppercase tracking-wider text-[#D4A359] block">
                    Nomor {activeWallet.provider}
                  </span>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#F1E6D8] tracking-wide">
                    {activeWallet.phoneNumber}
                  </p>
                  <p className="font-inter text-[12px] text-[#F1E6D8]/65">
                    a.n. {activeWallet.holderName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      activeWallet.phoneNumber.replace(/[^0-9]/g, ""),
                      `wallet-${activeWallet.id}`
                    )
                  }
                  className="px-4 py-2.5 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedValue === `wallet-${activeWallet.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2D3622]" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Nomor</span>
                    </>
                  )}
                </button>
              </div>

              {/* Transparent Fee Summary inside Instruction Box */}
              <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center justify-between gap-3 font-inter text-[12px]">
                <span className="text-[#F1E6D8]/70">
                  Total Transfer (Produk + Admin + Layanan + Paket)
                </span>
                <span className="font-bold text-[#D4A359] text-[14px] shrink-0">
                  {formatRupiah(totals.grandTotal)}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-[20px] bg-[#201914] p-5 sm:p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] text-[#D4A359] flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-[18px] text-[#F1E6D8]">
                    Nomor Rekening Transfer Bank
                  </h3>
                  <p className="font-inter text-[13px] text-[#F1E6D8]/70">
                    Pilih bank tujuan untuk menampilkan nomor rekening dan menyalinnya.
                  </p>
                </div>
              </div>

              {/* Bank Selector Pills */}
              <div className="grid grid-cols-3 gap-2">
                {bankAccounts.map((bank) => {
                  const active = bank.id === selectedBankId;
                  return (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBankId(bank.id)}
                      className={`py-2.5 px-3 rounded-[12px] font-inter text-[13px] font-semibold border transition-all cursor-pointer ${
                        active
                          ? "bg-[#2D3622] border-[#D4A359] text-[#F1E6D8]"
                          : "bg-white/[0.04] border-white/[0.08] text-[#F1E6D8]/70 hover:bg-white/[0.08]"
                      }`}
                    >
                      {bank.id}
                    </button>
                  );
                })}
              </div>

              {/* Active Bank Account Number Card */}
              <div className="rounded-[14px] bg-white/[0.05] border border-white/[0.08] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-inter text-[11px] uppercase tracking-wider text-[#D4A359] block">
                    {activeBank.bank}
                  </span>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#F1E6D8] tracking-wide">
                    {activeBank.accountNumber}
                  </p>
                  <p className="font-inter text-[12px] text-[#F1E6D8]/65">
                    a.n. {activeBank.holderName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      activeBank.accountNumber,
                      `bank-${activeBank.id}`
                    )
                  }
                  className="px-4 py-2.5 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedValue === `bank-${activeBank.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2D3622]" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Norek</span>
                    </>
                  )}
                </button>
              </div>

              {/* Transparent Fee Summary inside Instruction Box */}
              <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center justify-between gap-3 font-inter text-[12px]">
                <span className="text-[#F1E6D8]/70">
                  Total Transfer (Produk + Admin + Layanan + Paket)
                </span>
                <span className="font-bold text-[#D4A359] text-[14px] shrink-0">
                  {formatRupiah(totals.grandTotal)}
                </span>
              </div>
            </div>
          )}

          {/* Payment Reference / Sender Info (Optional) */}
          <div className="space-y-2">
            <label className="block font-inter text-[13px] text-[#F1E6D8]/90 font-medium">
              {isCod
                ? "Catatan Pembayaran COD (Opsional)"
                : "Nama Pemilik Rekening / Akun Pengirim (Opsional)"}
            </label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder={
                isCod
                  ? "Contoh: Siapkan uang pas / bayar di tempat ke penerima"
                  : isEwallet
                  ? `Contoh: Pengirim ${activeWallet.provider} a.n. Andi Putri`
                  : `Contoh: Transfer ${activeBank.bank} a.n. Andi Putri`
              }
              className="w-full h-[50px] px-4 rounded-[14px] bg-white/[0.06] border border-white/[0.1] text-[#F1E6D8] placeholder-[#F1E6D8]/40 font-inter text-[14px] focus:outline-none focus:border-[#D4A359] transition-all"
            />
            <p className="font-inter text-[12px] text-[#F1E6D8]/60 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#D4A359] shrink-0" />
              <span>
                Informasi ini otomatis dicatat pada struk resmi agar admin lebih
                cepat memverifikasi.
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[54px] py-3.5 px-6 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-[#2D3622] shrink-0" />
            <span>
              {submitting
                ? "Menerbitkan Struk Resmi..."
                : isCod
                ? `Konfirmasi COD (${formatRupiah(totals.grandTotal)}) & Terbitkan Struk`
                : `Konfirmasi Pembayaran (${formatRupiah(totals.grandTotal)}) & Terbitkan Struk`}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Right: Order Bill Summary (Includes Admin & Service Fee for ALL methods) */}
        <div className="lg:col-span-5 rounded-[24px] bg-[#201914] text-[#F1E6D8] p-5 sm:p-8 lg:p-9 space-y-5 border border-white/[0.08] shadow-xl lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <span className="font-inter text-[11px] uppercase tracking-wider text-[#F1E6D8]/55 block">
                Kode Pesanan
              </span>
              <span className="font-mono text-lg font-bold text-[#D4A359]">
                {orderData.orderNumber}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/[0.08] font-inter text-[11px] text-[#F1E6D8]/85">
              Menunggu Pembayaran
            </span>
          </div>

          <div className="space-y-3 font-inter text-[13px]">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#F1E6D8]/50 block">
                Pemesan &amp; Tujuan
              </span>
              <p className="font-semibold text-[#F1E6D8]">
                {orderData.customerName} • {orderData.customerPhone}
              </p>
              <p className="text-[#F1E6D8]/70 leading-relaxed">
                {orderData.shippingAddress}
                {orderData.cityOrDistrict ? ` (${orderData.cityOrDistrict})` : ""}
              </p>
              {orderData.shippingMethod && (
                <p className="text-[#D4A359] text-[12px] pt-0.5">
                  Kurir: {orderData.shippingMethod}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
              <span className="text-[11px] uppercase tracking-wider text-[#F1E6D8]/50 block">
                Rincian Item
              </span>
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-3">
                  <span className="text-[#F1E6D8]/85">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-[#F1E6D8] shrink-0">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              {!isCod && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[#F1E6D8]/65">Tujuan Pembayaran</span>
                  <span className="text-[#D4A359] text-right font-medium">
                    {isEwallet
                      ? `${activeWallet.provider} • ${activeWallet.phoneNumber}`
                      : `${activeBank.bank} • ${activeBank.accountNumber}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-[#F1E6D8]/65">Biaya Admin</span>
                <span className="font-medium text-[#F1E6D8]">
                  {formatRupiah(totals.adminFee)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#F1E6D8]/65">
                  {totals.serviceFeeLabel}
                </span>
                <span className="font-medium text-[#F1E6D8]">
                  {formatRupiah(totals.serviceFee)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#F1E6D8]/65">
                  Biaya Pengiriman Paket
                </span>
                <span className="font-medium text-[#F1E6D8]">
                  {formatRupiah(totals.packageFee)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-white/[0.15] flex justify-between items-center">
              <span className="font-sans text-[18px] text-[#F1E6D8]">
                {isCod ? "Total COD & Paket" : "Total Tagihan"}
              </span>
              <span className="font-sans text-2xl font-bold text-[#D4A359]">
                {formatRupiah(totals.grandTotal)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2 font-inter text-[12px] text-[#F1E6D8]/65">
            <ShieldCheck className="w-4 h-4 text-[#D4A359] shrink-0" />
            <span>
              Struk resmi langsung diterbitkan setelah Anda menekan tombol
              konfirmasi.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
