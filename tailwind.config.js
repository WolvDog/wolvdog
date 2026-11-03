/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  // App é só tema claro; "class" evita o erro de color scheme do NativeWind no web.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Pelagem do Logan (Akita vermelho/dourado)
        akita: { 50: "#FFF6EC", 100: "#FFE8CC", 300: "#FFB866", 500: "#F28C28", 600: "#D9721A", 700: "#B35A12" },
        hero: { 500: "#1E5BD8", 600: "#1747AD", 700: "#0F3480" },
        leaf: { 100: "#DDF7C9", 500: "#58CC02", 600: "#46A302" },
        flame: { 100: "#FFE4D6", 500: "#FF6B1A" },
        ice: { 100: "#DCF2FF", 500: "#1CB0F6" },
        ink: { 400: "#9CA3AF", 600: "#4B5563", 900: "#1F2937" },
        cloud: "#F7F7F7",
      },
    },
  },
  plugins: [],
};
