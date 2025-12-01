"use client";

import { HStack, Button, Box } from "@chakra-ui/react";

const FILTERS = ["All", "To Do", "In Progress", "Done"];

export default function TaskFilters({ currentFilter, onChangeFilter }) {
  return (
    <Box mb={3}>
      <HStack spacing={2}>
        {FILTERS.map((filter) => {
          const isActive = currentFilter === filter;

          return (
            <Button
              key={filter}
              size="xs"
              variant={isActive ? "solid" : "ghost"}
              bg={isActive ? "#1f2335" : "transparent"}
              color={isActive ? "#ffffff" : "#4a4e62"}
              _hover={{
                bg: isActive ? "#1b2033" : "rgba(31, 35, 53, 0.06)",
              }}
              onClick={() => onChangeFilter(filter)}
            >
              {filter}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}
