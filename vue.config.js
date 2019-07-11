module.exports = {
  baseUrl: '',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("tailwindcss")("tailwind.js"),
          require("autoprefixer")()
        ]
      }
    }
  }
};