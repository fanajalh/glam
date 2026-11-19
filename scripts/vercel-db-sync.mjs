import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Memuat variabel .env lokal jika belum tersedia di process.env. */
function loadLocalEnvFallback() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

function isLocalDatabaseUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return urlString.includes("localhost") || urlString.includes("127.0.0.1");
  }
}

function runShellCommand(command, env) {
  return spawnSync(command, {
    stdio: "inherit",
    shell: true,
    env,
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  loadLocalEnvFallback();

  console.log("[vercel-db-sync] Menjalankan prisma generate...");
  const genResult = runShellCommand("npx prisma generate", process.env);
  if (genResult.status !== 0) {
    console.error("[vercel-db-sync] prisma generate gagal.");
    process.exit(genResult.status ?? 1);
  }

  const directUrl =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    "";

  const runtimeUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    directUrl;

  if (!directUrl) {
    console.log(
      "[vercel-db-sync] DATABASE_URL belum diatur — skip prisma db push & seed."
    );
    return;
  }

  const isLocal = isLocalDatabaseUrl(directUrl);
  const forceSync = process.env.FORCE_DB_SYNC === "true";
  const isVercel = process.env.VERCEL === "1";

  if (isLocal && !forceSync && !isVercel) {
    console.log(
      "[vercel-db-sync] Database lokal terdeteksi — skip auto db push saat build lokal (gunakan FORCE_DB_SYNC=true untuk sinkron manual)."
    );
    return;
  }

  console.log("[vercel-db-sync] Sinkronisasi skema Prisma ke Neon PostgreSQL...");
  const pushEnv = { ...process.env, DATABASE_URL: directUrl };
  let pushResult = runShellCommand(
    "npx prisma db push --skip-generate",
    pushEnv
  );

  // Retry 1x jika compute Neon baru bangun dari cold start / suspend
  if (pushResult.status !== 0) {
    console.warn(
      "[vercel-db-sync] Percobaan db push pertama gagal (kemungkinan Neon cold start), mencoba ulang dalam 3 detik..."
    );
    await sleep(3000);
    pushResult = runShellCommand("npx prisma db push --skip-generate", pushEnv);
  }

  if (pushResult.status !== 0) {
    console.error("[vercel-db-sync] prisma db push gagal setelah retry.");
    process.exit(pushResult.status ?? 1);
  }

  console.log("[vercel-db-sync] Menjalankan idempotent seed ke database...");
  const seedEnv = { ...process.env, DATABASE_URL: runtimeUrl };
  const seedResult = spawnSync(process.execPath, ["scripts/seed-db.mjs"], {
    stdio: "inherit",
    env: seedEnv,
  });

  if (seedResult.status !== 0) {
    console.error("[vercel-db-sync] seed-db gagal.");
    process.exit(seedResult.status ?? 1);
  }

  console.log("[vercel-db-sync] Database Neon siap dan tersinkronisasi!");
}

main().catch((err) => {
  console.error("[vercel-db-sync] Error tidak terduga:", err);
  process.exit(1);
});

