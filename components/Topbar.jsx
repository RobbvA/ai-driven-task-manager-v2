"use client";

import { Box, Image } from "@chakra-ui/react";

export default function Topbar() {
  return (
    <Box as="header" bg="appBg" borderBottom="1px solid" borderColor="border">
      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 2, md: 2.5 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          src="/brand/logo.png"
          alt="AI Task Manager logo"
          maxH={{ base: "56px", md: "72px" }}
          maxW="100%"
          objectFit="contain"
          borderRadius="md"
          border="1px solid"
          borderColor="rgba(0,0,0,0.08)"
          bg="transparent"
        />
      </Box>
    </Box>
  );
}
