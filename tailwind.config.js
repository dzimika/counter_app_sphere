/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {fontFamily: {
      'header': ['Playfair Display', 'serif'],
      'button': ['Montserrat', 'sans-serif'], 
    },
  },
  },
  plugins: [],
}

