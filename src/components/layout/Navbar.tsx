"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic, RollingText } from "@/components/ui/Animations";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalCount, setIsCartOpen, setIsSearchOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "About", href: "/tentang-kami" },
    { label: "Shop", href: "/produk" },
    { label: "Panduan", href: "/panduan" },
    { label: "Contact & Order", href: "/pesan" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 px-2 sm:px-4 pointer-events-none"
    >
      {/* Orvéli Floating Translucent Pill Header (`framer-1se6ix8`: r:100px, blur:8px, gradient dark, border: none) */}
      <div
        className={`max-w-[1560px] mx-auto rounded-full px-4 sm:px-8 flex items-center justify-between pointer-events-auto transition-all duration-500 shadow-lg ${
          scrolled
            ? "h-[64px] bg-[#201914]/90 backdrop-blur-[16px]"
            : "h-[68px] sm:h-[72px] bg-gradient-to-b from-black/40 via-black/20 to-black/10 backdrop-blur-[10px]"
        }`}
      >
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="font-sans font-semibold text-lg sm:text-[21px] tracking-[0.08em] text-[#F1E6D8] uppercase">
            GLAM & GLOW
          </span>
        </Link>

        {/* Center: Navigation Menu (`framer-98l0d`: Inter 15px, RollingText + Animated Line) */}
        <nav className="hidden md:flex items-center gap-8 font-inter text-[15px] font-medium text-[#F1E6D8]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1.5 group/roll transition-colors ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-[#F1E6D8]/90 hover:text-white"
                }`}
              >
                <RollingText text={link.label} />
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F1E6D8] transition-transform duration-300 origin-left ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover/roll:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right: Utilities (Search, Cart, Order CTA) */}
        <div className="flex items-center gap-5 sm:gap-7">
          <div className="hidden lg:flex items-center gap-6 font-inter text-[15px] font-medium text-[#F1E6D8]/90">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="relative py-1.5 flex items-center gap-1.5 group/roll hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <RollingText text="Search" />
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F1E6D8] scale-x-0 group-hover/roll:scale-x-100 transition-transform duration-300 origin-left" />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative py-1.5 flex items-center gap-1.5 group/roll hover:text-white transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <RollingText text={`Cart (${totalCount})`} />
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F1E6D8] scale-x-0 group-hover/roll:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </div>

          <div className="hidden sm:block">
            <Magnetic strength={0.2}>
              <Link
                href="/pesan"
                className="px-5 sm:px-6 py-2.5 rounded-full bg-[#F1E6D8]/20 hover:bg-[#F1E6D8] text-[#F1E6D8] hover:text-[#201914] backdrop-blur-md font-inter text-[14px] sm:text-[15px] font-medium transition-all duration-300 flex items-center gap-2 group/roll"
              >
                <RollingText text="Pesan Sekarang" />
              </Link>
            </Magnetic>
          </div>

          {/* Mobile Utilities (Search, Cart & Hamburger) */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full text-[#F1E6D8] hover:bg-white/10 transition-colors"
              aria-label="Cari Produk"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full text-[#F1E6D8] hover:bg-white/10 transition-colors relative"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4A359] text-[#201914] font-inter text-[10px] font-bold flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#F1E6D8] hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden max-w-[1382px] mx-auto mt-2 rounded-[20px] bg-[#201914]/95 backdrop-blur-xl shadow-2xl p-5 space-y-2 pointer-events-auto"
          >
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-inter text-[16px] font-medium py-2.5 px-3.5 rounded-xl hover:bg-white/10 text-[#F1E6D8] transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full py-3 rounded-full bg-white/10 text-[#F1E6D8] font-inter text-[15px] font-medium flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Products & Formulas</span>
              </button>
              <Link
                href="/pesan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-full bg-[#F1E6D8] text-[#201914] font-inter text-[15px] font-semibold text-center block whitespace-nowrap"
              >
                Pesan Sekarang • Rp 35.000
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
