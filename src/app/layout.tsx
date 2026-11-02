import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { ScrollProgressBar } from "@/components/ui/Animations";
import { PRODUCT_INFO } from "@/lib/constants";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/common/CartDrawer";
import SearchModal from "@/components/common/SearchModal";
import SmoothScroll from "@/components/common/SmoothScroll";
import PageTransitionProvider from "@/components/common/PageTransition";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://glamandglow.id"),
  title: `${PRODUCT_INFO.name} • Lulur Rempah Tradisional Alami 400g`,
  description: PRODUCT_INFO.description,
  keywords: [
    "Lulur Badda Lotong",
    "Glam & Glow",
    "Lulur Tradisional Bugis",
    "Lulur Hitam Rempah",
    "Body Scrub Alami",
    "Beras Ketan Putih",
    "Mencerahkan Kulit Alami",
  ],
  openGraph: {
    title: `${PRODUCT_INFO.name} • Rp35.000 / 400g`,
    description: PRODUCT_INFO.description,
    url: "https://glamandglow.id",
    siteName: PRODUCT_INFO.name,
    images: [
      {
        url: "/images/product-hero.png",
        width: 1200,
        height: 630,
        alt: PRODUCT_INFO.name,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${manrope.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[#F1E6D8] text-[#261C18] font-sans">
        <SmoothScroll>
          <CartProvider>
            <PageTransitionProvider>
              <ScrollProgressBar />
              <Navbar />
              <main className="flex-grow">{children}</main>
              <CartDrawer />
              <SearchModal />
              <FloatingWhatsApp />
              <Footer />
            </PageTransitionProvider>
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

