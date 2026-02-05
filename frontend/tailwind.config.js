/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        premium: {
          gold: "#D4AF37",
          dark: "#0F0F0F",
          card: "#1A1A1A",
          border: "#333333",
        },
      },
      backgroundImage: {
        "gradient-premium": "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
      },
    },
  },
  plugins: [],
};
