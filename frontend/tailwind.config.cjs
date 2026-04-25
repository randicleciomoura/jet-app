/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b1220',
          900: '#111b2e',
          800: '#1a2740',
          700: '#243455',
        },
      },
    },
  },
  plugins: [],
};
