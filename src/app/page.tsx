import React from "react";
import HeroBanner from "@/components/home/HeroBanner";
import IngredientsDeck from "@/components/home/IngredientsDeck";
import MissionSection from "@/components/home/MissionSection";
import FeaturesCollageSection from "@/components/home/FeaturesCollageSection";
import StatementPillSection from "@/components/home/StatementPillSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BotanistFundSection from "@/components/home/BotanistFundSection";
import OrderForm from "@/components/order/OrderForm";

export default function HomePage() {
  return (
    <div className="w-full bg-[#F1E6D8]">
      {/* 1. Hero with Centered Vertical Glass Panel (92vh, r: 24px) */}
      <HeroBanner />

      {/* 2. Quiet New Arrivals 5-Card Arc Showcase (bg: #2D3622, r: 24px) */}
      <IngredientsDeck />

      {/* 3. Mission Word-by-Word Reveal + Curved Arc SVG + Dual Portrait (bg: #201914, r: 24px) */}
      <MissionSection />

      {/* 4. Four Promises in Every Bottle — Diagonal Staircase Glass Collage (bg: #2D3622, r: 24px) */}
      <FeaturesCollageSection />

      {/* 5. Statement with Animated Pop-In Image Pills (bg: #201914, r: 24px) */}
      <StatementPillSection />

      {/* 6. What Our Customers Say — Before/After Cards (bg: #D7D1C3, r: 24px) */}
      <TestimonialsSection />

      {/* 7. The Botanist Fund (bg: #2D3622, r: 24px) */}
      <BotanistFundSection />

      {/* 8. Direct Order Form in Orvéli Contact Architecture (bg: #2D3622 + White Card, r: 24px) */}
      <section
        id="order-section"
        className="w-full max-w-[1560px] mx-auto px-2 sm:px-3 py-1.5"
      >
        <OrderForm />
      </section>
    </div>
  );
}
