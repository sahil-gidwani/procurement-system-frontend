/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        custom1: "rgb(18, 64, 118)",
        custom2: "rgb(127, 159, 128)",
        custom3: "rgb(249, 232, 151)",
        custom4: "rgb(255, 195, 116)",
      },
      keyframes: {
        chase: {
          "0%, 100%": { transform: "translateY(0) scale(0)" },
          "25%": { transform: "translateY(-12px) scale(1)" },
          "50%": { transform: "translateX(12px) scale(1)" },
          "75%": { transform: "translateY(12px) scale(1)" },
        },
      },
      animation: {
        chase: "chase 2s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
