/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {},
   plugins: [
     require('@tailwindcss/typography'),
      require('tailwind-scrollbar')
  ],
};
