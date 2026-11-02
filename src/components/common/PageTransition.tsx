"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BotanicalMarkDraw } from "@/components/ui/Animations";

interface PageTransitionContextType {
  navigateWithTransition: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(
  undefined
);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }
  return context;
}

const EASE_CURTAIN: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "covering" | "uncovering">("idle");
  const targetHrefRef = useRef<string | null>(null);

  const navigateWithTransition = (href: string) => {
    if (href === pathname || phase !== "idle") return;
    targetHrefRef.current = href;
    setPhase("covering");
  };

  // When covering finishes (380ms), navigate to target route
  useEffect(() => {
    if (phase === "covering" && targetHrefRef.current) {
      const timer = setTimeout(() => {
        router.push(targetHrefRef.current!);
        // Instantly reset scroll to top before revealing
        try {
          (window as any).__lenis?.scrollTo(0, { immediate: true });
        } catch {
          // ignore
        }
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      }, 380);

      return () => clearTimeout(timer);
    }
  }, [phase, router]);

  // When pathname changes after navigation, uncover the new page
  useEffect(() => {
    if (phase === "covering") {
      setPhase("uncovering");
      const timer = setTimeout(() => {
        setPhase("idle");
        targetHrefRef.current = null;
      }, 420);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Global click interception for internal route navigation
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only intercept internal pathname routes (not external links, not hash anchors)
      if (
        href.startsWith("/") &&
        !href.includes("#") &&
        anchor.getAttribute("target") !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        if (href === pathname) return;
        e.preventDefault();
        navigateWithTransition(href);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [pathname, phase]);

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition }}>
      {children}

      {/* Luxury Custom Transition Overlay Curtain */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{
              y: phase === "covering" ? "0%" : "-100%",
            }}
            exit={{ y: "-100%" }}
            transition={{
              duration: phase === "covering" ? 0.38 : 0.42,
              ease: EASE_CURTAIN,
            }}
            className="fixed inset-0 z-[9999] bg-[#201914] text-[#F1E6D8] pointer-events-auto flex flex-col items-center justify-center shadow-2xl overflow-hidden"
          >
            {/* Top/Bottom Subtle Gold Glow Lines */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A359]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A359]/60 to-transparent" />

            {/* Center Brand Identity Mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-4 text-center px-6"
            >
              <BotanicalMarkDraw className="scale-110" />
              <div className="space-y-1">
                <span className="font-sans font-semibold text-lg sm:text-[22px] tracking-[0.25em] text-[#F1E6D8] uppercase">
                  GLAM & GLOW
                </span>
                <span className="block font-inter text-[11px] sm:text-[12px] tracking-[0.2em] text-[#D4A359] uppercase">
                  BOTANICAL CARE
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}

