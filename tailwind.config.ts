import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-tajawal)', 'var(--font-cairo)', 'sans-serif'],
        display: ['var(--font-cairo)', 'sans-serif'],
      },
      colors: {
        dark: '#070709',
        darker: '#030304',
        surface: '#0f1015',
        borderSubtle: 'rgba(255,255,255,0.08)',
        accent: '#6FBD46',
        accentBrand: '#2C8A36',
        accentDeep: '#0C622D',
        muted: '#8b8e9b',
        light: '#f5f5f7',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(111,189,70,0.35)',
        'glow-brand': '0 0 45px -8px rgba(44,138,54,0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config;
