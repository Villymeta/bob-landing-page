/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',      // App directory (Next.js App Router)
    './pages/**/*.{js,ts,jsx,tsx}',    // Optional: Pages directory if used
    './components/**/*.{js,ts,jsx,tsx}' // All shared components
  ],
  theme: {
    extend: {
      colors: {
        bobyellow: 'rgb(248,228,159)', // Custom yellow brand color
      },
    },
  },
  darkMode: 'class', // Enables toggling dark mode via `class`
  plugins: [],
};