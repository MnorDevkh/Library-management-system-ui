/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        koho: ['KoHo', 'sans-serif'],
        kantumruy: ['Kantumruy', 'sans-serif'],
      },
    },
  },
  plugins: [],
};