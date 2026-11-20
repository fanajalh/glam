import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: "#FBF1F2",
          light: "#FFF5F6",
          dark: "#EAD0D5",
        },
        blush: {
          canvas: "#FFF5F6",
          DEFAULT: "#F9E6E9",
          petal: "#F3DFE2",
          dusty: "#EAD0D5",
        },
        olive: {
          DEFAULT: "#4D2E33",
          light: "#623B42",
          dark: "#382024",
        },
        mauve: {
          DEFAULT: "#4D2E33",
          light: "#623B42",
          dark: "#382024",
          muted: "#6E5156",
        },
        coffee: {
          DEFAULT: "#2B1B1D",
          light: "#4D2E33",
          dark: "#1D1113",
        },
        gold: {
          DEFAULT: "#C98A8B",
          light: "#E7B6B4",
          dark: "#9E5E63",
        },
        roseGold: {
          DEFAULT: "#C98A8B",
          light: "#E7B6B4",
          dark: "#9E5E63",
        },
        cardMuted: "#F3DFE2",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-manrope)", "Manrope", "serif"],
        mono: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(77, 46, 51, 0.14)",
        card: "0 20px 40px -15px rgba(43, 27, 29, 0.16)",
      },
    },
  },
  plugins: [],
};
export default config;

