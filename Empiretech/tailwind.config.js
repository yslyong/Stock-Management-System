module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    gradientColorStops: theme => ({
      ...theme("colors"),
      "primary" : "#f9e288",
      "secondary" : "#e4ab4a",
     }),
    extend: {},
  },
  variants: {
    extend: {
      width: ["hover", "focus"],
      alignItems: ["hover", "focus"],
      position: ["hover", "focus"],
      borderWidth: ["last"],
      backgroundColor: ["odd", "even"],
    },
  },
  plugins: [],
};
