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
      borderBottom="1px solid #1B1D23"
      bg="#050509"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Heading size="md">AI Driven Task Manager</Heading>

      <HStack spacing={3}>
        <IconButton
          aria-label="Search tasks"
          icon={<FiSearch />}
          variant="ghost"
          size="sm"
        />
        <IconButton
          aria-label="Filter tasks"
          icon={<FiFilter />}
          variant="ghost"
          size="sm"
        />

        {/* Fake avatar + naam */}
        <HStack spacing={2}>
          <Box w="32px" h="32px" borderRadius="full" bg="gray.600" />
          <Text fontSize="sm" color="gray.200">
            dev.robb
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
}
