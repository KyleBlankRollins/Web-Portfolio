module.exports = {
  theme: {
    colors: {},
    textColor: {
      primary: "var(--color-text-primary)",
      "primary-soft": "var(--color-text-primary-soft)",
      secondary: "var(--color-text-secondary)",
      tertiary: "var(--color-text-tertiary)",
      accent: "var(--color-text-accent)",
      default: "var(--color-text-default)"
    },
    backgroundColor: {
      primary: "var(--color-bg-primary)",
      "primary-soft": "var(--color-bg-primary-soft)",
      secondary: "var(--color-bg-secondary)",
      tertiary: "var(--color-bg-tertiary)",
      accent: "var(--color-bg-accent)",
      default: "var(--color-bg-default)"
    },
    borderColor: {
      primary: "var(--color-border-primary)",
      "primary-soft": "var(--color-border-primary-soft)",
      secondary: "var(--color-border-secondary)",
      tertiary: "var(--color-border-tertiary)",
      accent: "var(--color-border-accent)",
      default: "var(--color-border-default)"
    },
    extend: {
      colors: {
        state: {
          "info": "#2a3741",
          "warning": "#f17d1d",
          "error": "#f44336",
          "success": "#748d55",
          "primary": "#d13e60"
        }
      }
    }
  },
  variants: {},
  plugins: []
};
