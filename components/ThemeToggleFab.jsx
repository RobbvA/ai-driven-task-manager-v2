"use client";

import { useEffect, useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleFab() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Box position="fixed" right="14px" bottom="14px" zIndex="9999">
      <IconButton
        aria-label="Toggle theme"
        title="Toggle theme"
        size="sm"
        w="44px"
        h="44px"
        borderRadius="full"
        bg="cardBg"
        color="text"
        border="1px solid"
        borderColor="border"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        _hover={{ bg: "cardBgSecondary" }}
        _active={{ transform: "scale(0.98)" }}
      >
        {mounted ? isDark ? <Sun size={18} /> : <Moon size={18} /> : null}
      </IconButton>
    </Box>
  );
}
