/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  // App é só tema claro; "class" evita o erro de color scheme do NativeWind no web.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Amarelo do uniforme do Wolverine
        claw: { 50: "#FFF9E6", 100: "#FFEFB8", 400: "#FFD24D", 500: "#FFC72C", 600: "#E5A800", 700: "#8A6500" },
        // Azul do uniforme do Wolverine
        hero: { 50: "#EEF3FF", 100: "#DCE6FB", 400: "#3B5CC4", 500: "#1E3A8A", 600: "#172E6E", 700: "#0F1F4D" },
        // Pelagem do Logan (Akita vermelho/dourado)
        akita: { 50: "#FFF6EC", 100: "#FFE8CC", 300: "#FFB866", 500: "#F28C28", 600: "#D9721A", 700: "#B35A12" },
        ink: { 400: "#8B909C", 600: "#4A4F5C", 900: "#111111" },
        cloud: "#F4F5F7",
      },
      fontFamily: {
        display: ["Oswald_700Bold"],
        "display-medium": ["Oswald_500Medium"],
      },
    },
  },
  plugins: [],
};
