"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      minHeight: "100%",
      background: "{colors.bg}",
      color: "{colors.text}",
    },
  },

  theme: {
    tokens: {
      colors: {
        // Base ink/gray
        bg: { value: "#0B0D12" },
        surface1: { value: "#111521" },
        surface2: { value: "#151B2B" },
        border: { value: "rgba(181,186,255,0.14)" },

        text: { value: "#EEF0FF" },
        muted: { value: "rgba(238,240,255,0.68)" },

        // Brand — pastel blue (BELANGRIJK: volledige schaal, want je UI gebruikt brand.50/100/200/etc)
        brand: {
          50: { value: "rgba(181,186,255,0.10)" },
          100: { value: "rgba(181,186,255,0.14)" },
          200: { value: "rgba(181,186,255,0.22)" },
          300: { value: "rgba(181,186,255,0.32)" },
          400: { value: "rgba(181,186,255,0.45)" },
          500: { value: "#B5BAFF" },
          600: { value: "#9DA3FF" },
          700: { value: "#7F87FF" },
          800: { value: "#6A72FF" },
          900: { value: "#5660FF" },
        },

        // AI accent — deeper blue
        ai: {
          50: { value: "rgba(79,99,255,0.10)" },
          200: { value: "rgba(79,99,255,0.18)" },
          500: { value: "#4F63FF" },
          700: { value: "#2F46FF" },
        },
      },

      radii: {
        lg: { value: "14px" },
        xl: { value: "18px" },
        "2xl": { value: "22px" },
      },

      fonts: {
        body: { value: "var(--font-inter), system-ui, sans-serif" },
        heading: { value: "var(--font-inter), system-ui, sans-serif" },
      },
    },

    // 2) Semantic tokens blijven bestaan zoals je components verwachten: text/muted/border
    semanticTokens: {
      colors: {
        appBg: { value: "{colors.bg}" },
        cardBg: { value: "{colors.surface1}" },
        cardBgSecondary: { value: "{colors.surface2}" },

        text: { value: "{colors.text}" },
        muted: { value: "{colors.muted}" },
        border: { value: "{colors.border}" },

        focusRing: { value: "{colors.brand.200}" },
      },
    },
  },
});

export function Providers({ children }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
