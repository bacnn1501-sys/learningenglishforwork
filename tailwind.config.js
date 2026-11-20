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
          50: '#FDF4F2',
          100: '#FBE8E5',
          200: '#F8D5CE',
          300: '#F1B2A5',
          400: '#E48471',
          500: '#D45D44',
          600: '#B93815', // Culinary brick red / terracotta
          700: '#9B2C0E',
          800: '#81270F',
          900: '#6C2513',
          DEFAULT: '#B93815',
        },
        culinary: {
          cream: '#FFFBF5',
          warmWhite: '#FAFAF7',
          amber: '#F59E0B',
          olive: '#4D6B53', // Olive green for hospitality/freshness
          darkOlive: '#344937',
          espresso: '#2B1C19',
          cardLight: '#FFFFFF',
          cardDark: '#1E1B18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

