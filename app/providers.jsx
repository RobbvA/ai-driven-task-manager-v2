"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Base ink / gray system
        bg: { value: "#0B0D12" },
        surface1: { value: "#111521" },
        surface2: { value: "#151B2B" },
        border: { value: "rgba(181,186,255,0.14)" },

        text: { value: "#EEF0FF" },
        muted: { value: "rgba(238,240,255,0.68)" },

        // Brand — pastel blue
        brand: {
          200: { value: "rgba(181,186,255,0.25)" },
          500: { value: "#B5BAFF" },
          600: { value: "#9DA3FF" },
        },

        // AI accent — deeper blue
        ai: {
          500: { value: "#4F63FF" },
          700: { value: "#2F46FF" },
          bg: { value: "rgba(79,99,255,0.14)" },
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

    semanticTokens: {
      colors: {
        appBg: { value: "{colors.bg}" },
        cardBg: { value: "{colors.surface1}" },
        cardBgSecondary: { value: "{colors.surface2}" },

        text: { value: "{colors.text}" },
        muted: { value: "{colors.muted}" },

        focusRing: { value: "{colors.brand.200}" },
      },
    },
  },
});

export function Providers({ children }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
