/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main': '#9b1111ff',
        'primary': '#e9e9e9ff'
      },
    },
  },
  plugins: [],
}

