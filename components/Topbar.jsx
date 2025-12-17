"use client";

import { Box, Image } from "@chakra-ui/react";

export default function Topbar() {
  return (
    <Box as="header" bg="white" borderBottom="1px solid #dde2f2">
      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 2.5, md: 3 }} // 👈 MINIMUM veilige hoogte
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Image
          src="/brand/logo.png"
          alt="AI Task Manager logo"
          maxH={{ base: "96px", md: "140px" }} // groot maar beheerst
          maxW="100%"
          objectFit="contain"
        />
      </Box>
    </Box>
  );
}
