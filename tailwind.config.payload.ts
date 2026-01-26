/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/(payload)/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        brand: '#2656f6',
      },
    },
  },
  darkMode: ['selector', '[data-theme="dark"]', '.dark'],
  plugins: [],
};

module.exports = config;
