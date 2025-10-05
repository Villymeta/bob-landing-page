/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',       // Next.js App Router
      './pages/**/*.{js,ts,jsx,tsx}',     // (Optional) Pages directory
      './components/**/*.{js,ts,jsx,tsx}' // Shared components
    ],
    theme: {
      extend: {
        colors: {
          bobyellow: 'rgb(248,228,159)', // Custom BOB yellow
        },
      },
    },
    darkMode: 'class',
    plugins: [],
  };