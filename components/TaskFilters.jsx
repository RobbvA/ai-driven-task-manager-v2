"use client";

import { HStack, Button, Box } from "@chakra-ui/react";

const FILTERS = ["All", "To Do", "In Progress", "Done"];

export default function TaskFilters({ currentFilter, onChangeFilter }) {
  return (
    <Box>
      <HStack spacing={2} flexWrap="wrap">
        {FILTERS.map((filter) => {
          const isActive = currentFilter === filter;

          return (
            <Button
              key={filter}
              size="xs"
              borderRadius="full"
              variant="solid"
              bg={isActive ? "brand.500" : "brand.50"}
              color={isActive ? "white" : "text"}
              border="1px solid"
              borderColor={isActive ? "brand.500" : "border"}
              _hover={{
                bg: isActive ? "brand.600" : "brand.100",
              }}
              _active={{
                transform: "scale(0.98)",
              }}
              _focusVisible={{
                boxShadow: "0 0 0 3px var(--chakra-colors-brand-200)",
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
