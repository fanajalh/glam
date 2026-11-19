import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

/** Hash password menggunakan scrypt dengan random salt 16-byte. */
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function main() {
  console.log("[seed-db] Memulai idempotent seed Glam & Glow...");

  const adminUsername = (process.env.ADMIN_USERNAME || "admin").trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  // 1. Seed akun Admin default (tidak menimpa password jika admin sudah ganti di panel)
  const admin = await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash: hashPassword(adminPassword),
      displayName: "Admin Glam & Glow",
      role: "SUPERADMIN",
    },
  });
  console.log(`[seed-db] Admin siap: ${admin.username}`);

  // 2. Seed 1 produk utama resmi
  const mainProduct = await prisma.product.upsert({
    where: { slug: "glam-and-glow-lulur-badda-lotong" },
    update: {},
    create: {
      name: "Glam & Glow Lulur Badda Lotong",
      slug: "glam-and-glow-lulur-badda-lotong",
      category: "Signature Lulur",
      tagline: "Berat bersih: 400 gram • 5 Bahan Alami",
      description:
        "Glam & Glow Lulur Badda Lotong merupakan produk lulur berbahan alami (beras ketan putih, daun pandan, jeruk nipis, kunyit, cengkeh) untuk membantu membersihkan permukaan kulit dan merawat kelembutan kulit.",
      price: 35000,
      weightGram: 400,
      stock: 150,
      imageUrl: "/images/glam/jar-studio-pedestal.jpg",
      isFeatured: true,
      isActive: true,
    },
  });
  const mainProductId = mainProduct.id;
  console.log(`[seed-db] Produk utama tersinkron: ${mainProduct.name}`);

  // 3. Seed data uji lab Teknologi Farmasi (PLB Lintas Bidang)
  const sampleBatches = [
    {
      batchCode: "GG-BL-2026-01",
      productId: mainProductId,
      productName: "Glam & Glow Lulur Badda Lotong (400g)",
      productionDate: new Date("2026-11-01T00:00:00.000Z"),
      expiryDate: new Date("2027-09-08T00:00:00.000Z"),
      phLevel: "5.7",
      colorResult: "Cokelat kehijauan-gelap merata khas racikan beras ketan dan kunyit",
      aromaResult: "Harum alami daun pandan, jeruk nipis segar, dan rempah cengkeh",
      textureResult: "Serbuk/pasta alami dengan butiran halus beras ketan putih",
      homogeneity: "Homogen, tercampur merata tanpa gumpalan kasar",
      irritationTest: "Negatif (Aman pada uji tempel kulit utuh 24 jam)",
      hedonicScore: 4.8,
      formulatorName: "Tim Teknologi Farmasi PLB",
      qcStatus: "PASSED",
      notes:
        "Simpan produk dalam wadah tertutup di tempat kering. Jangan menyimpan kembali lulur yang sudah dicampur air.",
    },
    {
      batchCode: "GG-BL-2026-02",
      productId: mainProductId,
      productName: "Glam & Glow Lulur Badda Lotong (400g)",
      productionDate: new Date("2026-11-12T00:00:00.000Z"),
      expiryDate: new Date("2027-09-08T00:00:00.000Z"),
      phLevel: "5.6",
      colorResult: "Cokelat keabuan-herbal homogen",
      aromaResult: "Aroma pandan dan cengkeh seimbang dengan kesegaran jeruk nipis",
      textureResult: "Butiran halus mudah membentuk pasta saat ditambah air bersih",
      homogeneity: "Homogen",
      irritationTest: "Negatif / Aman untuk pemakaian luar pada kulit utuh",
      hedonicScore: 4.9,
      formulatorName: "Tim Teknologi Farmasi PLB",
      qcStatus: "PASSED",
      notes:
        "Hanya untuk pemakaian luar. Hentikan pemakaian jika muncul rasa perih, gatal, atau kemerahan.",
    },
  ];

  for (const batch of sampleBatches) {
    await prisma.labBatch.upsert({
      where: { batchCode: batch.batchCode },
      update: {},
      create: batch,
    });
  }
  console.log(`[seed-db] ${sampleBatches.length} batch uji lab tersinkron.`);
}

main()
  .catch((error) => {
    console.error("[seed-db] Gagal melakukan seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
