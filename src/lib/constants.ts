export const PRODUCT_INFO = {
  name: "Glam & Glow Lulur Badda Lotong",
  shortName: "Glam & Glow",
  tagline:
    "Lulur Berbahan Alami untuk Membersihkan Permukaan & Merawat Kelembutan Kulit",
  price: 35000,
  formattedPrice: "Rp35.000",
  weightGram: 400,
  weightText: "Berat bersih: 400 gram",
  packaging: "Pot 400 gram",
  instagram: "@4saudarakukisuksesemua27",
  instagramUrl: "https://instagram.com/4saudarakukisuksesemua27",
  email: "4Saudarakukisuksesemua27@gmail.com",
  defaultWhatsApp: "6281234567890",
  description:
    "Glam & Glow Lulur Badda Lotong merupakan produk lulur berbahan alami yang dirancang untuk membantu membersihkan permukaan kulit dan merawat kelembutan kulit. Perpaduan bahan-bahannya menghadirkan konsep perawatan kulit yang sederhana dan praktis.",
};

export const INGREDIENTS = [
  {
    id: "beras-ketan-putih",
    name: "Beras Ketan Putih",
    role: "Bahan Dasar & Tekstur",
    description:
      "Bahan dasar lulur yang membantu memberikan tekstur pada produk.",
    icon: "Wheat",
    image: "/images/ingredient-beras-ketan.jpg",
  },
  {
    id: "daun-pandan",
    name: "Daun Pandan",
    role: "Aroma Khas Alami",
    description:
      "Memberikan aroma khas pada racikan bahan alami.",
    icon: "Leaf",
    image: "/images/ingredient-pandan.jpg",
  },
  {
    id: "jeruk-nipis",
    name: "Jeruk Nipis",
    role: "Aroma Segar & Asam Alami",
    description:
      "Memberikan aroma segar dan karakter asam alami.",
    icon: "Sparkles",
    image: "/images/ingredient-jeruk-nipis.jpg",
  },
  {
    id: "kunyit",
    name: "Kunyit",
    role: "Warna Khas Lulur",
    description:
      "Memberikan warna khas pada racikan lulur.",
    icon: "Sun",
    image: "/images/ingredient-kunyit.jpg",
  },
  {
    id: "cengkeh",
    name: "Cengkeh",
    role: "Aroma Rempah",
    description:
      "Menambah aroma rempah pada produk.",
    icon: "Flame",
    image: "/images/ingredient-cengkeh.jpg",
  },
];

export const BENEFITS = [
  {
    title: "Membersihkan Permukaan Kulit",
    description: "Membantu membersihkan permukaan kulit.",
    highlight: "Bersih Merata",
  },
  {
    title: "Mengangkat Sel Kulit Mati",
    description:
      "Membantu mengangkat sel kulit mati melalui penggosokan lembut.",
    highlight: "Penggosokan Lembut",
  },
  {
    title: "Kulit Terasa Lebih Halus",
    description:
      "Membantu membuat kulit terasa lebih halus setelah digunakan.",
    highlight: "Halus & Lembut",
  },
  {
    title: "Perawatan Kulit Tubuh",
    description: "Menjadi pilihan untuk perawatan kulit tubuh.",
    highlight: "Praktis & Sederhana",
  },
];

export const BENEFITS_DISCLAIMER =
  "Catatan: manfaat di atas merupakan tujuan umum penggunaan lulur berbahan alami, bukan hasil pengujian khusus produk Glam & Glow. Hasil pemakaian dapat berbeda pada setiap orang tergantung kondisi kulit dan keteraturan penggunaan.";

export const USAGE_STEPS = [
  {
    step: 1,
    title: "Ambil Secukupnya",
    desc: "Ambil sedikit lulur menggunakan alat yang bersih dan kering.",
    badge: "Langkah 01",
    image: "/images/glam/jar-real-hand.jpg",
  },
  {
    step: 2,
    title: "Campur Air Bersih",
    desc: "Tambahkan air bersih secukupnya hingga membentuk pasta.",
    badge: "Langkah 02",
    image: "/images/glam/jar-powder-texture.jpg",
  },
  {
    step: 3,
    title: "Oleskan Perlahan",
    desc: "Oleskan pada kulit tubuh yang utuh secara perlahan, tanpa menggosok terlalu kuat.",
    badge: "Langkah 03",
    image: "/images/glam/jar-ingredients-wood.jpg",
  },
  {
    step: 4,
    title: "Bilas Hingga Bersih",
    desc: "Bilas hingga bersih setelah selesai digunakan.",
    badge: "Langkah 04",
    image: "/images/glam/jar-studio-pedestal.jpg",
  },
];

export const CAUTIONS = [
  "Hanya untuk pemakaian luar.",
  "Hindari area mata, luka, dan kulit yang sedang iritasi.",
  "Hentikan penggunaan jika muncul rasa perih, gatal, atau kemerahan.",
  "Jangan menyimpan kembali lulur yang sudah dicampur air.",
  "Simpan produk dalam wadah tertutup di tempat kering.",
];

export const PACKAGES = [
  {
    id: "single",
    title: "1 Pot Glam & Glow",
    subtitle: "Berat bersih: 400 gram",
    quantity: 1,
    weight: "400 gram",
    price: 35000,
    badge: "Reguler",
    isPopular: false,
    image: "/images/glam/jar-studio-pedestal.jpg",
  },
  {
    id: "duo",
    title: "Paket 2 Pot",
    subtitle: "Total berat bersih: 800 gram",
    quantity: 2,
    weight: "800 gram (2 Pot)",
    price: 70000,
    badge: "Paling Laris",
    isPopular: true,
    image: "/images/glam/jar-ingredients-wood.jpg",
  },
  {
    id: "trio",
    title: "Paket 3 Pot",
    subtitle: "Total berat bersih: 1.200 gram",
    quantity: 3,
    weight: "1.200 gram (3 Pot)",
    price: 105000,
    badge: "Hemat Keluarga",
    isPopular: false,
    image: "/images/glam/jar-batik-spices.jpg",
  },
];

export const SHIPPING_OPTIONS = [
  {
    value: "J&T Express (Reguler)",
    label: "J&T Express (Reguler)",
    description: "Estimasi 2-4 hari kerja seluruh Indonesia",
  },
  {
    value: "JNE Reguler / YES",
    label: "JNE Reguler / YES",
    description: "Tersedia pengiriman kilat & reguler",
  },
  {
    value: "SiCepat REG",
    label: "SiCepat REG",
    description: "Pengiriman hemat & cepat antarpulau",
  },
  {
    value: "Kurir Lokal Makassar (Same Day)",
    label: "Kurir Lokal Makassar (Same Day)",
    description: "Tiba di hari yang sama area Makassar",
  },
  {
    value: "Ambil di Stand PLB",
    label: "Ambil Langsung di Stand PLB",
    description: "Bebas ongkir • Pengambilan terjadwal",
  },
];

export const PAYMENT_OPTIONS = [
  {
    value: "Transfer Bank (BRI / BCA / Mandiri)",
    label: "Transfer Bank (BRI / BCA / Mandiri)",
    description: "Transfer manual sesuai nomor rekening tujuan pada halaman pembayaran",
  },
  {
    value: "E-Wallet (GoPay / DANA / OVO)",
    label: "E-Wallet (GoPay / DANA / OVO)",
    description: "Kirim ke nomor GoPay, DANA, atau OVO resmi tanpa scan QR",
  },
  {
    value: "COD / Bayar di Tempat (Area Makassar)",
    label: "COD / Bayar di Tempat (Area Makassar)",
    description: "Bayar tunai harga paket + biaya layanan COD saat diterima",
  },
];

export const BANK_ACCOUNTS = [
  {
    id: "BCA",
    bank: "Bank BCA",
    accountNumber: "1234567890",
    holderName: "Glam & Glow / 4 Saudara",
  },
  {
    id: "BRI",
    bank: "Bank BRI",
    accountNumber: "123401005678509",
    holderName: "Glam & Glow / 4 Saudara",
  },
  {
    id: "Mandiri",
    bank: "Bank Mandiri",
    accountNumber: "1520012345678",
    holderName: "Glam & Glow / 4 Saudara",
  },
];

export const EWALLET_ACCOUNTS = [
  {
    id: "GoPay",
    provider: "GoPay",
    phoneNumber: "0812-3456-7890",
    holderName: "Glam & Glow Official",
  },
  {
    id: "DANA",
    provider: "DANA",
    phoneNumber: "0812-3456-7890",
    holderName: "Glam & Glow Official",
  },
  {
    id: "OVO",
    provider: "OVO",
    phoneNumber: "0812-3456-7890",
    holderName: "Glam & Glow Official",
  },
];

export const ADMIN_FEE = 2000;
export const STANDARD_SERVICE_FEE = 2000;
export const COD_FEE = 5000;

export interface PaymentFeeRates {
  adminFee?: number;
  serviceFee?: number;
  codFee?: number;
  shippingFeeStand?: number;
  shippingFeeLocal?: number;
  shippingFeeRegular?: number;
}

export function getEstimatedPackageFee(
  shippingMethod?: string,
  rates?: PaymentFeeRates
): number {
  const m = (shippingMethod || "").toLowerCase();
  if (m.includes("stand")) return rates?.shippingFeeStand ?? 0;
  if (m.includes("makassar") || m.includes("same day")) {
    return rates?.shippingFeeLocal ?? 10000;
  }
  return rates?.shippingFeeRegular ?? 15000;
}

export interface OrderFeeBreakdown {
  isCod: boolean;
  productSubtotal: number;
  adminFee: number;
  serviceFee: number;
  serviceFeeLabel: string;
  packageFee: number;
  grandTotal: number;
}

/**
 * Computes consistent admin, service, and package fee totals across PaymentView and ReceiptView.
 */
export function calculateOrderTotals(
  productSubtotal: number,
  paymentMethod?: string,
  shippingMethod?: string,
  rates?: PaymentFeeRates
): OrderFeeBreakdown {
  const isCod = Boolean((paymentMethod || "").toUpperCase().includes("COD"));
  const adminFee = rates?.adminFee ?? ADMIN_FEE;
  const serviceFee = isCod
    ? rates?.codFee ?? COD_FEE
    : rates?.serviceFee ?? STANDARD_SERVICE_FEE;
  const serviceFeeLabel = isCod ? "Biaya Layanan COD" : "Biaya Layanan";
  const packageFee = getEstimatedPackageFee(shippingMethod, rates);

  return {
    isCod,
    productSubtotal,
    adminFee,
    serviceFee,
    serviceFeeLabel,
    packageFee,
    grandTotal: productSubtotal + adminFee + serviceFee + packageFee,
  };
}
