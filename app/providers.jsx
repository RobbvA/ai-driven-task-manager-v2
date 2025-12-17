"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

/**
 * Brand tokens (subtle)
 * - brand.500: primary
 * - brand.50: soft tint (background highlight)
 *
 * TIP: if you want to match the logo even closer:
 * replace brand.500/600 with colors sampled from the logo.
 */
const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#eef2ff" }, // soft indigo tint
          100: { value: "#e0e7ff" },
          200: { value: "#c7d2fe" },
          300: { value: "#a5b4fc" },
          400: { value: "#818cf8" },
          500: { value: "#4f46e5" }, // primary
          600: { value: "#4338ca" }, // hover
          700: { value: "#3730a3" },
          800: { value: "#312e81" },
          900: { value: "#1e1b4b" },
        },
      },
    },

    semanticTokens: {
      colors: {
        // app surfaces
        appBg: { value: "#e9ecf5" },
        cardBg: { value: "#ffffff" },
        border: { value: "#dde2f2" },

        // text
        text: { value: "#1f2335" },
        muted: { value: "#6b708c" },

        // focus ring
        focusRing: { value: "{colors.brand.300}" },
      },
    },
  },
});

export function Providers({ children }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
