/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FBF1F3',
          100: '#F5DDE2',
          200: '#E9B6C0',
          300: '#D98CA0',
          400: '#B85A75',
          500: '#8E3A52',
          600: '#6E2438',
          700: '#4A1020', // primary deep maroon/wine
          800: '#3C0C1A',
          900: '#2E0813',
          950: '#1C040B',
        },
        cream: {
          50: '#FFFCF6',
          100: '#FDF6EC', // background cream
          200: '#F8EAD3',
          300: '#F1DBB0',
          400: '#E7C585',
          500: '#D9AE5A',
        },
        gold: {
          50: '#FCF8EC',
          100: '#F7EFC9',
          200: '#EFDF93',
          300: '#E5CD5C',
          400: '#D9B83A',
          500: '#C9A227', // accent gold/mustard
          600: '#A8821E',
          700: '#83631A',
          800: '#6B4F1C',
          900: '#5A421D',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(74, 16, 32, 0.06), 0 1px 2px rgba(74, 16, 32, 0.04)',
        'card-hover': '0 8px 24px rgba(74, 16, 32, 0.10)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'scale-in': 'scale-in 0.18s ease-out',
      },
    },
  },
  plugins: [],
};
