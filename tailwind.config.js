/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          /* backgrounds */
          dark:    '#0D0820',       /* deep purple-black */
          darker:  '#080514',       /* deepest bg */
          card:    '#160F35',       /* purple-tinted card */
          /* yellow — from flyer */
          gold:         '#FFD700',
          'gold-light': '#FFE84D',
          /* red — from flyer "SINGLES" */
          rose:         '#CC1B2A',
          'rose-dark':  '#A31220',
          /* purple — from flyer "CONNECT" */
          purple:       '#3D1C8A',
          'purple-light':'#5B35C0',
          /* teal — outline accent on flyer */
          teal:         '#19A88C',
          /* text */
          muted:   '#B8B0D0',       /* soft purple-grey */
          light:   '#FFFBF0',       /* warm white */
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.7s ease forwards',
        'fade-in':    'fadeIn 0.6s ease forwards',
        'slide-left': 'slideLeft 0.7s ease forwards',
        'slide-right':'slideRight 0.7s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer:      'shimmer 2s linear infinite',
        float:        'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      backgroundImage: {
        'gold-shimmer':  'linear-gradient(90deg, #FFD700 0%, #FFE84D 50%, #FFD700 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(8,5,20,0.45) 0%, rgba(8,5,20,0.72) 55%, rgba(8,5,20,0.97) 100%)',
      },
    },
  },
  plugins: [],
}

