import { NextRequest, NextResponse } from "next/server";
import { canConnectToDatabase, prisma } from "@/lib/prisma";
import {
  hashPassword,
  issueAdminSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
} from "@/lib/admin-auth";

/**
 * Registers the very first admin account directly in PostgreSQL when `AdminUser` is empty.
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await canConnectToDatabase())) {
      return NextResponse.json(
        {
          ok: false,
          error: "Database belum terhubung. Atur DATABASE_URL terlebih dahulu.",
        },
        { status: 503 }
      );
    }

    const existingCount = await prisma.adminUser.count();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Akun admin sudah terdaftar. Silakan login seperti biasa.",
        },
        { status: 403 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      username?: string;
      displayName?: string;
      password?: string;
    };

    const username = String(body.username ?? "").trim();
    const displayName =
      String(body.displayName ?? "").trim() || "Admin Glam & Glow";
    const password = String(body.password ?? "");

    if (username.length < 3) {
      return NextResponse.json(
        { ok: false, error: "Username minimal 3 karakter." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const created = await prisma.adminUser.create({
      data: {
        username,
        displayName,
        passwordHash: hashPassword(password),
        role: "SUPERADMIN",
      },
    });

    const token = issueAdminSessionToken({
      username: created.username,
      displayName: created.displayName,
      role: created.role,
    });

    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttps =
      forwardedProto?.split(",")[0].trim().toLowerCase() === "https" ||
      request.nextUrl.protocol === "https:";

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge: Math.floor(SESSION_DURATION_MS / 1000),
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gagal menyimpan akun admin pertama ke database." },
      { status: 500 }
    );
  }
}

