/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        custom1: 'rgb(17, 35, 90)',    // 11235A
        custom2: 'rgb(89, 111, 183)',  // 596FB7
        custom3: 'rgb(198, 207, 155)', // C6CF9B
        custom4: 'rgb(246, 236, 169)'  // F6ECA9
      },
      keyframes: {
        'chase': {
          '0%, 100%': { transform: 'translateY(0) scale(0)' },
          '25%': { transform: 'translateY(-12px) scale(1)' },
          '50%': { transform: 'translateX(12px) scale(1)' },
          '75%': { transform: 'translateY(12px) scale(1)' },
        },
      },
      animation: {
        'chase': 'chase 2s linear infinite',
      },
    },
  },
  plugins: [],
};
