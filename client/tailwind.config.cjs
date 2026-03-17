module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        client: {
          primary: '#6C5CE7',
          'primary-light': '#A29BFE',
          'primary-dark': '#4834D4',
          accent: '#00CEC9',
          'accent-warm': '#FDCB6E',
          success: '#00B894',
          danger: '#E17055',
          sidebar: '#1E1245',
          'sidebar-hover': '#2A1B5E',
          bg: '#F5F5FA',
          card: '#FFFFFF',
          text: '#2D3436',
          'text-sec': '#636E72',
          'text-hint': '#B2BEC3',
        },
      },
    },
  },
  plugins: [],
}