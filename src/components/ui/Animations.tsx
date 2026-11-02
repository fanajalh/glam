"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  Variants,
} from "framer-motion";

const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * 1. Top Scroll Progress Bar
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#2D3622] via-[#D4A359] to-[#201914] origin-left z-[100] pointer-events-none"
    />
  );
}

/**
 * 2. Scroll-Triggered Reveal Wrapper
 */
interface RevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  blur?: boolean;
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.65,
  className = "",
  once = true,
  amount = 0.04,
  blur = false,
}: RevealProps) {
  const getInitial = () => {
    const base: Record<string, number | string> = {
      opacity: 0,
      filter: blur ? "blur(4px)" : "blur(0px)",
    };
    if (direction === "up") base.y = 24;
    if (direction === "down") base.y = -24;
    if (direction === "left") base.x = 24;
    if (direction === "right") base.x = -24;
    if (direction === "scale") base.scale = 0.95;
    return base;
  };

  const getAnimate = () => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  });

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: LUXURY_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 2b. Orvéli Character / Word Stagger Reveal (matches Orvéli translateY(110px) character reveal)
 */
export function CharReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.018,
  mode = "char",
  animateImmediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  mode?: "char" | "word";
  animateImmediate?: boolean;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.02 });
  const [forceVisible, setForceVisible] = useState(false);

  React.useEffect(() => {
    // Safety fallback: ensure text is never permanently hidden if observer lags
    const timer = setTimeout(() => setForceVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const shouldAnimate = animateImmediate || isInView || forceVisible;
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span
      ref={containerRef}
      className={`inline-flex flex-wrap justify-center items-center ${className}`}
      aria-label={text}
    >
      {words.map((word, wIdx) => (
        <span
          key={wIdx}
          className="inline-flex overflow-hidden mr-[0.26em] last:mr-0 pb-[0.08em] -mb-[0.08em]"
        >
          {mode === "word" ? (
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={
                shouldAnimate
                  ? { y: "0%", opacity: 1 }
                  : { y: "100%", opacity: 0 }
              }
              transition={{
                duration: 0.75,
                delay: delay + wIdx * 0.055,
                ease: LUXURY_EASE,
              }}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
          ) : (
            word.split("").map((char, cIdx) => {
              const currentIdx = charIndex++;
              return (
                <motion.span
                  key={cIdx}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={
                    shouldAnimate
                      ? { y: "0%", opacity: 1 }
                      : { y: "100%", opacity: 0 }
                  }
                  transition={{
                    duration: 0.7,
                    delay: delay + currentIdx * stagger,
                    ease: LUXURY_EASE,
                  }}
                  className="inline-block will-change-transform"
                >
                  {char}
                </motion.span>
              );
            })
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * 2c. Orvéli Animated Expanding Horizontal Line (`Closed` framer-E5xbt: width 1% -> 100%)
 */
export function ExpandLine({
  className = "bg-[#F1E6D8]/24",
  delay = 0.1,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div className="w-full overflow-hidden">
      <motion.div
        initial={{ scaleX: 0.01 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, delay, ease: LUXURY_EASE }}
        className={`h-[1px] w-full origin-left ${className}`}
      />
    </div>
  );
}

/**
 * 3. Stagger Container & Item for Cards / Lists / Grids
 */
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.06,
  delayChildren = 0.02,
  className = "",
  once = true,
  amount = 0.04,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
}

export function StaggerItem({
  children,
  className = "",
  direction = "up",
}: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 36 : 0,
      x: direction === "left" ? 36 : direction === "right" ? -36 : 0,
      scale: direction === "scale" ? 0.92 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.75,
        ease: LUXURY_EASE,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * 4. Scroll-Linked Word-by-Word Statement Reveal (Mirrors Orvéli Mission Text Reveal)
 */
interface WordRevealProps {
  text: string;
  highlightWords?: string[];
  className?: string;
  activeColor?: string;
  highlightColor?: string;
}

function SingleWord({
  word,
  progress,
  range,
  isHighlighted,
  activeColor,
  highlightColor,
}: {
  word: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: any;
  range: [number, number];
  isHighlighted: boolean;
  activeColor: string;
  highlightColor: string;
}) {
  const opacity = useTransform(progress, range, [0.65, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <span className="inline-block mr-[0.28em] relative">
      <motion.span
        style={{
          opacity,
          y,
          color: isHighlighted ? highlightColor : activeColor,
        }}
        className={`inline-block transition-colors ${
          isHighlighted ? "font-medium" : "font-normal"
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
}

export function ScrollWordReveal({
  text,
  highlightWords = [],
  className = "",
  activeColor = "#F1E6D8",
  highlightColor = "#F1E6D8",
}: WordRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.88", "end 0.45"],
  });

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const cleanWord = word.replace(/[.,—!?]/g, "").toLowerCase();
        const isHighlighted = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord
        );
        return (
          <SingleWord
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            isHighlighted={isHighlighted}
            activeColor={activeColor}
            highlightColor={highlightColor}
          />
        );
      })}
    </p>
  );
}

/**
 * 5. Magnetic Wrapper
 */
export function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;
    setPos({ x, y });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 16, mass: 0.2 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * 6. Stagger Rolling Text on Hover (Mirrors Orvéli `transform: scale(0.98) rotate(1deg)` Nav & CTA Link Hover)
 */
export function RollingText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block overflow-hidden group/roll align-bottom whitespace-nowrap ${className}`}
    >
      <span className="inline-block whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:-translate-y-full">
        {text}
      </span>
      <span className="absolute left-0 top-0 inline-block whitespace-nowrap translate-y-full scale-[0.98] rotate-[1deg] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:translate-y-0 group-hover/roll:scale-100 group-hover/roll:rotate-0">
        {text}
      </span>
    </span>
  );
}

/**
 * 7. Parallax & Scale Reveal Image Container
 */
export function ParallaxImageBox({
  children,
  className = "",
  speed = 30,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.01, 1.06]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full relative">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * 8. Exact Orvéli Mission Curved Arrow (`SVG [38]`, 557x363)
 */
export function AnimatedCurveArc({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.svg
      ref={ref}
      width="557"
      height="363"
      viewBox="0 0 557 363"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
      animate={
        isInView
          ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
          : { clipPath: "inset(0 100% 0 0)", opacity: 0 }
      }
      transition={{ duration: 1.6, ease: LUXURY_EASE, delay: 0.15 }}
    >
      <path
        d="M5.55079 1.25155e-05L7.53085 5.29584L1.9545 4.36271L5.55079 1.25155e-05ZM556.405 301.582C556.67 301.638 556.838 301.899 556.781 302.163L555.854 306.471C555.797 306.736 555.536 306.904 555.272 306.847C555.007 306.79 554.839 306.53 554.896 306.265L555.72 302.436L551.891 301.612C551.627 301.555 551.459 301.294 551.515 301.03C551.572 300.765 551.833 300.597 552.097 300.654L556.405 301.582ZM4.81953 4.36997L5.30295 4.44781C-18.7425 153.778 60.2407 265.938 174.604 321.852C288.987 377.776 438.717 377.405 556.037 301.649L556.302 302.06L556.568 302.472C438.934 378.431 288.837 378.793 174.174 322.732C59.4923 266.662 -19.7893 154.119 4.33612 4.29213L4.81953 4.36997Z"
        fill="#F1E6D8"
        fillOpacity="0.42"
      />
    </motion.svg>
  );
}

/**
 * 9. Exact Orvéli Botanical Lotus Mark (`SVG [39]`, 66x44)
 */
export function BotanicalMarkDraw({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 65.96 43.931"
      xmlns="http://www.w3.org/2000/svg"
      width="66"
      height="44"
      fill="none"
      className={className}
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: LUXURY_EASE }}
    >
      <g fill="#F1E6D8">
        <path d="M35.95 43.666a.4.4 0 0 1-.37-.258 28 28 0 0 1-1.7-8.611 28 28 0 0 1 .588-6.926 28.1 28.1 0 0 1 6.199-12.473 28 28 0 0 1 3.869-3.706l.027-.019a28 28 0 0 1 6.709-3.919.396.396 0 1 1 .3.733 27.1 27.1 0 0 0-6.569 3.846 27.34 27.34 0 0 0-9.76 15.702 27.3 27.3 0 0 0-.572 6.732c.11 2.879.666 5.694 1.651 8.366a.396.396 0 0 1-.371.533" />
        <path d="M34.261 33.48a.396.396 0 0 1-.394-.368c-.773-10.645-.23-15.5 1.937-17.316 1.722-1.445 4.288-.796 7.536.025 5.376 1.36 12.737 3.223 22.021-2.321a.396.396 0 1 1 .406.68c-4.232 2.527-8.447 3.789-12.884 3.857-3.787.058-7.086-.777-9.737-1.448-3.147-.796-5.42-1.372-6.834-.187-1.893 1.587-2.388 6.567-1.656 16.653a.397.397 0 0 1-.395.424" />
        <path d="M61.283 17.417a4.4 4.4 0 0 1-2.011-.478.396.396 0 0 1 .387-.69c.012.006 1.208.654 2.617.23 1.15-.344 2.138-1.294 2.937-2.823a.396.396 0 1 1 .701.367c-.904 1.73-2.057 2.814-3.425 3.22a4.2 4.2 0 0 1-1.206.174" />
        <path d="M59.466 16.988a.395.395 0 0 1-.386-.481c.009-.039.225-.967 1.165-1.803.84-.747 2.452-1.572 5.361-1.258a.396.396 0 0 1-.085.787c-4.905-.53-5.641 2.328-5.67 2.45a.4.4 0 0 1-.385.305M34.854 28.349a.394.394 0 0 1-.34-.597c3.534-5.992 7.04-7.307 10.43-8.578 3.277-1.23 6.666-2.5 10.208-8.18a.395.395 0 1 1 .671.419c-3.683 5.908-7.2 7.227-10.601 8.502-3.412 1.28-6.635 2.488-10.027 8.24a.4.4 0 0 1-.34.194" />
        <path d="M51.982 16.012a.4.4 0 0 1-.263-.1.4.4 0 0 1-.133-.296l-.016-.062c-.101-.41-.372-1.503.298-2.608.598-.987 1.784-1.703 3.527-2.127a.396.396 0 1 1 .187.769c-1.53.373-2.553.968-3.037 1.768-.5.824-.293 1.654-.206 2.008.043.171.087.349-.062.515a.4.4 0 0 1-.295.133m-7.202-3.613a.394.394 0 0 1-.392-.452q0-.029-.004-.074c-.083-1.461.313-2.586 1.174-3.344 1.188-1.045 3.186-1.313 5.936-.798a.396.396 0 1 1-.145.778c-2.5-.468-4.272-.261-5.268.614-1.01.888-.932 2.255-.906 2.705.01.172.018.308-.098.438a.4.4 0 0 1-.296.133" />
        <path d="M46.316 12.623c-.676 0-1.2-.136-1.46-.204l-.078-.02a.396.396 0 0 1-.292-.659c.17-.191.381-.136.57-.087 3.18.827 5.021-1.555 6.007-3.698a.395.395 0 1 1 .72.33c-1.023 2.225-2.382 3.612-4.04 4.124a4.8 4.8 0 0 1-1.427.214m6.154 3.429a3.3 3.3 0 0 1-.556-.046.396.396 0 1 1 .134-.78c.609.105 1.493 0 2.15-.608.726-.67 1.036-1.838.896-3.379a.396.396 0 1 1 .788-.071c.206 2.268-.51 3.444-1.146 4.032-.682.63-1.543.852-2.267.852M35.344 41.823a.396.396 0 0 1-.394-.365c-.438-5.424.69-9.621 3.354-12.475 4.805-5.15 13.577-5.049 19.982-4.975 1.506.017 2.928.034 4.09-.025a.396.396 0 0 1 .04.79c-1.187.06-2.621.044-4.14.026-6.257-.072-14.827-.17-19.394 4.724-2.504 2.684-3.562 6.679-3.142 11.872a.396.396 0 0 1-.363.426z" />
        <path d="M58.117 26.153q-.379.001-.749-.055c-1.052-.16-1.858-.664-2.396-1.497a.396.396 0 1 1 .665-.43c.41.635 1.032 1.02 1.851 1.145 1.869.285 4.177-.844 4.656-1.242a.396.396 0 1 1 .506.609c-.568.472-2.6 1.47-4.533 1.47" />
        <path d="M55.304 24.782a.396.396 0 0 1-.36-.56c.403-.884.983-1.468 1.724-1.735 1.565-.564 3.507.378 5.22 1.208q.345.17.677.325a.396.396 0 0 1-.337.717 60 60 0 0 1-.685-.33c-1.573-.762-3.356-1.626-4.607-1.175-.54.195-.957.626-1.272 1.319a.4.4 0 0 1-.36.231M30.009 43.666a.395.395 0 0 1-.372-.533 27.1 27.1 0 0 0 1.651-8.366 27.3 27.3 0 0 0-.571-6.732 27.3 27.3 0 0 0-6.024-12.12 27.4 27.4 0 0 0-3.765-3.603 27 27 0 0 0-6.54-3.825.396.396 0 0 1 .3-.733 28 28 0 0 1 6.735 3.939 28 28 0 0 1 3.87 3.706A28.1 28.1 0 0 1 31.49 27.87a28 28 0 0 1 .588 6.926 27.9 27.9 0 0 1-1.7 8.61.4.4 0 0 1-.37.26" />
        <path d="m31.7 33.48-.03-.002a.396.396 0 0 1-.366-.423c.732-10.085.237-15.066-1.656-16.653-1.413-1.184-3.686-.61-6.833.187-2.652.67-5.951 1.505-9.737 1.448-4.438-.068-8.653-1.33-12.885-3.858a.396.396 0 1 1 .406-.68c9.284 5.545 16.646 3.682 22.022 2.322 3.247-.821 5.813-1.47 7.536-.025 2.167 1.816 2.71 6.671 1.937 17.316a.396.396 0 0 1-.395.367" />
        <path d="M4.676 17.417c-.373 0-.78-.048-1.206-.175-1.368-.405-2.52-1.488-3.425-3.22a.396.396 0 1 1 .702-.366c.799 1.529 1.787 2.479 2.937 2.824 1.409.423 2.605-.225 2.617-.232a.397.397 0 0 1 .387.69 4.4 4.4 0 0 1-2.012.479" />
        <path d="M6.493 16.99a.396.396 0 0 1-.385-.308c-.03-.126-.77-2.978-5.67-2.449a.396.396 0 0 1-.085-.787c2.91-.314 4.521.51 5.362 1.258.94.836 1.156 1.764 1.165 1.803a.396.396 0 0 1-.387.483m24.612 11.359a.4.4 0 0 1-.341-.195c-3.392-5.751-6.615-6.96-10.027-8.239-3.4-1.275-6.918-2.594-10.6-8.502a.396.396 0 1 1 .671-.419c3.541 5.68 6.93 6.95 10.207 8.18 3.39 1.271 6.897 2.586 10.43 8.578a.396.396 0 0 1-.34.597" />
        <path d="M13.979 16.012a.4.4 0 0 1-.296-.133c-.148-.166-.104-.344-.062-.515.088-.354.293-1.184-.206-2.008-.484-.8-1.506-1.395-3.037-1.768a.396.396 0 0 1 .188-.77c1.742.425 2.929 1.141 3.526 2.128.67 1.105.4 2.197.298 2.608l-.015.062a.395.395 0 0 1-.396.396m7.199-3.613a.4.4 0 0 1-.296-.133c-.116-.13-.108-.266-.098-.438.025-.45.103-1.817-.906-2.705-.996-.876-2.769-1.082-5.268-.614a.396.396 0 0 1-.146-.778c2.751-.515 4.748-.247 5.936.798.862.758 1.257 1.883 1.174 3.344l-.004.074a.395.395 0 0 1-.392.452" />
        <path d="M19.643 12.623a4.8 4.8 0 0 1-1.428-.214c-1.657-.512-3.015-1.9-4.037-4.124a.396.396 0 1 1 .72-.33c.984 2.144 2.825 4.525 6.006 3.698.188-.049.4-.104.57.087a.396.396 0 0 1-.293.659l-.077.02a5.6 5.6 0 0 1-1.461.204m-6.153 3.429c-.723 0-1.584-.222-2.267-.852-.636-.588-1.351-1.764-1.145-4.032a.396.396 0 1 1 .788.071c-.14 1.541.17 2.71.894 3.379.659.608 1.543.712 2.151.608a.396.396 0 0 1 .135.78q-.258.046-.556.046m17.125 25.771-.032-.002a.396.396 0 0 1-.363-.426c.42-5.193-.638-9.188-3.143-11.872-4.567-4.894-13.137-4.796-19.394-4.724-1.518.018-2.952.035-4.14-.025a.396.396 0 0 1 .04-.79c1.163.058 2.585.041 4.091.024 6.405-.074 15.176-.175 19.982 4.975 2.663 2.854 3.792 7.05 3.353 12.475a.396.396 0 0 1-.394.365" />
        <path d="M7.842 26.153c-1.932 0-3.964-.998-4.532-1.47a.396.396 0 0 1 .507-.609c.477.398 2.786 1.527 4.655 1.242.819-.125 1.441-.51 1.851-1.144a.396.396 0 0 1 .665.43c-.538.832-1.344 1.336-2.396 1.497a5 5 0 0 1-.75.054" />
        <path d="M10.656 24.783a.4.4 0 0 1-.36-.232c-.316-.693-.732-1.124-1.272-1.319-1.252-.45-3.034.413-4.607 1.176q-.35.17-.685.329a.396.396 0 0 1-.337-.717q.331-.156.677-.325c1.713-.83 3.655-1.772 5.22-1.208.741.267 1.321.851 1.724 1.736a.396.396 0 0 1-.36.56M32.98 43.93c-8.275 0-15.343-5.901-16.805-14.033a.396.396 0 1 1 .779-.14c1.395 7.754 8.135 13.382 16.026 13.382s14.63-5.628 16.026-13.382a.396.396 0 0 1 .78.14C48.321 38.029 41.253 43.93 32.98 43.93" />
        <path d="M20.374 38.28a.396.396 0 0 1-.376-.52c.89-2.71.25-3.351-1.297-4.9-.687-.688-1.542-1.545-2.457-2.8a.396.396 0 0 1 .64-.466c.878 1.205 1.71 2.038 2.377 2.707 1.578 1.58 2.53 2.534 1.489 5.706a.4.4 0 0 1-.376.273" />
        <path d="M19.5 38.633c-.408 0-.857-.125-1.304-.378-1.953-1.104-3.332-4.174-2.012-8.543a.396.396 0 0 1 .758.23c-1.364 4.513.391 6.916 1.644 7.624.61.345 1.21.366 1.494.052a.395.395 0 1 1 .587.531c-.291.322-.702.484-1.167.484m26.086-.353a.4.4 0 0 1-.376-.273c-1.042-3.172-.089-4.126 1.489-5.706.668-.67 1.498-1.502 2.377-2.707a.396.396 0 0 1 .64.466c-.915 1.255-1.77 2.112-2.457 2.8-1.546 1.549-2.187 2.19-1.297 4.9a.397.397 0 0 1-.376.52" />
        <path d="M46.458 38.633c-.465 0-.875-.162-1.166-.484a.395.395 0 1 1 .587-.53c.284.313.884.292 1.494-.053 1.253-.708 3.008-3.11 1.644-7.625a.395.395 0 1 1 .758-.229c1.32 4.37-.06 7.44-2.013 8.543-.446.253-.896.378-1.304.378M32.98 1.025c-1.424 1.837-2.173 4.005-2.173 6.3s.75 4.462 2.172 6.298c1.423-1.836 2.173-4.004 2.173-6.299 0-2.294-.75-4.462-2.173-6.3m0 13.623a.4.4 0 0 1-.303-.14c-1.717-2.028-2.662-4.58-2.662-7.184 0-2.641.92-5.125 2.662-7.184a.396.396 0 0 1 .604 0c1.742 2.059 2.662 4.543 2.662 7.184 0 2.605-.945 5.156-2.662 7.183a.4.4 0 0 1-.302.14" />
        <path d="M32.98 14.648a.396.396 0 0 1-.397-.396V.396a.396.396 0 0 1 .792 0v13.856a.396.396 0 0 1-.396.396M43.023 3.53a6.94 6.94 0 0 0-3.314 2.887 6.93 6.93 0 0 0-.926 4.296 6.94 6.94 0 0 0 3.314-2.887 6.94 6.94 0 0 0 .926-4.296m-4.563 8.127a.396.396 0 0 1-.39-.33 7.85 7.85 0 0 1 .958-5.313 7.86 7.86 0 0 1 4.188-3.406.396.396 0 0 1 .52.307 7.86 7.86 0 0 1-.958 5.314 7.85 7.85 0 0 1-4.188 3.406.4.4 0 0 1-.13.022" />
        <path d="M38.46 11.657a.396.396 0 0 1-.34-.597l4.886-8.28a.395.395 0 1 1 .682.403L38.8 11.462a.4.4 0 0 1-.342.195M23.862 7.826a6.93 6.93 0 0 0 3.313 2.887 6.93 6.93 0 0 0-.925-4.296 6.94 6.94 0 0 0-3.314-2.887 6.94 6.94 0 0 0 .926 4.296m3.637 3.83a.4.4 0 0 1-.13-.021 7.86 7.86 0 0 1-4.189-3.406 7.86 7.86 0 0 1-.958-5.314.396.396 0 0 1 .52-.307 7.86 7.86 0 0 1 4.19 3.406 7.85 7.85 0 0 1 .957 5.314.4.4 0 0 1-.39.329" />
        <path d="M27.5 11.657a.4.4 0 0 1-.341-.195l-4.887-8.28a.396.396 0 0 1 .682-.402l4.887 8.28a.396.396 0 0 1-.34.597" />
      </g>
    </motion.svg>
  );
}

/**
 * 10. Exact Orvéli Feature Collage Curved Arrow (`SVG [48]`, 407x624)
 */
export function FeatureArrowDraw({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 407.228 623.695"
      xmlns="http://www.w3.org/2000/svg"
      width="407"
      height="624"
      fill="none"
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
      animate={
        isInView
          ? { clipPath: "inset(0 0 0% 0)", opacity: 1 }
          : { clipPath: "inset(0 0 100% 0)", opacity: 0 }
      }
      transition={{ duration: 1.5, ease: LUXURY_EASE, delay: 0.2 }}
    >
      <path
        fill="#F1E6D8"
        fillOpacity=".42"
        d="m87.014.64 4.6 3.287.546-5.627zM235.257 610.9a.49.49 0 0 0 .464.513l4.401.223a.49.49 0 0 0 .05-.978l-3.912-.198.198-3.912a.49.49 0 1 0-.978-.05zM91.424 1.068l-.05.487C241.825 17.1 329.636 122.49 353.946 247.449c24.313 124.98-14.915 269.48-118.529 363.112l.329.363.328.363c103.891-93.881 143.206-238.74 118.832-364.024C330.531 121.957 242.427 16.177 91.474.582z"
      />
    </motion.svg>
  );
}
