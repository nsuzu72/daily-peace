import('tailwindcss').Config
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Funnel Sans"', 'sans-serif'],
        quote: ['Jaldi', 'serif'],
      },
    },
  },
  plugins: [],
}
