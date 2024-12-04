/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      dropShadow: {
        'glow': '0 0 2em rgba(97, 218, 251, 0.6)',
      },
    },
  },
  plugins: [],
}
