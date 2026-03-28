/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'sans-serif'],
        serif: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 30px 70px -30px rgba(129, 140, 248, 0.35)',
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.12) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
