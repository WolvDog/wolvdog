/** Paleta usada fora do Tailwind (SVG, gradientes, ícones). Mantenha em sincronia com tailwind.config.js. */
export const COLORS = {
  // Uniforme do Wolverine
  claw: '#FFC72C',
  clawDark: '#E5A800',
  clawLight: '#FFEFB8',
  hero: '#1E3A8A',
  heroDark: '#0F1F4D',
  heroMid: '#3B5CC4',
  heroLight: '#DCE6FB',
  /** Azul do ícone e da tela de abertura (app.json). */
  splash: '#1850BE',
  ink: '#111111',
  inkSoft: '#4A4F5C',
  white: '#FFFFFF',

  // Pelagem do Logan
  akita: '#F28C28',
  akitaDark: '#D9721A',
  akitaLight: '#FFB866',
  urajiro: '#FFF8EE',

  danger: '#E5484D',
  locked: '#E4E6EB',
  lockedDark: '#A0A4AE',
} as const;

/** Tipografia de títulos e botões (carregada em app/_layout.tsx). */
export const FONTS = {
  display: 'Oswald_700Bold',
  displayMedium: 'Oswald_500Medium',
} as const;
