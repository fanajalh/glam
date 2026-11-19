import React from "react";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/admin-auth";
import { canConnectToDatabase, prisma } from "@/lib/prisma";

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
  let needsInitialSetup = false;

  if (dbReady) {
    try {
      const adminCount = await prisma.adminUser.count();
      needsInitialSetup = adminCount === 0;
    } catch {
      needsInitialSetup = false;
    }
  }

  return (
    <AdminLoginForm
      isDbConfigured={dbReady}
      needsInitialSetup={needsInitialSetup}
    />
  );
}
