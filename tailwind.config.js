/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ugc: {
          navy: '#0b2545',
          navyDark: '#06182f',
          navyLight: '#1a3a6c',
          gold: '#c79100',
          goldSoft: '#e8b923',
          cream: '#fbf7ee',
        },
      },
      fontFamily: {
        display: ['Merriweather', 'Georgia', 'serif'],
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
