import type { Config } from "tailwindcss";

// Design tokens — a "growth" palette instead of the generic AI-app
// cream+terracotta look. Habits are meant to feel like something growing,
// not a corporate dashboard.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F7F5", // pale mint-grey
        surface: "#FFFFFF",
        ink: "#1C2B24", // deep forest — primary text
        moss: {
          DEFAULT: "#3F7D58", // primary — growth, completed check-ins
          dark: "#2E5C41",
          light: "#DCEAE1",
        },
        amber: {
          DEFAULT: "#D8A34D", // accent — streak highlight
          light: "#F3E3C4",
        },
        sage: "#8FA89A", // muted secondary text
        ringtrack: "#E4EAE5", // unfilled portion of the growth ring
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
