"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Instagram,
  MessageCircle,
  Mail,
  ArrowUpRight,
  Sparkles,
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import OrderForm from "@/components/order/OrderForm";
import { useSiteContent } from "@/context/SiteContentContext";
import {
  Reveal,
  CharReveal,
  RollingText,
} from "@/components/ui/Animations";

export default function PesanPage() {
  const { pesan, general } = useSiteContent();
  const heroRef = useRef<HTMLDivElement>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const rawHeroBgY = useTransform(heroScroll, [0, 1], ["0%", "18%"]);
  const rawHeroScale = useTransform(heroScroll, [0, 1], [1.1, 1.0]);
  const heroBgY = useSpring(rawHeroBgY, { stiffness: 120, damping: 24 });
  const heroScale = useSpring(rawHeroScale, { stiffness: 120, damping: 24 });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="w-full bg-[#F1E6D8] overflow-x-clip">
      {/* 1. Contact / Order Hero with Parallax Zoom */}
      <section
        ref={heroRef}
        className="relative w-full max-w-[1560px] mx-auto px-2 sm:px-3 pt-3 pb-1.5"
      >
        <div className="relative w-full rounded-[24px] overflow-hidden h-[58vh] min-h-[460px] max-h-[620px] flex items-center justify-center bg-[#201914]">
          <motion.div
            style={{ y: heroBgY, scale: heroScale }}
            className="absolute inset-0 z-0 origin-center"
          >
            <Image
              src="/images/glam/jar-ingredients-wood.jpg"
              alt="Hubungi & Pesan Glam & Glow Lulur Badda Lotong"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]" />
          </motion.div>

          {/* Centered Vertical Glass Panel */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[345px] sm:w-[560px] lg:w-[688px] z-10 bg-black/[0.06] pointer-events-none" />

          {/* Hero Title & Subtitle */}
          <div className="relative z-20 max-w-[680px] mx-auto px-4 sm:px-6 text-center space-y-5 pt-10">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] text-[#D4A359] font-inter text-[12px] sm:text-[13px] font-medium tracking-wide mx-auto backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{pesan.heroBadge}</span>
            </motion.div>

            <h1 className="font-sans font-normal text-4xl sm:text-6xl lg:text-[76px] text-[#F1E6D8] tracking-[-0.04em] leading-[1.06] flex flex-col items-center">
              <CharReveal
                text={pesan.heroLine1}
                delay={0.15}
                stagger={0.02}
                animateImmediate
              />
              <CharReveal
                text={pesan.heroLine2}
                delay={0.32}
                stagger={0.02}
                animateImmediate
              />
            </h1>

            <Reveal direction="up" delay={0.45}>
              <p className="font-sans text-[17px] sm:text-[19px] text-[#F1E6D8]/85 max-w-[480px] mx-auto leading-[1.5]">
                {pesan.heroSubtitle}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Main Order Form Section with Smooth Reveal */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5"
      >
        <OrderForm />
      </motion.section>

      {/* 3. Community & Social Contact Section */}
      <section className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Left: Social Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#D7D1C3] rounded-[24px] p-6 sm:p-12 lg:p-14 flex flex-col justify-between gap-8 text-[#201914] shadow-md"
          >
            <div className="space-y-3">
              <span className="font-inter text-[12px] uppercase tracking-[0.14em] text-[#2D3622] font-semibold block">
                {pesan.socialEyebrow}
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-[-0.03em] leading-[1.1]">
                {pesan.socialTitle}
              </h2>
              <p className="font-sans text-[16px] sm:text-[18px] text-[#201914]/75 max-w-[440px] leading-[1.5]">
                {pesan.socialDesc}
              </p>
            </div>

            {/* Pill-Shaped Social Link Buttons */}
            <div className="space-y-3">
              <motion.a
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.99 }}
                href={general.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/roll min-h-[56px] py-2.5 px-4 sm:px-6 rounded-full bg-black/[0.06] hover:bg-[#201914] hover:text-[#F1E6D8] flex items-center justify-between gap-2.5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <Instagram className="w-5 h-5 text-[#D4A359]" />
                  <span className="font-sans text-[15px] sm:text-[16px] font-medium">
                    <RollingText text="Instagram" />
                  </span>
                </div>
                <span className="font-inter text-[12px] sm:text-[14px] opacity-75 flex items-center gap-1 min-w-0 max-w-[170px] sm:max-w-[280px] shrink justify-end">
                  <span className="truncate">{general.instagramHandle}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </span>
              </motion.a>

              <motion.a
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.99 }}
                href={`https://wa.me/${general.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/roll min-h-[56px] py-2.5 px-4 sm:px-6 rounded-full bg-black/[0.06] hover:bg-[#201914] hover:text-[#F1E6D8] flex items-center justify-between gap-2.5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#D4A359]" />
                  <span className="font-sans text-[15px] sm:text-[16px] font-medium">
                    <RollingText text="WhatsApp Resmi" />
                  </span>
                </div>
                <span className="font-inter text-[12px] sm:text-[14px] opacity-75 flex items-center gap-1 min-w-0 max-w-[170px] sm:max-w-[280px] shrink justify-end">
                  <span className="truncate">+{general.whatsappNumber}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </span>
              </motion.a>

              <motion.a
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.99 }}
                href={`mailto:${general.email}`}
                className="group/roll min-h-[56px] py-2.5 px-4 sm:px-6 rounded-full bg-black/[0.06] hover:bg-[#201914] hover:text-[#F1E6D8] flex items-center justify-between gap-2.5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <Mail className="w-5 h-5 text-[#D4A359]" />
                  <span className="font-sans text-[15px] sm:text-[16px] font-medium">
                    <RollingText text="Email Kemitraan" />
                  </span>
                </div>
                <span className="font-inter text-[12px] sm:text-[14px] opacity-75 flex items-center gap-1 min-w-0 max-w-[170px] sm:max-w-[280px] shrink justify-end">
                  <span className="truncate">{general.email}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Newsletter Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#2D3622] rounded-[24px] p-6 sm:p-12 lg:p-14 flex flex-col justify-between gap-8 text-[#F1E6D8] shadow-md"
          >
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.08] font-inter text-[13px] text-[#D4A359]">
                {pesan.newsletterBadge}
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-[-0.03em] leading-[1.1]">
                {pesan.newsletterTitle}
              </h2>
              <p className="font-sans text-[16px] sm:text-[18px] text-[#F1E6D8]/70 max-w-[460px] leading-[1.5]">
                {pesan.newsletterDesc}
              </p>
            </div>

            <div className="space-y-3 pt-4">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[52px] px-6 rounded-full bg-white/[0.12] text-[#D4A359] flex items-center gap-2.5 font-inter text-[14px]"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#D4A359]" />
                  <span>Terima kasih! Email Anda sudah terdaftar untuk info Glam &amp; Glow.</span>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Masukkan email Anda..."
                    className="h-[52px] px-5 rounded-full bg-white/[0.05] text-[#F1E6D8] placeholder-[#F1E6D8]/40 font-inter text-[14px] focus:outline-none focus:bg-white/[0.08] transition-all flex-1"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="h-[52px] px-8 rounded-full bg-[#F1E6D8] hover:bg-white text-[#201914] font-inter text-[14px] font-medium transition-all inline-flex items-center justify-center gap-2"
                  >
                    <span>Langganan</span>
                    <Send className="w-3.5 h-3.5 text-[#201914]" />
                  </motion.button>
                </form>
              )}
              <p className="font-inter text-[12px] text-[#F1E6D8]/45">
                Kami menghargai privasi Anda. Tidak ada spam, hanya tips perawatan alami.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
