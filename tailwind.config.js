/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0C10',
        neon: '#00D9FF',
        chrome: '#CFD8E3',
      }
    },
  },
  plugins: [],
}
