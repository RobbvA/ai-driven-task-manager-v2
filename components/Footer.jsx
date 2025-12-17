"use client";

import { Box, HStack, Text, Link } from "@chakra-ui/react";

export default function Footer({ year }) {
  return (
    <Box
      as="footer"
      mt={8}
      px={{ base: 4, md: 6 }}
      py={4}
      borderTop="1px solid #dde2f2"
      bg="rgba(255,255,255,0.65)"
      backdropFilter="blur(8px)"
    >
      <HStack
        maxW="1120px"
        mx="auto"
        justify="space-between"
        spacing={4}
        flexWrap="wrap"
      >
        <Text fontSize="xs" color="#6b708c">
          © {year} AI Driven Task Manager
        </Text>

        <HStack spacing={3}>
          <Text fontSize="xs" color="#6b708c">
            Built by{" "}
            <Box as="span" fontWeight="700" color="#1f2335">
              dev.robb
            </Box>
          </Text>

          <Text fontSize="xs" color="#9aa0c3">
            •
          </Text>

          <Link
            href="https://github.com/"
            isExternal
            fontSize="xs"
            color="#374074"
            _hover={{ textDecoration: "underline" }}
          >
            GitHub
          </Link>
        </HStack>
      </HStack>
    </Box>
  );
}
