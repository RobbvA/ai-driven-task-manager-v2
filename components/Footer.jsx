"use client";

import { Box, HStack, Text, Link } from "@chakra-ui/react";

export default function Footer({ year }) {
  return (
    <Box
      as="footer"
      mt={8}
      px={{ base: 4, md: 6 }}
      py={4}
      borderTop="1px solid"
      borderColor="border"
      bg="cardBgSecondary"
      backdropFilter="blur(8px)"
    >
      <HStack
        maxW="1120px"
        mx="auto"
        justify="space-between"
        spacing={4}
        flexWrap="wrap"
      >
        <Text fontSize="xs" color="muted">
          © {year} AI Driven Task Manager
        </Text>

        <HStack spacing={3}>
          <Text fontSize="xs" color="muted">
            Built by{" "}
            <Box as="span" fontWeight="700" color="text">
              dev.robb
            </Box>
          </Text>

          <Text fontSize="xs" color="muted">
            •
          </Text>

          <Link
            href="https://github.com/"
            isExternal
            fontSize="xs"
            color="text"
            opacity={0.85}
            _hover={{ textDecoration: "underline", opacity: 1 }}
          >
            GitHub
          </Link>
        </HStack>
      </HStack>
    </Box>
  );
}
