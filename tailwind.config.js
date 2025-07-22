/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6B46C1",
        secondary: "#EC4899",
        accent: "#F59E0B",
        surface: "#1F2937",
        background: "#111827",
        'gray-850': "#1E293B",
        'gray-750': "#334155",
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse 2s ease-in-out infinite',
        'flame': 'flame 1.5s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)' },
          '50%': { transform: 'scale(1.1) rotate(1deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(107, 70, 193, 0.3)',
        'pink-glow': '0 0 20px rgba(236, 72, 153, 0.3)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}