import React from "react";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/admin-auth";
import { canConnectToDatabase } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Login Admin • Glam & Glow",
  description: "Masuk ke Panel Admin Glam & Glow Lulur Badda Lotong.",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  const dbReady = await canConnectToDatabase();

  return (
    <AdminLoginForm
      isDbConfigured={dbReady}
      isDevMode={process.env.NODE_ENV === "development"}
    />
  );
}
