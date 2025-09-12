/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        playerController: "#0F0F0F",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideHorizontal: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.15s ease-in forwards',
        slideHorizontal: 'slideHorizontal 20s ease-in-out infinite',
        pop: 'pop 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}