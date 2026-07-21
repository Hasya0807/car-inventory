/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        asphalt: '#14161A',
        charcoal: '#1E2126',
        chrome: '#C9CDD3',
        graphite: '#7A8088',
        ignition: '#FF4B2B',
        'status-green': '#3ECF8E',
        'status-amber': '#F2B84B',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        base: '16px',
        xs: '12px',
        sm: '14px',
        lg: '20px',
        xl: '25px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '50px',
      }
    },
  },
  plugins: [],
}
