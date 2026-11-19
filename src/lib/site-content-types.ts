import {
  BANK_ACCOUNTS,
  BENEFITS,
  BENEFITS_DISCLAIMER,
  CAUTIONS,
  EWALLET_ACCOUNTS,
  INGREDIENTS,
  PRODUCT_INFO,
  USAGE_STEPS,
} from "@/lib/constants";

export interface BankAccountItem {
  id: string;
  bank: string;
  accountNumber: string;
  holderName: string;
}

export interface EwalletAccountItem {
  id: string;
  provider: string;
  phoneNumber: string;
  holderName: string;
}

export interface SiteContentConfig {
  general: {
    brandName: string;
    whatsappNumber: string;
    instagramHandle: string;
    instagramUrl: string;
    email: string;
    locationName: string;
    locationCity: string;
    footerNote: string;
    benefitsDisclaimer: string;
  };
  payment: {
    adminFee: number;
    serviceFee: number;
    codFee: number;
    shippingFeeStand: number;
    shippingFeeLocal: number;
    shippingFeeRegular: number;
    bankAccounts: BankAccountItem[];
    ewalletAccounts: EwalletAccountItem[];
  };
  home: {
    heroLine1: string;
    heroLine2: string;
    heroSubtitle: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    missionStatement: string;
    missionSubnote: string;
    missionLinkText: string;
    promisesHeading: string;
    promisesCtaText: string;
    promises: Array<{ title: string; desc: string }>;
    statementRow1Left: string;
    statementRow1Right: string;
    statementRow2Left: string;
    statementRow2Right: string;
    deckTitle: string;
    deckSubtitle: string;
    testimonialsTitle: string;
    testimonials: Array<{ title: string; quote: string; author: string }>;
    fundTitleLine1: string;
    fundTitleLine2: string;
    fundSubtitle: string;
    fundCtaText: string;
  };
  tentangKami: {
    heroLine1: string;
    heroLine2: string;
    heroSubtitle: string;
    originBadge: string;
    originTitle: string;
    originPara1: string;
    originPara2: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    standardsEyebrow: string;
    standardsTitle: string;
    standardsQuote: string;
    values: Array<{ title: string; desc: string }>;
    makersEyebrow: string;
    makersTitle: string;
    makersCtaText: string;
    gallery: Array<{ name: string; role: string }>;
  };
  produk: {
    heroLine1: string;
    heroLine2: string;
    heroSubtitle: string;
    trustBadges: string[];
    productName: string;
    productTagline: string;
    productPrice: number;
    productWeightText: string;
    productDescription: string;
    compositionEyebrow: string;
    compositionTitle: string;
    compositionNote: string;
    benefitsSectionTitle: string;
    ingredients: Array<{ name: string; role: string; description: string }>;
    benefits: Array<{ title: string; description: string; highlight: string }>;
  };
  panduan: {
    heroLine1: string;
    heroLine2: string;
    heroSubtitle: string;
    stepsEyebrow: string;
    stepsTitle: string;
    stepsSubtitle: string;
    steps: Array<{ title: string; desc: string; badge: string }>;
    benefitsEyebrow: string;
    benefitsTitle: string;
    storageTitle: string;
    storageDesc: string;
    storageTips: string[];
    cautionsTitle: string;
    cautions: string[];
  };
  pesan: {
    heroBadge: string;
    heroLine1: string;
    heroLine2: string;
    heroSubtitle: string;
    socialEyebrow: string;
    socialTitle: string;
    socialDesc: string;
    newsletterBadge: string;
    newsletterTitle: string;
    newsletterDesc: string;
    pembelianTitle: string;
    pembelianSubtitle: string;
  };
}

export type SiteSectionKey = keyof SiteContentConfig;

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  general: {
    brandName: "GLAM & GLOW",
    whatsappNumber: PRODUCT_INFO.defaultWhatsApp,
    instagramHandle: PRODUCT_INFO.instagram,
    instagramUrl: PRODUCT_INFO.instagramUrl,
    email: PRODUCT_INFO.email,
    locationName: "4 Saudara Kuki Sukses",
    locationCity: "Makassar, Sulawesi Selatan",
    footerNote: "Layanan Pelanggan & Pemesanan Resmi",
    benefitsDisclaimer: BENEFITS_DISCLAIMER,
  },
  payment: {
    adminFee: 2000,
    serviceFee: 2000,
    codFee: 5000,
    shippingFeeStand: 0,
    shippingFeeLocal: 10000,
    shippingFeeRegular: 15000,
    bankAccounts: BANK_ACCOUNTS.map((b) => ({ ...b })),
    ewalletAccounts: EWALLET_ACCOUNTS.map((w) => ({ ...w })),
  },
  home: {
    heroLine1: "Lembut di Kulit,",
    heroLine2: "Alami dari Rempah",
    heroSubtitle:
      "Lulur berbahan alami untuk membantu membersihkan permukaan kulit dan merawat kelembutan kulit secara praktis.",
    heroPrimaryCta: "Lihat Produk",
    heroSecondaryCta: "Pesan Lulur • Rp35.000",
    missionStatement:
      "Glam & Glow Lulur Badda Lotong dipadukan dari beras ketan putih, daun pandan, jeruk nipis, kunyit, dan cengkeh untuk membersihkan serta merawat kelembutan kulit.",
    missionSubnote:
      "Hanya untuk pemakaian luar. Konsep perawatan kulit tubuh yang sederhana dan praktis.",
    missionLinkText: "Lihat Produk",
    promisesHeading:
      "Empat komitmen di setiap pot. Transparansi 5 bahan alami, pengolahan bersih, pemakaian luar praktis, dan lembut merawat kulit tubuh.",
    promisesCtaText: "Pesan Sekarang",
    promises: [
      {
        title: "Komposisi Terbuka",
        desc: "Komposisi 5 bahan alami terbuka jelas: beras ketan putih, daun pandan, jeruk nipis, kunyit, dan cengkeh.",
      },
      {
        title: "5 Bahan Alami Pilihan",
        desc: "Racikan bahan alami pilihan dengan konsep perawatan kulit yang sederhana dan praktis.",
      },
      {
        title: "Kemasan Tertutup Rapi",
        desc: "Hanya untuk pemakaian luar. Dikemas tertutup dalam pot higienis berat bersih 400 gram.",
      },
      {
        title: "Perawatan Praktis",
        desc: "Membantu membersihkan permukaan kulit dan merawat kelembutan kulit.",
      },
    ],
    statementRow1Left: "Lulur Badda Lotong",
    statementRow1Right: "alami",
    statementRow2Left: "perawatan kulit",
    statementRow2Right: "sederhana & praktis",
    deckTitle: "Satu Formula Lengkap • 5 Bahan Alami",
    deckSubtitle:
      "Perpaduan bahan alami pilihan untuk membantu membersihkan permukaan kulit dan merawat kelembutannya.",
    testimonialsTitle: "Kesan Pengguna",
    testimonials: [
      {
        title: "Kulit Terasa Lebih Halus",
        quote:
          "“Penggosokan lembut butiran beras ketannya nyaman, kulit terasa lebih bersih dan halus setelah dibilas.”",
        author: "Amara K.",
      },
      {
        title: "Aroma Pandan & Rempah Alami",
        quote:
          "“Perpaduan aroma daun pandan, cengkeh, dan sedikit segar jeruk nipisnya pas, tidak menyengat.”",
        author: "Hannah L.",
      },
      {
        title: "Praktis Dicampur Air Bersih",
        quote:
          "“Tinggal ambil secukupnya dengan sendok kering dan campur air bersih, teksturnya langsung jadi pasta lembut.”",
        author: "Sofia R.",
      },
      {
        title: "Eksfoliasi Lembut di Kulit",
        quote:
          "“Membantu mengangkat sel kulit mati tanpa terasa kasar bila dioleskan perlahan sesuai panduan.”",
        author: "Dian P.",
      },
      {
        title: "Kemasan Pot 400g Praktis",
        quote:
          "“Pot tutup rapat menjaga serbuk lulur tetap kering di lemari penyimpanan dan isinya cukup banyak.”",
        author: "Nadira S.",
      },
      {
        title: "Pilihan Perawatan Tubuh",
        quote:
          "“Konsep perawatan kulit tubuh yang sederhana, alami, dan nyaman dipakai rutin di rumah.”",
        author: "Citra W.",
      },
    ],
    fundTitleLine1: "Program Petani",
    fundTitleLine2: "Rempah Lokal",
    fundSubtitle:
      "Sebagian keuntungan disalurkan langsung untuk petani rempah lokal Sulawesi Selatan.",
    fundCtaText: "Pesan Sekarang",
  },
  tentangKami: {
    heroLine1: "Lahir dari racikan",
    heroLine2: "sederhana & alami",
    heroSubtitle:
      "Mengangkat rahasia lulur hitam tradisional masyarakat Bugis ke dalam perawatan tubuh modern yang murni, jujur, dan menenangkan.",
    originBadge: "Tentang Produk • Tradisi Sulawesi Selatan",
    originTitle: "Sederhana, Alami & Berakar Tradisi Bugis",
    originPara1:
      "Glam & Glow Lulur Badda Lotong merupakan produk lulur berbahan alami yang dirancang untuk membantu membersihkan permukaan kulit dan merawat kelembutan kulit. Perpaduan bahan-bahannya menghadirkan konsep perawatan kulit yang sederhana dan praktis.",
    originPara2:
      "Dipelopori oleh @4saudarakukisuksesemua27 di Makassar, racikan ini memadukan 5 bahan alami pilihan: beras ketan putih, daun pandan, jeruk nipis, kunyit, dan cengkeh dalam kemasan pot 400 gram.",
    stat1Value: "5",
    stat1Label: "Komposisi Alami",
    stat2Value: "400g",
    stat2Label: "Berat Bersih / Pot",
    stat3Value: "35k",
    stat3Label: "Rp35.000 / Pot",
    standardsEyebrow: "Standar Kami",
    standardsTitle: "Empat prinsip yang selalu kami jaga",
    standardsQuote:
      "“Kecantikan sejati tidak membutuhkan bahan kimia keras; alam Nusantara telah menyediakan segala rempah terbaik untuk merawat kelembutan kulit Anda.”",
    values: [
      {
        title: "Keterbukaan Komposisi",
        desc: "Komposisi 5 bahan alami terbuka jelas tanpa klaim berlebihan.",
      },
      {
        title: "5 Bahan Alami Pilihan",
        desc: "Perpaduan beras ketan putih, daun pandan, jeruk nipis, kunyit, dan cengkeh.",
      },
      {
        title: "Kemasan Tertutup Rapi",
        desc: "Dikemas dalam pot tertutup berat bersih 400 gram yang praktis.",
      },
      {
        title: "Perawatan Praktis",
        desc: "Membantu membersihkan permukaan kulit dan merawat kelembutan kulit.",
      },
    ],
    makersEyebrow: "Tentang Produk",
    makersTitle: "Kualitas bahan alami terjaga",
    makersCtaText: "Pesan Lulur • Rp35.000",
    gallery: [
      {
        name: "Produk Asli Pot 400g",
        role: "Glam & Glow Lulur Badda Lotong",
      },
      {
        name: "Tekstur Alami Halus",
        role: "Racikan Beras Ketan & Rempah",
      },
      {
        name: "Kemasan & Penyajian",
        role: "Berat Bersih 400g • Rp35.000",
      },
    ],
  },
  produk: {
    heroLine1: "Glam & Glow",
    heroLine2: "Lulur Badda Lotong",
    heroSubtitle:
      "Satu racikan lulur berbahan alami dalam kemasan pot 400 gram untuk perawatan kulit tubuh yang sederhana dan praktis.",
    trustBadges: [
      "5 Bahan Alami Pilihan",
      "Khusus Pemakaian Luar",
      "Berat Bersih: 400 gram",
      "Rp35.000 / Pot",
    ],
    productName: PRODUCT_INFO.name,
    productTagline: PRODUCT_INFO.tagline,
    productPrice: PRODUCT_INFO.price,
    productWeightText: PRODUCT_INFO.weightText,
    productDescription: PRODUCT_INFO.description,
    compositionEyebrow: "Transparansi Bahan",
    compositionTitle: "Komposisi Lengkap (5 Bahan Alami)",
    compositionNote:
      "Hanya 1 varian produk resmi dalam kemasan pot 400 gram, dirancang agar praktis dan mudah digunakan.",
    benefitsSectionTitle: "Manfaat Utama",
    ingredients: INGREDIENTS.map((i) => ({
      name: i.name,
      role: i.role,
      description: i.description,
    })),
    benefits: BENEFITS.map((b) => ({
      title: b.title,
      description: b.description,
      highlight: b.highlight,
    })),
  },
  panduan: {
    heroLine1: "Cara Penggunaan",
    heroLine2: "& Perhatian",
    heroSubtitle:
      "Ikuti 4 langkah mudah penggunaan dan 5 poin perhatian agar perawatan kulit tubuh tetap aman, nyaman, dan praktis.",
    stepsEyebrow: "Panduan Praktis",
    stepsTitle: "Cara Penggunaan",
    stepsSubtitle: "Hanya 4 langkah sederhana menggunakan alat bersih dan air bersih.",
    steps: USAGE_STEPS.map((s) => ({
      title: s.title,
      desc: s.desc,
      badge: s.badge,
    })),
    benefitsEyebrow: "Tujuan Penggunaan Lulur",
    benefitsTitle: "Manfaat Utama",
    storageTitle: "Cara Menyimpan Produk",
    storageDesc:
      "Agar kualitas lulur berbahan alami tetap terjaga hingga habis dipakai, selalu gunakan alat yang bersih dan kering saat mengambil lulur.",
    storageTips: [
      "Simpan produk dalam wadah tertutup rapat di tempat kering.",
      "Hindari mencelupkan tangan atau sendok basah ke dalam pot lulur.",
      "Jangan menyimpan kembali sisa lulur yang sudah dicampur air.",
    ],
    cautionsTitle: "Perhatian",
    cautions: [...CAUTIONS],
  },
  pesan: {
    heroBadge: "Pemesanan & Konsultasi Langsung",
    heroLine1: "Kami siap",
    heroLine2: "membantu Anda",
    heroSubtitle:
      "Pesan langsung Lulur Badda Lotong Glam & Glow asli atau hubungi tim kami melalui Instagram, WhatsApp, dan email resmi.",
    socialEyebrow: "Tetap Terhubung",
    socialTitle: "Ikuti kami",
    socialDesc:
      "Keseharian produksi bahan alami kami, tips perawatan kulit tubuh yang praktis, dan informasi produk terbaru.",
    newsletterBadge: "Buletin Info • Glam & Glow",
    newsletterTitle: "Kabar terbaru produk kami, langsung ke email Anda.",
    newsletterDesc:
      "Dapatkan informasi batch terbaru Lulur Badda Lotong, panduan pemakaian praktis, dan kabar stok produk dari kami.",
    pembelianTitle: "Halaman Pembelian",
    pembelianSubtitle:
      "Isi formulir di bawah untuk melanjutkan ke halaman pembayaran. Struk resmi pesanan terbit setelah tahap pembayaran selesai.",
  },
};

export function mergeSiteContent(
  overrides: Partial<Record<SiteSectionKey, unknown>>
): SiteContentConfig {
  const result = structuredClone(DEFAULT_SITE_CONTENT);

  if (overrides.general && typeof overrides.general === "object") {
    Object.assign(result.general, overrides.general);
  }
  if (overrides.payment && typeof overrides.payment === "object") {
    const p = overrides.payment as Partial<SiteContentConfig["payment"]>;
    Object.assign(result.payment, p);
    if (Array.isArray(p.bankAccounts)) {
      result.payment.bankAccounts = p.bankAccounts;
    }
    if (Array.isArray(p.ewalletAccounts)) {
      result.payment.ewalletAccounts = p.ewalletAccounts;
    }
  }
  if (overrides.home && typeof overrides.home === "object") {
    const h = overrides.home as Partial<SiteContentConfig["home"]>;
    Object.assign(result.home, h);
    if (Array.isArray(h.promises)) result.home.promises = h.promises;
    if (Array.isArray(h.testimonials)) result.home.testimonials = h.testimonials;
  }
  if (overrides.tentangKami && typeof overrides.tentangKami === "object") {
    const t = overrides.tentangKami as Partial<SiteContentConfig["tentangKami"]>;
    Object.assign(result.tentangKami, t);
    if (Array.isArray(t.values)) result.tentangKami.values = t.values;
    if (Array.isArray(t.gallery)) result.tentangKami.gallery = t.gallery;
  }
  if (overrides.produk && typeof overrides.produk === "object") {
    const pr = overrides.produk as Partial<SiteContentConfig["produk"]>;
    Object.assign(result.produk, pr);
    if (Array.isArray(pr.trustBadges)) result.produk.trustBadges = pr.trustBadges;
    if (Array.isArray(pr.ingredients)) result.produk.ingredients = pr.ingredients;
    if (Array.isArray(pr.benefits)) result.produk.benefits = pr.benefits;
  }
  if (overrides.panduan && typeof overrides.panduan === "object") {
    const pa = overrides.panduan as Partial<SiteContentConfig["panduan"]>;
    Object.assign(result.panduan, pa);
    if (Array.isArray(pa.steps)) result.panduan.steps = pa.steps;
    if (Array.isArray(pa.storageTips)) result.panduan.storageTips = pa.storageTips;
    if (Array.isArray(pa.cautions)) result.panduan.cautions = pa.cautions;
  }
  if (overrides.pesan && typeof overrides.pesan === "object") {
    Object.assign(result.pesan, overrides.pesan);
  }

  return result;
}

