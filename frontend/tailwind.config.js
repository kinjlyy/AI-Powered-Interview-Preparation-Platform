/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d7e6ff',
          200: '#b2d1ff',
          300: '#8cbaff',
          400: '#5a96ff',
          500: '#3877ff',
          600: '#255ce0',
          700: '#1c47b3',
          800: '#173a8c',
          900: '#132f6c',
        },
        slate: {
          950: '#0b1220',
        },
      },
      boxShadow: {
        card: '0 15px 45px rgba(15,23,42,0.08)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgba(56,119,255,0.18), rgba(255,255,255,0))',
        'cta-gradient':
          'radial-gradient(circle at top, rgba(94,138,255,0.35), rgba(12,18,40,0.95))',
      },
    },
  },
  plugins: [],
}

