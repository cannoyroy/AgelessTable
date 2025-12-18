/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          soft: 'rgb(var(--surface-soft) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
        },
        moss: 'rgb(var(--moss) / <alpha-value>)',
        leaf: 'rgb(var(--leaf) / <alpha-value>)',
        earth: 'rgb(var(--earth) / <alpha-value>)',
        skylight: 'rgb(var(--skylight) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
      },
      borderRadius: {
        organic: '1.25rem',
      },
      boxShadow: {
        soft: '0 12px 30px rgb(15 23 42 / 0.12)',
        lift: '0 18px 45px rgb(15 23 42 / 0.18)',
      },
      transitionTimingFunction: {
        leaf: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
      },
      transitionDuration: {
        natural: '200ms',
      },
    },
  },
  plugins: [],
}

