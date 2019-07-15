module.exports = {
  theme: {
    fontFamily: {
      display: ["Oswald", "sans-serif"],
      displayB: ["Playfair Display", "sans-serif"],
      body: ["Lato", "sans-serif"]
    },
    extend: {
      colors: {
        "primary": "#66AB68",
        "primary-light": "#b2d5b3",
        "secondary": "#263238",
        "secondary-light": "#839097",
        "callout": "#96687f",
        "callout-light": "#cab3bf",
        "white": "#f4f5f2",
        "black": "#000000",
        "button-success": "#a8cfa9",
        "button-primary": "#28313a",
        "button-info": "#68b96b",
        "button-warning": "#e5a933",
        "button-danger": "#f44336",
        "button-default": "#999999"
      }
    }
  },
  variants: {
    opacity: ["responsive", "hover", "focus"]
  },
  plugins: []
}
