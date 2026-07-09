/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: "#0E2A47",
          mid: "#154063",
          soft: "#1F5C8C",
        },
        brand: {
          orange: "#FF6A3D",
          orangeDark: "#E5512A",
        },
        sand: "#F7F4EF",
        ink: "#16202B",
        muted: "#6B7686",
        line: "#E7E2D8",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
