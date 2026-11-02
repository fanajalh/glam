import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  } else if (cleaned.startsWith("+62")) {
    cleaned = "62" + cleaned.substring(3);
  }
  return cleaned;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GNG-${year}${month}-${random}`;
}

export function createWhatsAppOrderLink(params: {
  sellerPhone: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  cityOrDistrict?: string;
  quantity?: number;
  itemsText?: string;
  totalAmount: number;
  notes?: string;
}): string {
  const seller = cleanPhoneNumber(params.sellerPhone);
  const itemsSection = params.itemsText
    ? `*DETAIL PESANAN:*\n${params.itemsText}`
    : `*JUMLAH:* ${params.quantity || 1} Pot (400g/pot)`;

  const message = `Halo Admin Glam & Glow, saya ingin memesan produk:

*KODE PESANAN:* ${params.orderNumber}
*Nama Pemesan:* ${params.customerName}
*No. WhatsApp:* ${params.customerPhone}
*Alamat Lengkap:* ${params.address} ${params.cityOrDistrict ? `(${params.cityOrDistrict})` : ""}
${itemsSection}
*Total Harga:* ${formatRupiah(params.totalAmount)} (Belum termasuk ongkir)
${params.notes ? `*Catatan:* ${params.notes}\n` : ""}
Mohon informasi total ongkir dan nomor rekening pembayaran. Terima kasih!`;

  return `https://wa.me/${seller}?text=${encodeURIComponent(message)}`;
}

