import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3a0ca3',
        'primary-dark': '#210155',
        secondary: '#4895ef',
        accent: '#f72585',
        danger: '#ef233c',
        success: '#2ec4b6',
        light: '#f8f9fa',
        dark: '#212529',
        gray: '#6c757d'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3a0ca3, #4895ef)',
        'gradient-secondary': 'linear-gradient(135deg, #4895ef, #3a0ca3)',
        'gradient-danger': 'linear-gradient(135deg, #ef233c, #d90429)'
      }
    }
  },
  plugins: []
} satisfies Config

 