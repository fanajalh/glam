import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdmin,
  issueAdminSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      username?: string;
      password?: string;
    };

    const result = await authenticateAdmin(
      String(body.username ?? ""),
      String(body.password ?? "")
    );

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 401 }
      );
    }

    const token = issueAdminSessionToken(result.user);
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
      { ok: false, error: "Terjadi kendala saat memverifikasi login." },
      { status: 500 }
    );
  }
}

