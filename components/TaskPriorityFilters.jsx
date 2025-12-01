"use client";

import { HStack, Button, Box } from "@chakra-ui/react";

const PRIORITY_FILTERS = ["All", "Critical", "High", "Medium", "Low"];

export default function TaskPriorityFilters({
  currentPriorityFilter,
  onChangePriorityFilter,
}) {
  return (
    <Box mb={3}>
      <HStack spacing={2}>
        {PRIORITY_FILTERS.map((priority) => {
          const isActive = currentPriorityFilter === priority;

          return (
            <Button
              key={priority}
              size="xs"
              variant={isActive ? "solid" : "ghost"}
              bg={isActive ? "#b5baff" : "transparent"}
              color={isActive ? "#1f2335" : "#4a4e62"}
              _hover={{
                bg: isActive ? "#a3a8f2" : "rgba(31, 35, 53, 0.06)",
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
