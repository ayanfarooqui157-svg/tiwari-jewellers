/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#641E2B',
          50: '#FBF4F5',
          100: '#F6E6E8',
          200: '#ECCDD2',
          300: '#DEACB3',
          400: '#993444',
          500: '#641E2B',
          600: '#541723',
          700: '#42101A',
          800: '#320B13',
          900: '#1F060B'
        },
        gold: {
          DEFAULT: '#C6A15B',
          50: '#FBF8F1',
          100: '#F6EEDC',
          200: '#EBDCB9',
          300: '#DFC895',
          400: '#D3B676',
          500: '#C6A15B',
          600: '#AB843E',
          700: '#8A682D',
          800: '#644A1D',
          900: '#3D2C0E'
        },
        ivory: {
          DEFAULT: '#FAF7F0',
          50: '#FFFFFF',
          100: '#FAF7F0',
          200: '#F3EDE0',
          300: '#E8DDC8',
          400: '#DBCBAE'
        },
        charcoal: {
          DEFAULT: '#252525',
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#CECECE',
          300: '#AFAFAF',
          400: '#757575',
          500: '#4B4B4B',
          600: '#383838',
          700: '#252525',
          800: '#1A1A1A',
          900: '#111111'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(100, 30, 43, 0.1)',
        'luxury-hover': '0 20px 40px -15px rgba(100, 30, 43, 0.18)',
        'gold-glow': '0 0 20px rgba(198, 161, 91, 0.25)',
      }
    },
  },
  plugins: [],
}
