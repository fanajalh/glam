import type { BatchStatus, OrderSource, OrderStatus } from "@prisma/client";

export interface SerializedOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productName: string;
}

export interface SerializedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  cityOrDistrict: string | null;
  notes: string | null;
  totalAmount: number;
  status: OrderStatus;
  channel: OrderSource;
  createdAt: string;
  items: SerializedOrderItem[];
}

export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  weightGram: number;
  stock: number;
  imageUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface SerializedLabBatch {
  id: string;
  batchCode: string;
  productId: string | null;
  productName: string;
  productionDate: string;
  expiryDate: string;
  phLevel: string;
  colorResult: string;
  aromaResult: string;
  textureResult: string;
  homogeneity: string;
  irritationTest: string;
  hedonicScore: number;
  formulatorName: string;
  qcStatus: BatchStatus;
  notes: string | null;
  createdAt: string;
}

export interface EnvChecklist {
  hasDatabaseUrl: boolean;
  hasSessionSecret: boolean;
  isDbConnected: boolean;
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badgeClass: string }
> = {
  PENDING: {
    label: "Menunggu Pembayaran",
    badgeClass: "bg-slate-500/15 text-slate-800 border-slate-500/30",
  },
  CONFIRMED: {
    label: "Membutuhkan Konfirmasi",
    badgeClass: "bg-amber-500/20 text-amber-900 border-amber-500/40",
  },
  PAID: {
    label: "Pembayaran Terverifikasi",
    badgeClass: "bg-emerald-500/15 text-emerald-800 border-emerald-500/30",
  },
  SHIPPED: {
    label: "Dikirim",
    badgeClass: "bg-violet-500/15 text-violet-800 border-violet-500/30",
  },
  COMPLETED: {
    label: "Selesai",
    badgeClass: "bg-emerald-600/15 text-emerald-900 border-emerald-600/35",
  },
  CANCELLED: {
    label: "Dibatalkan",
    badgeClass: "bg-red-500/15 text-red-800 border-red-500/30",
  },
};

export const BATCH_STATUS_META: Record<
  BatchStatus,
  { label: string; badgeClass: string }
> = {
  PASSED: {
    label: "Lulus Uji QC",
    badgeClass: "bg-emerald-500/15 text-emerald-800 border-emerald-500/30",
  },
  TESTING: {
    label: "Tahap Pengujian",
    badgeClass: "bg-amber-500/15 text-amber-800 border-amber-500/30",
  },
  RECALLED: {
    label: "Ditahan / Recall",
    badgeClass: "bg-red-500/15 text-red-800 border-red-500/30",
  },
};

export const PRODUCT_IMAGE_PRESETS = [
  { label: "Lulur Pot 400g (Studio)", url: "/images/glam/jar-studio-pedestal.jpg" },
  { label: "Lulur + Bahan Alami", url: "/images/glam/jar-ingredients-wood.jpg" },
  { label: "Lulur Edisi Batik", url: "/images/glam/jar-batik-spices.jpg" },
  { label: "Foto Produk Asli", url: "/images/glam/jar-real-hand.jpg" },
];

