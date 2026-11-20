import React from "react";
import { getOrderReceiptPayload } from "@/lib/order-receipt";
import ReceiptView from "@/components/order/ReceiptView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Struk Pembelian • Glam & Glow",
  description: "Struk resmi pesanan Glam & Glow Lulur Badda Lotong.",
};

export default async function StrukPage({
  params,
}: {
  params: Promise<{ code: string }> | { code: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const orderCode = decodeURIComponent(resolvedParams.code || "").trim();
  const serverReceipt = await getOrderReceiptPayload(orderCode);

  return (
    <div className="w-full bg-[#FBF1F2] pt-28 pb-16 px-3 sm:px-6 min-h-[82vh]">
      <ReceiptView orderCode={orderCode} serverReceipt={serverReceipt} />
    </div>
  );
}
