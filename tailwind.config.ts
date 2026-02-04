import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B71C1C',
          dark: '#8B1515',
          light: '#D32F2F',
        },
        'rose-gold': {
          DEFAULT: '#D4AF88',
          dark: '#B8956F',
          light: '#E5C9A8',
        },
        'light-pink': '#FFE5E5',
        cream: '#F5F1ED',
        'soft-gray': '#F0F0F0',
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'romantic-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FFE5E5 100%)',
      },
      boxShadow: {
        'romantic': '0 4px 20px rgba(183, 28, 28, 0.1)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 30px rgba(183, 28, 28, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
