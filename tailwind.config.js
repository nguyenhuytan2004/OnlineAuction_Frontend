/** @type {import('tailwindcss').Config} */
import tailwindAnimate from "tailwindcss-animate";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          850: "#1a2332",
          950: "#0a0f1a",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "Helvetica", "Arial", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float-delayed 8s ease-in-out infinite",
        gradient: "gradient 3s ease infinite",
        shimmer: "shimmer 2s infinite",
        "slide-down": "slide-down 0.3s ease-out forwards",
        "slide-down-reverse": "slide-down-reverse 0.3s ease-out forwards",
        "slide-in-up": "slide-in-up 0.3s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
      boxShadow: {
        glow: "0 0 20px rgba(251, 146, 60, 0.5)",
        "glow-lg": "0 0 30px rgba(251, 146, 60, 0.6)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [tailwindAnimate],
};
