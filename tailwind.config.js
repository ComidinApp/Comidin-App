/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'comidin-dark-orange': '#D67030',
        'comidin-light-orange': '#FEFAE0 ',
      },
      fontFamily: {
        'baloo2-regular': ['Baloo2_400Regular'],
        'baloo2-extrabold': ['Baloo2_800ExtraBold'],
      },
    },
  },
  plugins: [],
}
