"use server";

import { revalidatePath } from "next/cache";
import { canConnectToDatabase, prisma } from "@/lib/prisma";
import {
  saveLocalFallbackOrder,
  updateLocalFallbackOrderPayment,
} from "@/lib/local-order-fallback";
import {
  generateOrderNumber,
  createWhatsAppOrderLink,
  formatRupiah,
} from "@/lib/utils";
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
  shippingMethod?: string;
  paymentMethod?: string;
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
  createdAt: string;
  message?: string;
}

const CART_ID_TO_SLUG: Record<string, string> = {
  "prod-main": "glam-and-glow-lulur-badda-lotong",
  "bundle-2": "paket-glowing-2-pot",
  "bundle-3": "paket-keluarga-3-pot",
};

export async function createOrderAction(
  data: CreateOrderInput
): Promise<CreateOrderResult> {
  const hasCustomItems = Boolean(data.items && data.items.length > 0);
  const totalAmount = hasCustomItems
    ? data.items!.reduce((acc, it) => acc + it.price * it.quantity, 0)
    : Math.max(1, Number(data.quantity) || 1) * PRODUCT_INFO.price;

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
  const channel = data.channel ?? "DIRECT_WEB";
  const createdAt = new Date().toISOString();

  const sellerPhone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PRODUCT_INFO.defaultWhatsApp;

  const whatsAppUrl = createWhatsAppOrderLink({
    sellerPhone,
    orderNumber,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    address: data.shippingAddress,
    cityOrDistrict: data.cityOrDistrict,
    shippingMethod: data.shippingMethod,
    paymentMethod: data.paymentMethod,
    quantity: totalQuantity,
    itemsText,
    totalAmount,
    notes: data.notes,
  });

  const combinedNotes = [
    data.shippingMethod ? `Kurir: ${data.shippingMethod}` : null,
    data.paymentMethod ? `Pembayaran: ${data.paymentMethod}` : null,
    data.notes ? `Catatan: ${data.notes}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  if (await canConnectToDatabase()) {
    try {
      let dbProducts = await prisma.product.findMany();

      if (dbProducts.length === 0) {
        const createdDefault = await prisma.product.create({
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
        dbProducts = [createdDefault];
      }

      const fallbackProduct =
        dbProducts.find((p) => p.slug === "glam-and-glow-lulur-badda-lotong") ??
        dbProducts[0];

      const resolvedItems = hasCustomItems
        ? data.items!.map((it) => {
            const mappedSlug = it.id ? CART_ID_TO_SLUG[it.id] : undefined;
            const matched =
              dbProducts.find((p) => p.id === it.id || p.slug === it.id) ||
              (mappedSlug
                ? dbProducts.find((p) => p.slug === mappedSlug)
                : undefined) ||
              dbProducts.find(
                (p) => p.name.toLowerCase() === it.name.trim().toLowerCase()
              ) ||
              fallbackProduct;

            const qty = Math.max(1, Math.round(Number(it.quantity) || 1));
            const unitPrice = Math.max(
              0,
              Math.round(Number(it.price) || matched.price)
            );
            return {
              productId: matched.id,
              quantity: qty,
              unitPrice,
              subtotal: qty * unitPrice,
            };
          })
        : [
            {
              productId: fallbackProduct.id,
              quantity: totalQuantity,
              unitPrice: Math.round(totalAmount / totalQuantity),
              subtotal: totalAmount,
            },
          ];

      await prisma.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          shippingAddress: data.shippingAddress,
          cityOrDistrict: data.cityOrDistrict || null,
          notes: combinedNotes || null,
          totalAmount,
          status: "PENDING",
          channel,
          items: {
            create: resolvedItems,
          },
        },
      });

      revalidatePath("/admin");
      revalidatePath("/admin/pesanan");

      return {
        success: true,
        orderNumber,
        totalAmount,
        whatsAppUrl,
        createdAt,
        message: "Pesanan berhasil dicatat dan struk resmi diterbitkan.",
      };
    } catch (error) {
      console.warn(
        "Info Database: Struk tetap diterbitkan meski DB belum tersimpan:",
        error
      );
    }
  }

  saveLocalFallbackOrder({
    id: `local-${orderNumber}`,
    orderNumber,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail || null,
    shippingAddress: data.shippingAddress,
    cityOrDistrict: data.cityOrDistrict || null,
    notes: combinedNotes || null,
    totalAmount,
    status: "PENDING",
    channel,
    createdAt,
    items: (hasCustomItems
      ? data.items!
      : [
          {
            name: PRODUCT_INFO.name,
            quantity: totalQuantity,
            price: PRODUCT_INFO.price,
          },
        ]
    ).map((it, idx) => ({
      id: `local-item-${idx}`,
      quantity: Math.max(1, Math.round(Number(it.quantity) || 1)),
      unitPrice: Math.max(0, Math.round(Number(it.price) || PRODUCT_INFO.price)),
      subtotal:
        Math.max(1, Math.round(Number(it.quantity) || 1)) *
        Math.max(0, Math.round(Number(it.price) || PRODUCT_INFO.price)),
      productName: it.name,
    })),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/pesanan");

  return {
    success: true,
    orderNumber,
    totalAmount,
    whatsAppUrl,
    createdAt,
    message: "Pesanan siap untuk dilanjutkan ke halaman pembayaran.",
  };
}

export interface ConfirmPaymentInput {
  orderNumber: string;
  paymentMethod: string;
  paymentReference?: string;
}

export interface ConfirmPaymentResult {
  success: boolean;
  status: string;
  whatsAppUrl?: string;
}

/**
 * Confirms buyer payment choice or transfer reference prior to opening the official receipt.
 */
export async function confirmOrderPaymentAction(
  input: ConfirmPaymentInput
): Promise<ConfirmPaymentResult> {
  const cleanOrderNumber = input.orderNumber.trim();
  const cleanMethod = input.paymentMethod.trim();
  const cleanRef = input.paymentReference?.trim() || "";
  const isCod = cleanMethod.toUpperCase().includes("COD");
  const nextStatus = isCod ? "CONFIRMED" : "CONFIRMED";

  if (cleanOrderNumber && (await canConnectToDatabase())) {
    try {
      const existing = await prisma.order.findUnique({
        where: { orderNumber: cleanOrderNumber },
        include: {
          items: { include: { product: { select: { name: true } } } },
        },
      });

      if (existing) {
        const existingSegments = (existing.notes || "")
          .split("|")
          .map((s) => s.trim())
          .filter(
            (s) =>
              s &&
              !s.startsWith("Pembayaran:") &&
              !s.startsWith("Ref Pembayaran:")
          );

        const updatedSegments = [
          ...existingSegments,
          `Pembayaran: ${cleanMethod}`,
          cleanRef ? `Ref Pembayaran: ${cleanRef}` : null,
        ].filter(Boolean);

        await prisma.order.update({
          where: { id: existing.id },
          data: {
            notes: updatedSegments.join(" | "),
            status: nextStatus,
          },
        });

        const sellerPhone =
          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
          PRODUCT_INFO.defaultWhatsApp;
        const itemsText = existing.items
          .map(
            (it) =>
              `• ${it.product?.name ?? PRODUCT_INFO.name} (${it.quantity}x @ ${formatRupiah(
                it.unitPrice
              )}) = ${formatRupiah(it.subtotal)}`
          )
          .join("\n");

        const shippingSegment = existingSegments.find((s) =>
          s.startsWith("Kurir:")
        );
        const noteSegment = existingSegments.find((s) =>
          s.startsWith("Catatan:")
        );

        const whatsAppUrl = createWhatsAppOrderLink({
          sellerPhone,
          orderNumber: existing.orderNumber,
          customerName: existing.customerName,
          customerPhone: existing.customerPhone,
          address: existing.shippingAddress,
          cityOrDistrict: existing.cityOrDistrict ?? undefined,
          shippingMethod: shippingSegment?.replace(/^Kurir:\s*/, ""),
          paymentMethod: cleanMethod,
          itemsText,
          totalAmount: existing.totalAmount,
          notes:
            [
              noteSegment?.replace(/^Catatan:\s*/, ""),
              cleanRef ? `Ref Pembayaran: ${cleanRef}` : null,
            ]
              .filter(Boolean)
              .join(" | ") || undefined,
        });

        revalidatePath("/admin");
        revalidatePath("/admin/pesanan");
        revalidatePath(`/struk/${encodeURIComponent(cleanOrderNumber)}`);

        return {
          success: true,
          status: nextStatus,
          whatsAppUrl,
        };
      }
    } catch (error) {
      console.warn(
        "Info Database: Konfirmasi pembayaran tetap dilanjutkan ke struk:",
        error
      );
    }
  }

  const updatedLocal = updateLocalFallbackOrderPayment(
    cleanOrderNumber,
    cleanMethod,
    cleanRef,
    nextStatus
  );

  revalidatePath("/admin");
  revalidatePath("/admin/pesanan");
  revalidatePath(`/struk/${encodeURIComponent(cleanOrderNumber)}`);

  if (updatedLocal) {
    const sellerPhone =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PRODUCT_INFO.defaultWhatsApp;
    const itemsText = updatedLocal.items
      .map(
        (it) =>
          `• ${it.productName} (${it.quantity}x @ ${formatRupiah(
            it.unitPrice
          )}) = ${formatRupiah(it.subtotal)}`
      )
      .join("\n");

    const whatsAppUrl = createWhatsAppOrderLink({
      sellerPhone,
      orderNumber: updatedLocal.orderNumber,
      customerName: updatedLocal.customerName,
      customerPhone: updatedLocal.customerPhone,
      address: updatedLocal.shippingAddress,
      cityOrDistrict: updatedLocal.cityOrDistrict ?? undefined,
      paymentMethod: cleanMethod,
      itemsText,
      totalAmount: updatedLocal.totalAmount,
      notes: cleanRef ? `Ref Pembayaran: ${cleanRef}` : undefined,
    });

    return {
      success: true,
      status: nextStatus,
      whatsAppUrl,
    };
  }

  return {
    success: true,
    status: nextStatus,
  };
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
