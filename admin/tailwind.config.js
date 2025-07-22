/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#80aaff',
        'secondary': '#b3ccff',
        'third': '#ccdcff'
      },
    },
  },
  plugins: [],
}

