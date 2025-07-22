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
        'image-load': 'imageLoad 0.3s ease-out',
        'skeleton': 'skeleton 1.5s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)' },
          '50%': { transform: 'scale(1.1) rotate(1deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        imageLoad: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        skeleton: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.8' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(107, 70, 193, 0.3)',
        'pink-glow': '0 0 20px rgba(236, 72, 153, 0.3)',
        'amber-glow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'image-error': '0 0 0 1px rgba(239, 68, 68, 0.2)',
      },
      aspectRatio: {
        'avatar': '1',
        'card': '16 / 9',
        'square': '1 / 1',
      }
    },
  },
  plugins: [],
}