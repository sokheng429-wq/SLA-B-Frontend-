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
          green: '#77BC1F',
          'green-hover': '#66A31A',
          'green-light': '#F2F9E8',
          orange: '#FF9900',
          'orange-hover': '#E68A00',
          'orange-light': '#FFF7E6',
          navy: '#232F3F',
          'navy-dark': '#1A232F',
          'navy-light': '#2D3D50',
          'navy-muted': '#8FA0B4',
        },
        jira: {
          blue: '#77BC1F',
          'blue-hover': '#66A31A',
          'blue-light': '#F2F9E8',
          'blue-dark': '#232F3F',
          dark: '#1A232F',
          text: '#232F3F',
          subtle: '#6B778C',
          bg: '#F4F6F8',
          border: '#DFE3E8',
          sidebar: '#232F3F',
          p1: '#DE350B', // Red Highest
          p2: '#FF9900', // Accent Orange High
          p3: '#EAB308', // Amber Medium
          p4: '#77BC1F', // Primary Green Low
        }
      },
      fontFamily: {
        khmer: ['"Kantumruy Pro"', 'sans-serif'],
        english: ['"Montserrat"', 'sans-serif'],
        sans: ['"Montserrat"', '"Kantumruy Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
      boxShadow: {
        'jira-card': '0 1px 3px 0 rgba(35, 47, 63, 0.12)',
        'jira-card-hover': '0 4px 12px -2px rgba(35, 47, 63, 0.18), 0 0 1px rgba(119, 188, 31, 0.3)',
      }
    },
  },
  plugins: [],
}
