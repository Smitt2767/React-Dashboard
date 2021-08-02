module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      body: ["Lato", "ui-sans-serif"],
      scale: {
        80: ".80",
        85: ".85",
        200: "2",
        250: "2.5",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["disabled"],
    },
  },
  plugins: [],
};
