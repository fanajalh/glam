"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Flame, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Animations";
import { useCart } from "@/context/CartContext";
import { PRODUCT_INFO } from "@/lib/constants";
import { formatRupiah } from "@/lib/utils";

interface HotProductItem {
  id: string;
  tag: string;
  isHot?: boolean;
  title: string;
  subtitle: string;
  price: number;
  weightGram: number;
  image: string;
}

const HOT_PRODUCTS: HotProductItem[] = [
  {
    id: "prod-main",
    tag: "#1 Best Seller",
    isHot: true,
    title: PRODUCT_INFO.name,
    subtitle: "Pot 400g • Formula Utama 6 Rempah Alami Bugis",
    price: 35000,
    weightGram: 400,
    image: "/images/orveli/prod-3.png",
  },
  {
    id: "bundle-2",
    tag: "Paling Laris • Hemat 15%",
    isHot: true,
    title: "Paket Glowing • 2 Pot (800g)",
    subtitle: "Paket 2 Pot • Hemat 15% untuk pemakaian 1-2 bulan",
    price: 70000,
    weightGram: 800,
    image: "/images/orveli/prod-6.png",
  },
  {
    id: "bundle-3",
    tag: "Super Value • Stok Keluarga",
    isHot: true,
    title: "Paket Keluarga • 3 Pot (1.2kg)",
    subtitle: "Paket 3 Pot • Stok hemat untuk seluruh keluarga",
    price: 105000,
    weightGram: 1200,
    image: "/images/orveli/prod-7.png",
  },
];

export default function IngredientsDeck() {
  const { addToCart } = useCart();

  return (
    <section className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5">
      {/* Outer Luxury Container: bg #2D3622, r: 24px */}
      <div className="relative w-full rounded-[24px] overflow-hidden bg-[#2D3622] py-10 sm:py-20 lg:py-24 px-3 sm:px-8 lg:px-12 text-[#F1E6D8]">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-16">
          <div className="space-y-2.5 sm:space-y-3.5 max-w-[640px]">
            <Reveal direction="up" delay={0.05}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/[0.08] text-[#D4A359] font-inter text-[11px] sm:text-[13px] font-medium tracking-wide">
                <Flame className="w-3.5 h-3.5 text-[#D4A359] animate-pulse" />
                <span>HOT & BEST SELLING</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.12}>
              <h2 className="font-sans text-2xl sm:text-5xl lg:text-[48px] font-normal tracking-[-0.02em] leading-[1.12]">
                Hot Produk Glam & Glow
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.18}>
              <p className="font-inter text-[14px] sm:text-[16px] text-[#F1E6D8]/75 leading-relaxed">
                Formula rempah Bugis terlaris untuk kulit bersih, cerah, dan halus merata.
              </p>
            </Reveal>
          </div>

          <Reveal direction="up" delay={0.22}>
            <Link
              href="/produk"
              className="group/btn inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-white/[0.08] hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] font-inter text-[13px] sm:text-[14px] font-medium transition-all shadow-sm w-fit"
            >
              <span>Lihat Semua Produk</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>

        {/* Clean Luxury Showcase Grid (Exactly 3 Hot Products) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {HOT_PRODUCTS.map((item, index) => (
            <Reveal
              key={item.id}
              direction="up"
              delay={0.08 * (index % 3)}
              className="h-full"
            >
              <div className="group relative h-full rounded-[18px] sm:rounded-[20px] bg-[#201914] p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:bg-[#251e18] shadow-lg">
                {/* Image Container with Smooth Hover Scale */}
                <div className="relative w-full h-[190px] sm:h-[260px] rounded-[12px] sm:rounded-[14px] bg-[#2D3622]/60 overflow-hidden flex items-center justify-center p-4 sm:p-6 mb-4 sm:mb-5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Hot Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201914]/85 text-[#D4A359] font-inter text-[11px] font-medium backdrop-blur-sm">
                    {item.isHot && <Flame className="w-3 h-3 text-[#D4A359]" />}
                    <span>{item.tag}</span>
                  </div>
                </div>

                {/* Content Info */}
                <div className="space-y-2 mb-6">
                  <h3 className="font-sans text-[18px] sm:text-[20px] font-normal text-[#F1E6D8] leading-snug group-hover:text-[#D4A359] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-inter text-[13px] text-[#F1E6D8]/65 leading-relaxed line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                {/* Price & Add to Bag Action */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 mt-auto">
                  <div>
                    <span className="block font-inter text-[11px] text-[#F1E6D8]/50 uppercase tracking-wider">
                      Harga
                    </span>
                    <span className="font-sans text-[20px] font-medium text-[#F1E6D8]">
                      {formatRupiah(item.price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.title,
                        subtitle: item.subtitle,
                        price: item.price,
                        image: item.image,
                        weightGram: item.weightGram,
                      })
                    }
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[13px] font-medium transition-all shadow-sm active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Bag</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
