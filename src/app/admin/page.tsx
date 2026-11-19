import React from "react";
import { redirect } from "next/navigation";
import { canConnectToDatabase, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { getLocalFallbackOrders } from "@/lib/local-order-fallback";
import { getSiteContent } from "@/lib/site-content";
import { getAdminSession } from "@/lib/admin-auth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import type {
  EnvChecklist,
  SerializedLabBatch,
  SerializedOrder,
  SerializedProduct,
} from "@/lib/admin-types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard • Glam & Glow",
  description:
    "Panel admin manajemen pesanan, produk, stok, dan data uji lab Farmasi Glam & Glow.",
};

const FALLBACK_ORDERS: SerializedOrder[] = [
  {
    id: "sample-order-1",
    orderNumber: "GG-20261119-01",
    customerName: "Siti Rahmawati",
    customerPhone: "081234567890",
    customerEmail: "siti.rahma@gmail.com",
    shippingAddress: "Jl. Boulevard Panakkukang No. 12, Kel. Masale",
    cityOrDistrict: "Kota Makassar",
    notes: "Kurir: J&T Express (Reguler) | Pembayaran: Transfer Bank - Bank BCA (1234567890) | Ref Pembayaran: Transfer a.n. Siti Rahmawati",
    totalAmount: 70000,
    status: "CONFIRMED",
    channel: "DIRECT_WEB",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: "sample-item-1",
        quantity: 2,
        unitPrice: 35000,
        subtotal: 70000,
        productName: "Glam & Glow Lulur Badda Lotong",
      },
    ],
  },
  {
    id: "sample-order-2",
    orderNumber: "GG-20261119-02",
    customerName: "Andi Nurhaliza",
    customerPhone: "085299887766",
    customerEmail: null,
    shippingAddress: "Jl. Somba Opu No. 45",
    cityOrDistrict: "Kota Makassar",
    notes: "Dicampur susu plain saat pakai.",
    totalAmount: 35000,
    status: "PENDING",
    channel: "WHATSAPP",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      {
        id: "sample-item-2",
        quantity: 1,
        unitPrice: 35000,
        subtotal: 35000,
        productName: "Glam & Glow Lulur Badda Lotong",
      },
    ],
  },
];

const FALLBACK_PRODUCTS: SerializedProduct[] = [
  {
    id: "sample-prod-1",
    name: "Glam & Glow Lulur Badda Lotong",
    slug: "glam-and-glow-lulur-badda-lotong",
    category: "Signature Lulur",
    tagline: "Berat bersih: 400 gram • 5 Bahan Alami",
    description:
      "Lulur Badda Lotong berbahan alami beras ketan putih, daun pandan, jeruk nipis, kunyit, dan cengkeh.",
    price: 35000,
    weightGram: 400,
    stock: 150,
    imageUrl: "/images/glam/jar-studio-pedestal.jpg",
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const FALLBACK_BATCHES: SerializedLabBatch[] = [
  {
    id: "sample-batch-1",
    batchCode: "GG-BL-2026-01",
    productId: "sample-prod-1",
    productName: "Glam & Glow Lulur Badda Lotong (400g)",
    productionDate: "2026-11-01T00:00:00.000Z",
    expiryDate: "2027-09-08T00:00:00.000Z",
    phLevel: "5.7",
    colorResult: "Cokelat kehijauan-gelap merata khas racikan beras ketan dan kunyit",
    aromaResult: "Harum alami daun pandan, jeruk nipis segar, dan rempah cengkeh",
    textureResult: "Serbuk/pasta alami dengan butiran halus beras ketan putih",
    homogeneity: "Homogen, tidak ada pemisahan fase",
    irritationTest: "Negatif (Aman pada uji tempel kulit utuh 24 jam)",
    hedonicScore: 4.8,
    formulatorName: "Tim Teknologi Farmasi PLB",
    qcStatus: "PASSED",
    notes: "Simpan produk dalam wadah tertutup di tempat kering.",
    createdAt: new Date().toISOString(),
  },
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let orders: SerializedOrder[] = [];
  let products: SerializedProduct[] = [];
  let batches: SerializedLabBatch[] = [];
  let isDbConnected = false;

  if (await canConnectToDatabase()) {
    try {
      const [dbOrders, dbProducts, dbBatches] = await Promise.all([
        prisma.order.findMany({
          include: {
            items: {
              include: {
                product: { select: { name: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        prisma.product.findMany({
          orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
        }),
        prisma.labBatch.findMany({
          orderBy: { createdAt: "desc" },
        }),
      ]);

      isDbConnected = true;

      orders = dbOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerEmail: o.customerEmail,
        shippingAddress: o.shippingAddress,
        cityOrDistrict: o.cityOrDistrict,
        notes: o.notes,
        totalAmount: o.totalAmount,
        status: o.status,
        channel: o.channel,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((it) => ({
          id: it.id,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          subtotal: it.subtotal,
          productName: it.product?.name ?? "Glam & Glow Lulur",
        })),
      }));

      products = dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        tagline: p.tagline,
        description: p.description,
        price: p.price,
        weightGram: p.weightGram,
        stock: p.stock,
        imageUrl: p.imageUrl,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        createdAt: p.createdAt.toISOString(),
      }));

      batches = dbBatches.map((b) => ({
        id: b.id,
        batchCode: b.batchCode,
        productId: b.productId,
        productName: b.productName,
        productionDate: b.productionDate.toISOString(),
        expiryDate: b.expiryDate.toISOString(),
        phLevel: b.phLevel,
        colorResult: b.colorResult,
        aromaResult: b.aromaResult,
        textureResult: b.textureResult,
        homogeneity: b.homogeneity,
        irritationTest: b.irritationTest,
        hedonicScore: b.hedonicScore,
        formulatorName: b.formulatorName,
        qcStatus: b.qcStatus,
        notes: b.notes,
        createdAt: b.createdAt.toISOString(),
      }));
    } catch {
      isDbConnected = false;
    }
  }

  if (!isDbConnected) {
    orders = [...getLocalFallbackOrders(), ...FALLBACK_ORDERS];
    products = FALLBACK_PRODUCTS;
    batches = FALLBACK_BATCHES;
  }

  const siteContent = await getSiteContent();

  const envChecklist: EnvChecklist = {
    hasDatabaseUrl: isDatabaseConfigured(),
    hasSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
    isDbConnected,
  };

  return (
    <AdminDashboardClient
      initialTab={searchParams?.tab}
      adminName={session.displayName}
      adminUsername={session.username}
      orders={orders}
      products={products}
      batches={batches}
      siteContent={siteContent}
      envChecklist={envChecklist}
    />
  );
}

