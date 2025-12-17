"use client";

import { Box, Text } from "@chakra-ui/react";

const PRIORITY_FILTERS = ["All", "Critical", "High", "Medium", "Low"];

export default function TaskPriorityFilters({
  currentPriorityFilter,
  onChangePriorityFilter,
}) {
  return (
    <Box>
      <Text fontSize="xs" color="#6b708c" mb={1}>
        Priority
      </Text>

      <Box
        as="select"
        value={currentPriorityFilter}
        onChange={(e) => onChangePriorityFilter(e.target.value)}
        w="100%"
        h="36px"
        px={3}
        borderRadius="md"
        border="1px solid #dde2f2"
        bg="#ffffff"
        color="#1f2335"
        fontSize="sm"
        outline="none"
        _focus={{
          borderColor: "#b5baff",
          boxShadow: "0 0 0 3px rgba(181, 186, 255, 0.35)",
        }}
      >
        {PRIORITY_FILTERS.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </Box>
    </Box>
  );
}
