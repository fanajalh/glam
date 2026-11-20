import React from "react";
import { getOrderReceiptPayload } from "@/lib/order-receipt";
import PaymentView from "@/components/order/PaymentView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Halaman Pembayaran • Glam & Glow",
  description: "Pilih dan konfirmasi metode pembayaran pesanan Glam & Glow Lulur Badda Lotong.",
};

export default async function PembayaranPage({
  params,
}: {
  params: Promise<{ code: string }> | { code: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const orderCode = decodeURIComponent(resolvedParams.code || "").trim();
  const serverReceipt = await getOrderReceiptPayload(orderCode);

  return (
    <div className="w-full bg-[#FBF1F2] pt-28 pb-16 px-2 sm:px-3 min-h-[82vh]">
      <PaymentView orderCode={orderCode} serverReceipt={serverReceipt} />
    </div>
  );
}

