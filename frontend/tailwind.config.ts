import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#080B14",
          secondary: "#0F1629",
          card: "#111827",
          hover: "#151D35",
        },
        accent: {
          green: "#00E5A0",
          purple: "#6C63FF",
          red: "#FF4D6D",
          orange: "#FF8C42",
          yellow: "#FFD166",
          blue: "#4CC9F0",
        },
        text: {
          primary: "#E8EDF5",
          secondary: "#8B92A5",
          muted: "#4B5268",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.07)",
          visible: "rgba(255, 255, 255, 0.15)",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      animation: {
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: "class",
};

export default config;
