import React from "react";
import HeroBanner from "@/components/home/HeroBanner";
import IngredientsDeck from "@/components/home/IngredientsDeck";
import MissionSection from "@/components/home/MissionSection";
import FeaturesCollageSection from "@/components/home/FeaturesCollageSection";
import StatementPillSection from "@/components/home/StatementPillSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BotanistFundSection from "@/components/home/BotanistFundSection";

export default function HomePage() {
  return (
    <div className="w-full bg-[#FFF5F6]">
      {/* 1. Hero with Centered Vertical Glass Panel (92vh, r: 24px) */}
      <HeroBanner />

      {/* 2. Signature Product Spotlight (bg: #F9E6E9 Soft Blush Silk, r: 24px) */}
      <IngredientsDeck />

      {/* 3. Mission Word-by-Word Reveal + Curved Arc SVG + Dual Portrait (bg: #F3DFE2 Soft Petal, r: 24px) */}
      <MissionSection />

      {/* 4. Four Promises in Every Bottle — Velvet Mauve Contrast Collage (bg: #4D2E33, r: 24px) */}
      <FeaturesCollageSection />

      {/* 5. Statement with Animated Pop-In Image Pills (bg: #F9E6E9 Soft Blush Silk, r: 24px) */}
      <StatementPillSection />

      {/* 6. What Our Customers Say — Testimonials Carousel (bg: #F3DFE2 Soft Petal, r: 24px) */}
      <TestimonialsSection />

      {/* 7. Closing CTA Section (Soft Rose Blush Gradient, r: 24px) */}
      <BotanistFundSection />
    </div>
  );
}
