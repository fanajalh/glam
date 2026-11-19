import { canConnectToDatabase, prisma } from "@/lib/prisma";
import { findLocalFallbackOrder } from "@/lib/local-order-fallback";
import { PRODUCT_INFO } from "@/lib/constants";
import { createWhatsAppOrderLink, formatRupiah } from "@/lib/utils";
import type { ReceiptPayload } from "@/components/order/ReceiptView";

/**
 * Extracts structured shipping, payment, and user note metadata from persisted order notes.
 */
function parseOrderNotes(rawNotes: string | null): {
  shippingMethod?: string;
  paymentMethod?: string;
  paymentReference?: string;
  cleanNotes: string | null;
} {
  if (!rawNotes) return { cleanNotes: null };

  let shippingMethod: string | undefined;
  let paymentMethod: string | undefined;
  let paymentReference: string | undefined;
  const leftover: string[] = [];

  for (const segment of rawNotes.split("|").map((s) => s.trim()).filter(Boolean)) {
    if (segment.startsWith("Kurir:")) {
      shippingMethod = segment.replace(/^Kurir:\s*/, "").trim();
    } else if (segment.startsWith("Pembayaran:")) {
      paymentMethod = segment.replace(/^Pembayaran:\s*/, "").trim();
    } else if (segment.startsWith("Ref Pembayaran:")) {
      paymentReference = segment.replace(/^Ref Pembayaran:\s*/, "").trim();
    } else if (segment.startsWith("Catatan:")) {
      leftover.push(segment.replace(/^Catatan:\s*/, "").trim());
    } else {
      leftover.push(segment);
    }
  }

  return {
    shippingMethod,
    paymentMethod,
    paymentReference,
    cleanNotes: leftover.length > 0 ? leftover.join(" | ") : null,
  };
}

/**
 * Loads an order by orderNumber from PostgreSQL and builds the client-safe ReceiptPayload.
 */
export async function getOrderReceiptPayload(
  orderCode: string
): Promise<ReceiptPayload | null> {
  if (!orderCode) {
    return null;
  }

  if (await canConnectToDatabase()) {
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber: orderCode },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      });

      if (order) {
        const mappedItems = order.items.map((it) => ({
          name: it.product?.name ?? PRODUCT_INFO.name,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          subtotal: it.subtotal,
        }));

        const itemsText = mappedItems
          .map(
            (it) =>
              `• ${it.name} (${it.quantity}x @ ${formatRupiah(
                it.unitPrice
              )}) = ${formatRupiah(it.subtotal)}`
          )
          .join("\n");

        const parsed = parseOrderNotes(order.notes);
        const sellerPhone =
          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
          PRODUCT_INFO.defaultWhatsApp;

        const whatsAppUrl = createWhatsAppOrderLink({
          sellerPhone,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          address: order.shippingAddress,
          cityOrDistrict: order.cityOrDistrict ?? undefined,
          shippingMethod: parsed.shippingMethod,
          paymentMethod: parsed.paymentMethod,
          itemsText,
          totalAmount: order.totalAmount,
          notes: parsed.cleanNotes ?? undefined,
        });

        return {
          orderNumber: order.orderNumber,
          createdAt: order.createdAt.toISOString(),
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          shippingAddress: order.shippingAddress,
          cityOrDistrict: order.cityOrDistrict,
          shippingMethod: parsed.shippingMethod,
          paymentMethod: parsed.paymentMethod,
          paymentReference: parsed.paymentReference,
          notes: parsed.cleanNotes,
          totalAmount: order.totalAmount,
          status: order.status,
          whatsAppUrl,
          items: mappedItems,
        };
      }
    } catch {
      // Lanjut cek fallback lokal
    }
  }

  const local = findLocalFallbackOrder(orderCode);
  if (!local) return null;

  const mappedItems = local.items.map((it) => ({
    name: it.productName,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    subtotal: it.subtotal,
  }));
  const parsed = parseOrderNotes(local.notes);
  const sellerPhone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PRODUCT_INFO.defaultWhatsApp;
  const itemsText = mappedItems
    .map(
      (it) =>
        `• ${it.name} (${it.quantity}x @ ${formatRupiah(
          it.unitPrice
        )}) = ${formatRupiah(it.subtotal)}`
    )
    .join("\n");

  return {
    orderNumber: local.orderNumber,
    createdAt: local.createdAt,
    customerName: local.customerName,
    customerPhone: local.customerPhone,
    customerEmail: local.customerEmail,
    shippingAddress: local.shippingAddress,
    cityOrDistrict: local.cityOrDistrict,
    shippingMethod: parsed.shippingMethod,
    paymentMethod: parsed.paymentMethod,
    paymentReference: parsed.paymentReference,
    notes: parsed.cleanNotes,
    totalAmount: local.totalAmount,
    status: local.status,
    whatsAppUrl: createWhatsAppOrderLink({
      sellerPhone,
      orderNumber: local.orderNumber,
      customerName: local.customerName,
      customerPhone: local.customerPhone,
      address: local.shippingAddress,
      cityOrDistrict: local.cityOrDistrict ?? undefined,
      shippingMethod: parsed.shippingMethod,
      paymentMethod: parsed.paymentMethod,
      itemsText,
      totalAmount: local.totalAmount,
      notes: parsed.cleanNotes ?? undefined,
    }),
    items: mappedItems,
  };
}

