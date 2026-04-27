/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Core Material Design 3 palette (from reference HTML) ──
        "primary":                    "#005ea5",
        "primary-container":          "#0077cf",
        "on-primary":                 "#ffffff",
        "on-primary-container":       "#fdfcff",
        "primary-fixed":              "#d3e4ff",
        "primary-fixed-dim":          "#a2c9ff",
        "on-primary-fixed":           "#001c38",
        "on-primary-fixed-variant":   "#004881",
        "inverse-primary":            "#a2c9ff",
        "surface-tint":               "#0060a9",

        "secondary":                  "#00629f",
        "secondary-container":        "#62b3ff",
        "on-secondary":               "#ffffff",
        "on-secondary-container":     "#004471",
        "secondary-fixed":            "#d0e4ff",
        "secondary-fixed-dim":        "#9bcbff",
        "on-secondary-fixed":         "#001d34",
        "on-secondary-fixed-variant": "#004a79",

        "tertiary":                   "#585b6f",
        "tertiary-container":         "#717389",
        "on-tertiary":                "#ffffff",
        "on-tertiary-container":      "#fffbff",
        "tertiary-fixed":             "#e0e1fa",
        "tertiary-fixed-dim":         "#c3c5dd",
        "on-tertiary-fixed":          "#181a2c",
        "on-tertiary-fixed-variant":  "#434559",

        "surface":                    "#f9f9f9",
        "surface-dim":                "#dadada",
        "surface-bright":             "#f9f9f9",
        "surface-variant":            "#e2e2e2",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f3f3f3",
        "surface-container":          "#eeeeee",
        "surface-container-high":     "#e8e8e8",
        "surface-container-highest":  "#e2e2e2",
        "inverse-surface":            "#2f3131",
        "inverse-on-surface":         "#f1f1f1",

        "on-surface":                 "#1a1c1c",
        "on-surface-variant":         "#404753",
        "on-background":              "#1a1c1c",
        "background":                 "#f9f9f9",

        "outline":                    "#707784",
        "outline-variant":            "#c0c7d5",

        "error":                      "#ba1a1a",
        "error-container":            "#ffdad6",
        "on-error":                   "#ffffff",
        "on-error-container":         "#93000a",

        // ── Extended DHDedu tokens (teacher dashboard variant) ──
        "header-accent":              "#0477BF",
        "secondary-accent":           "#D8D9F2",
        "info-callout":               "#049DD9",
        "background-light":           "#F2F2F2",
        "background-dark":            "#101622",
      },
      fontFamily: {
        "headline": ["Be Vietnam Pro", "Inter", "sans-serif"],
        "body":     ["Inter", "Be Vietnam Pro", "sans-serif"],
        "label":    ["Inter", "sans-serif"],
        "sans":     ["Be Vietnam Pro", "Inter", "sans-serif"],
        "display":  ["Be Vietnam Pro", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm:      "0.25rem",
        md:      "0.375rem",
        lg:      "0.5rem",
        xl:      "0.75rem",
        "2xl":   "1rem",
        "3xl":   "1.5rem",
        full:    "9999px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
