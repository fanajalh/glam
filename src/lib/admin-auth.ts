import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { canConnectToDatabase, prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "gg_admin_session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 hari

export interface AdminSessionPayload {
  username: string;
  displayName: string;
  role: string;
  exp: number;
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    "glam-glow-plb-local-dev-secret-change-in-prod"
  );
}

function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function isHttpsRequest(): boolean {
  try {
    const h = headers();
    const proto = h.get("x-forwarded-proto");
    if (proto) {
      return proto.split(",")[0].trim().toLowerCase() === "https";
    }
    const origin = h.get("origin") || h.get("referer");
    if (origin) {
      return origin.startsWith("https://");
    }
  } catch {
    // Abaikan jika dipanggil di luar konteks request
  }
  return false;
}

/** Hash password menggunakan scrypt dengan salt acak 16-byte. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

/** Verifikasi password secara constant-time terhadap hash scrypt tersimpan. */
export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;

  try {
    const derived = scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, "hex");
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Membuat token sesi bertanda tangan HMAC-SHA256. */
export function createSessionToken(payload: AdminSessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const sig = createHmac("sha256", getSessionSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${sig}`;
}

export function issueAdminSessionToken(
  user: Omit<AdminSessionPayload, "exp">
): string {
  return createSessionToken({
    ...user,
    exp: Date.now() + SESSION_DURATION_MS,
  });
}

/** Memverifikasi signature dan masa berlaku token sesi admin. */
export function verifySessionToken(token: string): AdminSessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, providedSig] = parts;
  if (!encoded || !providedSig) return null;

  const expectedSig = createHmac("sha256", getSessionSecret())
    .update(encoded)
    .digest("base64url");

  if (!safeEqualStrings(providedSig, expectedSig)) return null;

  try {
    const decoded = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as AdminSessionPayload;
    if (!decoded.username || typeof decoded.exp !== "number") return null;
    if (decoded.exp <= Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(
  user: Omit<AdminSessionPayload, "exp">
): void {
  const token = issueAdminSessionToken(user);

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttpsRequest(),
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

export function clearAdminSessionCookie(): void {
  cookies().set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttpsRequest(),
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Autentikasi kredensial admin terhadap tabel `AdminUser` di PostgreSQL.
 * Jika database belum terhubung atau tabel masih kosong, fallback ke kredensial env.
 */
export async function authenticateAdmin(
  usernameInput: string,
  passwordInput: string
): Promise<
  | { ok: true; user: Omit<AdminSessionPayload, "exp"> }
  | { ok: false; error: string }
> {
  const username = usernameInput.trim();
  if (!username || !passwordInput) {
    return { ok: false, error: "Username dan password wajib diisi." };
  }

  let shouldFallbackToEnv = !(await canConnectToDatabase());

  if (!shouldFallbackToEnv) {
    try {
      const dbAdmin = await prisma.adminUser.findUnique({
        where: { username },
      });

      if (dbAdmin) {
        if (verifyPassword(passwordInput, dbAdmin.passwordHash)) {
          return {
            ok: true,
            user: {
              username: dbAdmin.username,
              displayName: dbAdmin.displayName,
              role: dbAdmin.role,
            },
          };
        }
        return { ok: false, error: "Username atau password salah." };
      }

      const count = await prisma.adminUser.count();
      if (count > 0) {
        return { ok: false, error: "Username atau password salah." };
      }
      shouldFallbackToEnv = true;
    } catch {
      shouldFallbackToEnv = true;
    }
  }

  if (shouldFallbackToEnv) {
    const envUser = (process.env.ADMIN_USERNAME || "admin").trim();
    const envPass = process.env.ADMIN_PASSWORD || "admin123";
    if (
      safeEqualStrings(username, envUser) &&
      safeEqualStrings(passwordInput, envPass)
    ) {
      return {
        ok: true,
        user: {
          username: envUser,
          displayName: "Admin Glam & Glow",
          role: "SUPERADMIN",
        },
      };
    }
  }

  return { ok: false, error: "Username atau password salah." };
}
