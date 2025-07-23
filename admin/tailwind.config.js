/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#679affff',
        'secondary': '#9cbdffff',
        'third': '#ccdcff'
      },
    },
  },
  plugins: [],
}

