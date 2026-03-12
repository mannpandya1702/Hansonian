/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hansonian design tokens
        brand: {
          dark:    "#1a1a2e",
          green:   "#4ade80",
          muted:   "#4a4a6a",
          surface: "#faf9f7",
          border:  "#e8e4dd",
          dim:     "#b0a9a0",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono:  ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl:  "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
}
