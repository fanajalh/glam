import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import { Prisma } from "@prisma/client";
import { canConnectToDatabase, prisma } from "@/lib/prisma";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type SiteContentConfig,
  type SiteSectionKey,
} from "@/lib/site-content-types";

const LOCAL_DIR = join(process.cwd(), ".local-cms");
const LOCAL_CONTENT_FILE = join(LOCAL_DIR, "site-content.json");

function readLocalOverrides(): Partial<Record<SiteSectionKey, unknown>> {
  try {
    if (!existsSync(LOCAL_CONTENT_FILE)) return {};
    const raw = readFileSync(LOCAL_CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalSection(key: SiteSectionKey, value: unknown): void {
  try {
    if (!existsSync(LOCAL_DIR)) {
      mkdirSync(LOCAL_DIR, { recursive: true });
    }
    const current = readLocalOverrides();
    current[key] = value;
    writeFileSync(LOCAL_CONTENT_FILE, JSON.stringify(current, null, 2), "utf8");
  } catch {
    // Abaikan pada filesystem read-only (mis. Vercel serverless)
  }
}

/**
 * Loads all editable site sections from PostgreSQL when connected,
 * falling back to local JSON overrides when running without a local DB.
 */
export async function getSiteContent(): Promise<SiteContentConfig> {
  noStore();

  if (await canConnectToDatabase()) {
    try {
      const rows = await prisma.siteSection.findMany();
      const overrides: Partial<Record<SiteSectionKey, unknown>> = {};
      for (const row of rows) {
        overrides[row.key as SiteSectionKey] = row.data;
      }
      return mergeSiteContent(overrides);
    } catch {
      // Fallback ke file lokal / default jika tabel belum dibuat
    }
  }

  const localOverrides = readLocalOverrides();
  return mergeSiteContent(localOverrides);
}

/**
 * Persists a single editable site section to PostgreSQL and local dev fallback.
 */
export async function saveSiteSection<K extends SiteSectionKey>(
  key: K,
  value: SiteContentConfig[K]
): Promise<{ ok: boolean; persistedTo: "database" | "local" | "none" }> {
  const sanitized = mergeSiteContent({ [key]: value })[key];

  if (await canConnectToDatabase()) {
    try {
      await prisma.siteSection.upsert({
        where: { key },
        update: { data: sanitized as unknown as Prisma.InputJsonValue },
        create: {
          key,
          data: sanitized as unknown as Prisma.InputJsonValue,
        },
      });
      writeLocalSection(key, sanitized);
      return { ok: true, persistedTo: "database" };
    } catch {
      // Lanjut ke fallback lokal bila tabel belum tersedia
    }
  }

  writeLocalSection(key, sanitized);
  return {
    ok: true,
    persistedTo: existsSync(LOCAL_CONTENT_FILE) ? "local" : "none",
  };
}

export { DEFAULT_SITE_CONTENT };

