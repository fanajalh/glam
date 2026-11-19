import net from "node:net";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    undefined
  );
}

/** Mengembalikan true jika connection string PostgreSQL tersedia di environment. */
export function isDatabaseConfigured(): boolean {
  const url = resolveDatabaseUrl();
  return Boolean(url && url.trim().length > 0);
}

/**
 * Mengecek cepat apakah database lokal siap dihubungi (menghindari timeout ~4 detik
 * Prisma saat Postgres localhost mati). Untuk host remote (seperti Neon), langsung true.
 */
export async function canConnectToDatabase(): Promise<boolean> {
  const url = resolveDatabaseUrl();
  if (!url || !url.trim()) return false;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const isLocalHost =
      host === "localhost" || host === "127.0.0.1" || host === "::1";
    if (!isLocalHost) return true;

    const port = Number(parsed.port) || 5432;
    return await new Promise<boolean>((resolve) => {
      const socket = net.createConnection({ host: "127.0.0.1", port });
      const timer = setTimeout(() => {
        socket.destroy();
        resolve(false);
      }, 300);

      socket.once("connect", () => {
        clearTimeout(timer);
        socket.end();
        resolve(true);
      });
      socket.once("error", () => {
        clearTimeout(timer);
        socket.destroy();
        resolve(false);
      });
    });
  } catch {
    return false;
  }
}

const resolvedUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(resolvedUrl ? { datasources: { db: { url: resolvedUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
