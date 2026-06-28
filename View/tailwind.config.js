/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        water: {
          50: "#eef6fb",
          100: "#d7eaf5",
          200: "#b3d9ec",
          300: "#82c0de",
          400: "#4ba1cb",
          500: "#2884b4",
          600: "#1c6794",
          700: "#1a5279",
          800: "#1b4363",
          900: "#1a3954",
          950: "#0f2436",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 2px 0 rgba(15, 36, 54, 0.06), 0 1px 12px -2px rgba(15, 36, 54, 0.08)",
      },
    },
  },
  plugins: [],
};
