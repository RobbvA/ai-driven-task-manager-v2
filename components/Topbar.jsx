"use client";

import { Box, Heading, Text } from "@chakra-ui/react";

export default function Topbar() {
  return (
    <Box
      as="header"
      position="relative"
      overflow="hidden"
      bg="white"
      borderBottom="1px solid #dde2f2"
    >
      {/* Background image: cover + centered focus (show middle of artwork) */}
      <Box
        position="absolute"
        inset="0"
        zIndex={0}
        bgImage="url('/BannerAITaskManager.png?v=4')"
        bgRepeat="no-repeat"
        bgPosition="center center" // 👈 focus on the middle
        bgSize="cover" // 👈 keep earlier style (subtle background, no "contain" look)
        opacity={0.18} // subtle but visible
        filter="saturate(1.15) contrast(1.08) brightness(0.98)"
        pointerEvents="none"
        transform="scale(1.03)" // avoids visible edges on some screens
      />

      {/* Overlay: protect readability without washing out the artwork */}
      <Box
        position="absolute"
        inset="0"
        zIndex={1}
        bgGradient="linear(to-b,
          rgba(255,255,255,0.92) 0%,
          rgba(255,255,255,0.78) 55%,
          rgba(255,255,255,0.62) 100%
        )"
        pointerEvents="none"
      />

      {/* Content */}
      <Box
        position="relative"
        zIndex={2}
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 6, md: 7 }} // 👈 slightly taller so the image center fits in the banner
      >
        <Heading
          size="sm"
          color="#1f2335"
          fontWeight="semibold"
          letterSpacing="-0.01em"
          mb={1}
        >
          AI Driven Task Manager
        </Heading>

        <Text fontSize="sm" color="#6b708c">
          Intelligent task planning with clarity and focus
        </Text>
      </Box>
    </Box>
  );
}
