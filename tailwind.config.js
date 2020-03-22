/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {
    fontFamily: {
      display: ["Oswald", "sans-serif"],
      displayB: ["Playfair Display", "sans-serif"],
      mono: ["IBM Plex Mono", "sans-serif"],
      body: ["Lato", "sans-serif"]
    },
    extend: {
      colors: {
        "primary": "#8EB6CB",
        "theme-black": "#010D10",
        "theme-white": "#f5f5f0",
        "button-success": "#50a16f",
        "button-primary": "#5981b7",
        "button-info": "#102335",
        "button-warning": "#cd9137",
        "button-danger": "#f44336",
        "button-default": "#999999"
      }
    }
  },
  variants: {},
  plugins: []
}
