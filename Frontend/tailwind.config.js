/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths as per your project structure
  ],
  theme: {
    extend: {
      backgroundImage: {
        'btn-grad': "linear-gradient(to right, #c21500 0%, #ffc500 51%, #c21500 100%)",
        'custom-bg': "linear-gradient(to right, #bbd2c5, #536976)",
      },
      boxShadow: {
        'btn-shadow': '0 0 20px #eee',
      },
      borderRadius: {
        'btn-radius': '10px',
      },
      textColor: {
        'btn-color': '#ffffff',
      },
      transitionProperty: {
        'btn-transition': 'background-position, color',
      },
    },
  },
  plugins: [],
};
