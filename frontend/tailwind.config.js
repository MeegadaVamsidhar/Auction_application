/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        premium: {
          gold: {
            DEFAULT: "rgb(var(--premium-gold-rgb) / <alpha-value>)",
            light: "rgb(var(--premium-gold-light-rgb) / <alpha-value>)",
            dark: "rgb(var(--premium-gold-dark-rgb) / <alpha-value>)",
          },
          dark: {
            DEFAULT: "rgb(var(--premium-dark-rgb) / <alpha-value>)",
            lighter: "rgb(var(--premium-dark-lighter-rgb) / <alpha-value>)",
          },
          card: "rgb(var(--premium-card-rgb) / <alpha-value>)",
          border: "rgb(var(--premium-border-rgb) / <alpha-value>)",
          accent: "rgb(var(--premium-accent-rgb) / <alpha-value>)",
        }
      },
      backgroundImage: {
        "gradient-premium": "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4AF37 0%, #997A1E 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'reverse-spin': 'reverse-spin 15s linear infinite',
        'shimmer': 'shimmer 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        'reverse-spin': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
