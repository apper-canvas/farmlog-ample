/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: '#2d5016',
        secondary: '#8b7355',
        accent: '#e89b3c',
        surface: '#f5f1ed',
        background: '#e8f5e9',
        success: '#4a7c2c',
        warning: '#d97706',
        error: '#b91c1c',
        info: '#0369a1'
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}