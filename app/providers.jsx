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
        // Base ink (goed, laten we dit met rust)
        bg: { value: "#0B0D12" },
        surface1: { value: "#111521" },
        surface2: { value: "#151B2B" },
        border: { value: "rgba(181,186,255,0.14)" },

        text: { value: "#EEF0FF" },
        muted: { value: "rgba(238,240,255,0.68)" },

        // Brand
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

      // 👇 NIEUW: diepte & hiërarchie
      shadows: {
        tab: {
          value: "0 1px 2px rgba(15,18,35,0.05)",
        },
        card: {
          value:
            "0 1px 2px rgba(15,18,35,0.04), 0 6px 16px rgba(15,18,35,0.06)",
        },
        cardHover: {
          value:
            "0 4px 12px rgba(15,18,35,0.06), 0 12px 32px rgba(15,18,35,0.08)",
        },
      },
    },

    semanticTokens: {
      colors: {
        appBg: { value: "#E9ECF4" },
        cardBg: { value: "#F1F3FA" },
        cardBgSecondary: { value: "#E6E9F4" },

        text: { value: "#1F2335" },
        muted: { value: "#5F647D" },
        border: { value: "rgba(31,35,53,0.10)" },

        focusRing: { value: "{colors.brand.200}" },
      },
    },
  },
});

export function Providers({ children }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
