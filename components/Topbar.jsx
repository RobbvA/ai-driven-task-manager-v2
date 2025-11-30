"use client";

import { Flex, Heading, HStack, IconButton, Box, Text } from "@chakra-ui/react";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function Topbar() {
  return (
    <Flex
      as="header"
      h="64px"
      align="center"
      justify="space-between"
      px={6}
      borderBottom="1px solid #d5d8e4"
      bg="#f7f8fc" // cool white-blue
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Heading size="md" color="#1e2235">
        AI Driven Task Manager
      </Heading>

      <HStack spacing={4}>
        <IconButton
          aria-label="Search tasks"
          icon={<FiSearch />}
          variant="ghost"
          size="sm"
          color="gray.500"
          _hover={{ bg: "#e2e6ff", color: "#1e2235" }}
        />

        <IconButton
          aria-label="Filter tasks"
          icon={<FiFilter />}
          variant="ghost"
          size="sm"
          color="gray.500"
          _hover={{ bg: "#e2e6ff", color: "#1e2235" }}
        />

        <HStack spacing={2}>
          <Box
            w="28px"
            h="28px"
            borderRadius="full"
            bg="#b5baff33"
            border="1px solid #b5baff"
          />
          <Text fontSize="sm" color="#4a4e62">
            dev.robb
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
}
