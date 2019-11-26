module.exports = {
  theme: {
    colors: {},
    textColor: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)",
      default: "var(--color-text-default)",
      "default-soft": "var(--color-text-default-soft)",
      inverse: "var(--color-text-inverse)",
      "inverse-soft": "var(--color-text-inverse-soft)"
    },
    backgroundColor: {
      primary: "var(--color-bg-primary)",
      secondary: "var(--color-bg-secondary)",
      default: "var(--color-bg-default)",
      inverse: "var(--color-bg-inverse)",
      "inverse-soft": "var(--color-bg-inverse-soft)"
    },
    borderColor: {
      primary: "var(--color-border-primary)",
      secondary: "var(--color-border-secondary)",
      default: "var(--color-border-default)",
      inverse: "var(--color-border-inverse)",
      "inverse-soft": "var(--color-border-inverse-soft)"
    },
    extend: {
      colors: {
        red: {
          1: "#BA7385",
          2: "#AC556B",
          3: "#864253",
          4: "#6B3543",
          5: "#512832",
          6: "#361A21"
        },
        teal: {
          1: "#D6DBDC",
          2: "#ADB7BA",
          3: "#839397",
          4: "#5A6F75",
          5: "#314B53",
          6: "#082730"
        },
        purple: {
          1: "#7A81A6",
          2: "#666C8A",
          3: "#51566F",
          4: "#3D4153",
          5: "#292B37",
          6: "#14161C"
        },
        dusk: {
          1: "#000000",
          2: "#B3B0B3",
          3: "#8D888D",
          4: "#686168",
          5: "#423A42",
          6: "#1C121C"
        },
        grey: {
          1: "#F6F6F4",
          2: "#CDCDCB",
          3: "#A4A4A3",
          4: "#7B7B7A",
          5: "#525251",
          6: "#292929"
        },
        state: {
          // "Info" same as "dusk-6".
          "info": "#1C121C",
          "warning": "#C27D1D",
          "error": "#F44336",
          "success": "#458D55",
          "primary": "#333F5F"
        }
      }
    }
  },
  variants: {},
  plugins: []
};
