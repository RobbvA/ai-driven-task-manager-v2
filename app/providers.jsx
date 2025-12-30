"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      minHeight: "100%",
      background: "{colors.appBg}",
      color: "{colors.text}",
    },
  },

  theme: {
    tokens: {
      colors: {
        // Base dark canvas (ongewijzigd – was al goed)
        bg: { value: "#0B0D12" },
        surface1: { value: "#111521" },
        surface2: { value: "#151B2B" },
        border: { value: "rgba(181,186,255,0.14)" },

        text: { value: "#EEF0FF" },
        muted: { value: "rgba(238,240,255,0.68)" },

        // Brand — pastel blue (volledige schaal behouden)
        brand: {
          50: { value: "rgba(181,186,255,0.08)" },
          100: { value: "rgba(181,186,255,0.12)" },
          200: { value: "rgba(181,186,255,0.20)" },
          300: { value: "rgba(181,186,255,0.30)" },
          400: { value: "rgba(181,186,255,0.42)" },
          500: { value: "#B5BAFF" },
          600: { value: "#9DA3FF" },
          700: { value: "#7F87FF" },
          800: { value: "#6A72FF" },
          900: { value: "#5660FF" },
        },

        // AI accent — deep blue
        ai: {
          50: { value: "rgba(79,99,255,0.08)" },
          200: { value: "rgba(79,99,255,0.16)" },
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

    // Semantic tokens — HIER zat het probleem
    semanticTokens: {
      colors: {
        // 3 tinten donkerder dan voorheen
        appBg: { value: "#0F1322" }, // was #f4f6fb
        cardBg: { value: "#141A2E" }, // was #ffffff
        cardBgSecondary: { value: "#191F36" },

        text: { value: "#E6E9FF" }, // hoog contrast, geen puur wit
        muted: { value: "rgba(230,233,255,0.62)" },
        border: { value: "rgba(181,186,255,0.18)" },

        focusRing: { value: "{colors.brand.300}" },
      },
    },
  },
});

export function Providers({ children }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
