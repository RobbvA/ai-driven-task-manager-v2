"use client";

import { HStack, Button, Box } from "@chakra-ui/react";

const PRIORITY_FILTERS = ["All", "Critical", "High", "Medium", "Low"];

export default function TaskPriorityFilters({
  currentPriorityFilter,
  onChangePriorityFilter,
}) {
  return (
    <Box>
      <HStack spacing={2} flexWrap="wrap">
        {PRIORITY_FILTERS.map((priority) => {
          const isActive = currentPriorityFilter === priority;

          return (
            <Button
              key={priority}
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
              onClick={() => onChangePriorityFilter(priority)}
            >
              {priority}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}
