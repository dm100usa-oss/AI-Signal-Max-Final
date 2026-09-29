import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Акценты проекта (см. ТЗ, раздел A.5)
        brand: {
          primary: "#2563eb",   // blue-600 — основное действие
          success: "#16a34a",   // green-600 — успех / второе действие
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // Планшет в альбоме: сенсор + landscape + достаточно широкий (отсекает телефон, накрывает любой планшет).
      addVariant("tablet", "@media (pointer: coarse) and (orientation: landscape) and (min-width: 1000px)");
      // Планшет в книге: сенсор + portrait + шире телефона.
      addVariant("tabletp", "@media (pointer: coarse) and (orientation: portrait) and (min-width: 600px)");
    }),
  ],
};

export default config;
