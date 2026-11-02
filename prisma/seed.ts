import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses seeding database Glam & Glow...");

  const product = await prisma.product.upsert({
    where: { slug: "glam-and-glow-lulur-badda-lotong" },
    update: {
      name: "Glam & Glow Lulur Badda Lotong",
      price: 35000,
      weightGram: 400,
      stock: 200,
    },
    create: {
      name: "Glam & Glow Lulur Badda Lotong",
      slug: "glam-and-glow-lulur-badda-lotong",
      tagline: "Perawatan Alami Kulit Cantik, Bersih & Lembut Warisan Tradisi Bugis",
      description:
        "Glam & Glow Lulur Badda Lotong merupakan produk lulur berbahan alami yang dirancang untuk membantu membersihkan permukaan kulit dan merawat kelembutan kulit. Perpaduan beras ketan putih, cengkeh, pandan, kunyit, jeruk nipis, dan kopi menghadirkan konsep perawatan kulit yang sederhana dan praktis.",
      price: 35000,
      weightGram: 400,
      stock: 200,
      imageUrl: "/images/product-hero.png",
      isFeatured: true,
    },
  });

  console.log("Berhasil melakukan seed produk:", product.name);
}

main()
  .catch((e) => {
    console.error("Kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

