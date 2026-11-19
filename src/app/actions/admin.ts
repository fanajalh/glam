"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { BatchStatus, OrderStatus } from "@prisma/client";
import { canConnectToDatabase, prisma } from "@/lib/prisma";
import {
  deleteLocalFallbackOrder,
  updateLocalFallbackOrderStatus,
} from "@/lib/local-order-fallback";
import { DEFAULT_SITE_CONTENT, saveSiteSection } from "@/lib/site-content";
import type { SiteContentConfig, SiteSectionKey } from "@/lib/site-content-types";
import {
  authenticateAdmin,
  clearAdminSessionCookie,
  hashPassword,
  requireAdminSession,
  setAdminSessionCookie,
  verifyPassword,
} from "@/lib/admin-auth";

export interface ActionResult<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
}

const VALID_ORDER_STATUSES: ReadonlyArray<OrderStatus> = [
  "PENDING",
  "CONFIRMED",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

const VALID_BATCH_STATUSES: ReadonlyArray<BatchStatus> = [
  "PASSED",
  "TESTING",
  "RECALLED",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getReadableErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    if (err.message === "UNAUTHORIZED") {
      return "Sesi admin berakhir. Silakan login kembali.";
    }
    if (err.message.includes("Unique constraint")) {
      return "Data dengan kode atau slug tersebut sudah ada.";
    }
    if (err.message.includes("Can't reach database server")) {
      return "Database PostgreSQL/Neon belum terhubung. Atur DATABASE_URL di Vercel terlebih dahulu.";
    }
  }
  return fallback;
}

export async function loginAdminAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await authenticateAdmin(username, password);
  if (!result.ok) {
    return { error: result.error };
  }

  setAdminSessionCookie(result.user);
  redirect("/admin");
}

export async function logoutAdminAction(): Promise<void> {
  clearAdminSessionCookie();
  redirect("/admin/login");
}

export async function updateAdminCredentialsAction(input: {
  newUsername: string;
  newDisplayName: string;
  currentPassword: string;
  newPassword?: string;
}): Promise<ActionResult> {
  try {
    const session = await requireAdminSession();
    const newUsername = (input.newUsername || "").trim();
    const newDisplayName =
      (input.newDisplayName || "").trim() || session.displayName;
    const currentPassword = input.currentPassword || "";
    const newPassword = (input.newPassword || "").trim();

    if (newUsername.length < 3) {
      return {
        ok: false,
        message: "Username admin minimal 3 karakter.",
      };
    }
    if (newPassword && newPassword.length < 6) {
      return {
        ok: false,
        message: "Password baru minimal 6 karakter (atau kosongkan jika tidak diubah).",
      };
    }

    if (!(await canConnectToDatabase())) {
      return {
        ok: false,
        message:
          "Database PostgreSQL/Neon belum terhubung. Hubungkan Neon terlebih dahulu untuk menyimpan perubahan akun ke database.",
      };
    }

    const existing = await prisma.adminUser.findUnique({
      where: { username: session.username },
    });

    if (existing) {
      if (!verifyPassword(currentPassword, existing.passwordHash)) {
        return { ok: false, message: "Sandi saat ini tidak sesuai." };
      }

      if (newUsername !== existing.username) {
        const conflict = await prisma.adminUser.findUnique({
          where: { username: newUsername },
          select: { id: true },
        });
        if (conflict) {
          return {
            ok: false,
            message: `Username "${newUsername}" sudah digunakan.`,
          };
        }
      }

      const updated = await prisma.adminUser.update({
        where: { id: existing.id },
        data: {
          username: newUsername,
          displayName: newDisplayName,
          ...(newPassword ? { passwordHash: hashPassword(newPassword) } : {}),
        },
      });

      setAdminSessionCookie({
        username: updated.username,
        displayName: updated.displayName,
        role: updated.role,
      });
    } else {
      const envPass = process.env.ADMIN_PASSWORD;
      if (!envPass || currentPassword !== envPass) {
        return {
          ok: false,
          message:
            "Akun admin belum terdaftar di database. Buat akun pertama melalui /admin/login.",
        };
      }
      const created = await prisma.adminUser.create({
        data: {
          username: newUsername,
          passwordHash: hashPassword(newPassword || currentPassword),
          displayName: newDisplayName,
          role: session.role,
        },
      });

      setAdminSessionCookie({
        username: created.username,
        displayName: created.displayName,
        role: created.role,
      });
    }

    revalidatePath("/admin");
    return {
      ok: true,
      message: "Username dan sandi admin berhasil diperbarui ke database.",
    };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(
        err,
        "Gagal memperbarui akun admin di database."
      ),
    };
  }
}

export async function changeAdminPasswordAction(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  return updateAdminCredentialsAction({
    newUsername: (await requireAdminSession()).username,
    newDisplayName: (await requireAdminSession()).displayName,
    currentPassword: input.currentPassword,
    newPassword: input.newPassword,
  });
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    if (!orderId || !VALID_ORDER_STATUSES.includes(status)) {
      return { ok: false, message: "Data status pesanan tidak valid." };
    }

    if (await canConnectToDatabase()) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
    } else if (!updateLocalFallbackOrderStatus(orderId, status)) {
      return {
        ok: false,
        message: "Pesanan contoh statis tidak bisa diubah sebelum ada transaksi lokal atau DB tersambung.",
      };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/pesanan");
    return { ok: true, message: "Status pesanan diperbarui." };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(err, "Gagal memperbarui status pesanan."),
    };
  }
}

export async function deleteOrderAction(orderId: string): Promise<ActionResult> {
  try {
    await requireAdminSession();
    if (!orderId) {
      return { ok: false, message: "ID pesanan tidak valid." };
    }

    if (await canConnectToDatabase()) {
      await prisma.order.delete({ where: { id: orderId } });
    } else if (!deleteLocalFallbackOrder(orderId)) {
      return {
        ok: false,
        message: "Pesanan contoh statis tidak bisa dihapus sebelum DB tersambung.",
      };
    }
    revalidatePath("/admin");
    revalidatePath("/admin/pesanan");
    return { ok: true, message: "Pesanan berhasil dihapus." };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(err, "Gagal menghapus pesanan."),
    };
  }
}

export interface UpsertProductInput {
  id?: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  weightGram: number;
  stock: number;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export async function upsertProductAction(
  input: UpsertProductInput
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const name = input.name.trim();
    const category = input.category.trim() || "Signature Lulur";
    const tagline = input.tagline.trim() || "Formula Rempah Tradisional Bugis";
    const description = input.description.trim();
    const price = Math.round(Number(input.price));
    const weightGram = Math.round(Number(input.weightGram));
    const stock = Math.max(0, Math.round(Number(input.stock)));
    const imageUrl = input.imageUrl?.trim() || "/images/glam/jar-studio-pedestal.jpg";

    if (!name || !description || Number.isNaN(price) || price < 0) {
      return { ok: false, message: "Nama, deskripsi, dan harga valid wajib diisi." };
    }
    if (Number.isNaN(weightGram) || weightGram <= 0) {
      return { ok: false, message: "Berat produk (gram) harus lebih dari 0." };
    }

    if (input.id) {
      await prisma.product.update({
        where: { id: input.id },
        data: {
          name,
          category,
          tagline,
          description,
          price,
          weightGram,
          stock,
          imageUrl,
          isFeatured: Boolean(input.isFeatured),
          isActive: Boolean(input.isActive),
        },
      });
    } else {
      let baseSlug = slugify(name) || `produk-${Date.now()}`;
      const existing = await prisma.product.findUnique({
        where: { slug: baseSlug },
        select: { id: true },
      });
      if (existing) {
        baseSlug = `${baseSlug}-${Date.now().toString(36)}`;
      }

      await prisma.product.create({
        data: {
          name,
          slug: baseSlug,
          category,
          tagline,
          description,
          price,
          weightGram,
          stock,
          imageUrl,
          isFeatured: Boolean(input.isFeatured),
          isActive: Boolean(input.isActive),
        },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/produk");
    return {
      ok: true,
      message: input.id ? "Produk berhasil diperbarui." : "Produk baru ditambahkan.",
    };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(err, "Gagal menyimpan produk."),
    };
  }
}

export async function deleteProductAction(
  productId: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();
    if (!productId) {
      return { ok: false, message: "ID produk tidak valid." };
    }

    const orderRefCount = await prisma.orderItem.count({
      where: { productId },
    });

    if (orderRefCount > 0) {
      await prisma.product.update({
        where: { id: productId },
        data: { isActive: false },
      });
      revalidatePath("/admin");
      revalidatePath("/produk");
      return {
        ok: true,
        message:
          "Produk dinonaktifkan agar riwayat pesanan tetap terjaga.",
      };
    }

    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin");
    revalidatePath("/produk");
    return { ok: true, message: "Produk berhasil dihapus." };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(err, "Gagal menghapus produk."),
    };
  }
}

export interface UpsertLabBatchInput {
  id?: string;
  batchCode: string;
  productId?: string | null;
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
  notes?: string;
}

export async function upsertLabBatchAction(
  input: UpsertLabBatchInput
): Promise<ActionResult> {
  try {
    await requireAdminSession();

    const batchCode = input.batchCode.trim().toUpperCase();
    const productName = input.productName.trim();
    const phLevel = input.phLevel.trim();
    const colorResult = input.colorResult.trim();
    const aromaResult = input.aromaResult.trim();
    const textureResult = input.textureResult.trim();
    const homogeneity = input.homogeneity.trim() || "Homogen";
    const irritationTest = input.irritationTest.trim() || "Negatif / Aman";
    const formulatorName = input.formulatorName.trim();
    const hedonicScore = Math.min(5, Math.max(1, Number(input.hedonicScore) || 4.7));
    const qcStatus = VALID_BATCH_STATUSES.includes(input.qcStatus)
      ? input.qcStatus
      : "PASSED";

    const productionDate = new Date(input.productionDate);
    const expiryDate = new Date(input.expiryDate);

    if (
      !batchCode ||
      !productName ||
      !phLevel ||
      !colorResult ||
      !aromaResult ||
      !textureResult ||
      !formulatorName ||
      Number.isNaN(productionDate.getTime()) ||
      Number.isNaN(expiryDate.getTime())
    ) {
      return {
        ok: false,
        message: "Lengkapi seluruh data parameter uji lab dan tanggal batch.",
      };
    }

    const payload = {
      batchCode,
      productId: input.productId || null,
      productName,
      productionDate,
      expiryDate,
      phLevel,
      colorResult,
      aromaResult,
      textureResult,
      homogeneity,
      irritationTest,
      hedonicScore,
      formulatorName,
      qcStatus,
      notes: input.notes?.trim() || null,
    };

    if (input.id) {
      await prisma.labBatch.update({
        where: { id: input.id },
        data: payload,
      });
    } else {
      await prisma.labBatch.create({
        data: payload,
      });
    }

    revalidatePath("/admin");
    revalidatePath(`/batch/${encodeURIComponent(batchCode)}`);
    return {
      ok: true,
      message: input.id
        ? `Data uji lab ${batchCode} diperbarui.`
        : `Batch uji lab ${batchCode} berhasil disimpan.`,
    };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(err, "Gagal menyimpan data uji lab."),
    };
  }
}

export async function deleteLabBatchAction(
  batchId: string
): Promise<ActionResult> {
  try {
    await requireAdminSession();
    if (!batchId) {
      return { ok: false, message: "ID batch tidak valid." };
    }

    await prisma.labBatch.delete({ where: { id: batchId } });
    revalidatePath("/admin");
    return { ok: true, message: "Data batch uji lab berhasil dihapus." };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(err, "Gagal menghapus batch uji lab."),
    };
  }
}

function revalidateAllPublicPages(): void {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/tentang-kami");
  revalidatePath("/produk");
  revalidatePath("/panduan");
  revalidatePath("/pesan");
  revalidatePath("/pembelian");
  revalidatePath("/admin");
}

export async function saveSiteSectionAction<K extends SiteSectionKey>(
  key: K,
  value: SiteContentConfig[K]
): Promise<ActionResult> {
  try {
    await requireAdminSession();
    const res = await saveSiteSection(key, value);
    revalidateAllPublicPages();
    return {
      ok: true,
      message:
        res.persistedTo === "database"
          ? "Konten halaman tersimpan ke database & langsung aktif."
          : "Konten halaman tersimpan di mode lokal & langsung aktif.",
    };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(err, "Gagal menyimpan konten halaman."),
    };
  }
}

export async function resetSiteSectionAction<K extends SiteSectionKey>(
  key: K
): Promise<ActionResult<SiteContentConfig[K]>> {
  try {
    await requireAdminSession();
    const fallbackValue = structuredClone(DEFAULT_SITE_CONTENT[key]);
    await saveSiteSection(key, fallbackValue);
    revalidateAllPublicPages();
    return {
      ok: true,
      message: "Konten bagian ini dikembalikan ke bawaan awal.",
      data: fallbackValue,
    };
  } catch (err) {
    return {
      ok: false,
      message: getReadableErrorMessage(err, "Gagal mereset konten halaman."),
    };
  }
}

