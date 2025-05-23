/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       fontFamily: {
        poppins: ["Poppins_400Regular", "sans-serif"],
        poppinsBold: ["Poppins_700Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
