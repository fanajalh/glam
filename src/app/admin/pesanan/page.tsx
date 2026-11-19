import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminPesananRedirectPage() {
  redirect("/admin?tab=pesanan");
}
