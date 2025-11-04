/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#5175FF',
          light: '#6B8AFF',
          dark: '#3D5FE6',
        },
        secondary: {
          main: '#2C2F3E',
          light: '#3A3E52',
          dark: '#1F2129',
        },
        neutral: {
          white: '#FFFFFF',
          offWhite: '#F9FAFB',
          lightGray: '#E5E7EB',
          gray: '#9CA3AF',
          darkGray: '#4B5563',
          charcoal: '#2C2F3E',
        },
        accent: {
          pink: '#FFB3C1',
          cyan: '#5FDDE5',
          purple: '#8B7FFF',
        },
      },
      fontFamily: {
        sans: ['Kumbh Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Kumbh Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'button': '1.75rem',
        'card': '1rem',
      },
      boxShadow: {
        'card': '0 10px 30px -5px rgba(81, 117, 255, 0.15)',
        'card-hover': '0 20px 40px -5px rgba(81, 117, 255, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
