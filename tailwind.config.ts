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
          DEFAULT: "#F1E6D8",
          light: "#F7F0E6",
          dark: "#E3D3BE",
        },
        olive: {
          DEFAULT: "#2D3622",
          light: "#3E4A30",
          dark: "#1E2416",
        },
        coffee: {
          DEFAULT: "#32160C",
          light: "#4E2719",
          dark: "#210E07",
        },
        gold: {
          DEFAULT: "#D4A359",
          light: "#E5BE7D",
          dark: "#B8863A",
        },
        cardMuted: "#D7D1C3",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-manrope)", "Manrope", "serif"],
        mono: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(45, 54, 34, 0.15)",
        card: "0 20px 40px -15px rgba(50, 22, 12, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;

