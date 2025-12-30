"use client";

import { Box, Image } from "@chakra-ui/react";

export default function Topbar() {
  return (
    <Box as="header" bg="cardBg" borderBottom="1px solid" borderColor="border">
      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 2.5, md: 3 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 2.5 }}
          borderRadius="xl"
          bg="cardBgSecondary"
          border="1px solid"
          borderColor="border"
        >
          <Image
            src="/brand/logo.png"
            alt="AI Task Manager logo"
            maxH={{ base: "96px", md: "140px" }}
            maxW="100%"
            objectFit="contain"
          />
        </Box>
      </Box>
    </Box>
  );
}
