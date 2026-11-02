"use server";

import { prisma } from "@/lib/prisma";
import { generateOrderNumber, createWhatsAppOrderLink, formatRupiah } from "@/lib/utils";
import { PRODUCT_INFO } from "@/lib/constants";

export interface OrderItemInput {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  cityOrDistrict?: string;
  quantity?: number;
  items?: OrderItemInput[];
  notes?: string;
  channel?: "WHATSAPP" | "INSTAGRAM_DM" | "DIRECT_WEB";
}

export interface CreateOrderResult {
  success: boolean;
  orderNumber: string;
  totalAmount: number;
  whatsAppUrl: string;
  message?: string;
}

export async function createOrderAction(
  data: CreateOrderInput
): Promise<CreateOrderResult> {
  const hasCustomItems = Boolean(data.items && data.items.length > 0);
  const totalAmount = hasCustomItems
    ? data.items!.reduce((acc, it) => acc + it.price * it.quantity, 0)
    : (Math.max(1, Number(data.quantity) || 1) * PRODUCT_INFO.price);

  const totalQuantity = hasCustomItems
    ? data.items!.reduce((acc, it) => acc + it.quantity, 0)
    : Math.max(1, Number(data.quantity) || 1);

  const itemsText = hasCustomItems
    ? data.items!
        .map(
          (it) =>
            `• ${it.name} (${it.quantity}x @ ${formatRupiah(it.price)}) = ${formatRupiah(
              it.price * it.quantity
            )}`
        )
        .join("\n")
    : `• ${PRODUCT_INFO.name} (${totalQuantity} Pot @ ${formatRupiah(
        PRODUCT_INFO.price
      )}) = ${formatRupiah(totalAmount)}`;

  const orderNumber = generateOrderNumber();
  const channel = data.channel ?? "WHATSAPP";

  const sellerPhone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PRODUCT_INFO.defaultWhatsApp;

  const whatsAppUrl = createWhatsAppOrderLink({
    sellerPhone,
    orderNumber,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    address: data.shippingAddress,
    cityOrDistrict: data.cityOrDistrict,
    quantity: totalQuantity,
    itemsText,
    totalAmount,
    notes: data.notes,
  });

  // Coba simpan ke PostgreSQL via Prisma
  try {
    // Pastikan produk ada di DB (atau buat jika belum ada)
    let product = await prisma.product.findUnique({
      where: { slug: "glam-and-glow-lulur-badda-lotong" },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: PRODUCT_INFO.name,
          slug: "glam-and-glow-lulur-badda-lotong",
          tagline: PRODUCT_INFO.tagline,
          description: PRODUCT_INFO.description,
          price: PRODUCT_INFO.price,
          weightGram: PRODUCT_INFO.weightGram,
          stock: 150,
          isFeatured: true,
        },
      });
    }

    // Buat Order di Database
    await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        shippingAddress: data.shippingAddress,
        cityOrDistrict: data.cityOrDistrict || null,
        notes: data.notes || null,
        totalAmount,
        status: "PENDING",
        channel,
        items: {
          create: [
            {
              productId: product.id,
              quantity: totalQuantity,
              unitPrice: Math.round(totalAmount / totalQuantity),
              subtotal: totalAmount,
            },
          ],
        },
      },
    });

    return {
      success: true,
      orderNumber,
      totalAmount,
      whatsAppUrl,
      message: "Pesanan berhasil dicatat di sistem dan diteruskan ke WhatsApp.",
    };
  } catch (error) {
    console.warn("Info Database: Order tetap dilanjutkan ke WhatsApp meskipun koneksi DB lokal belum aktif:", error);
    // Fallback: Pelanggan tetap mendapatkan link WhatsApp resmi dan kode pesanan
    return {
      success: true,
      orderNumber,
      totalAmount,
      whatsAppUrl,
      message: "Kode pesanan Anda siap dikirimkan ke WhatsApp penjual.",
    };
  }
}

export async function getOrdersAction() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });
    return { success: true, orders };
  } catch (error) {
    console.error("Gagal mengambil daftar pesanan dari DB:", error);
    return { success: false, orders: [] };
  }
}

