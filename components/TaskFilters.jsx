"use client";

import { Box, Text } from "@chakra-ui/react";

const FILTERS = ["All", "To Do", "In Progress", "Done"];

export default function TaskFilters({ currentFilter, onChangeFilter }) {
  return (
    <Box>
      <Text fontSize="xs" color="#6b708c" mb={1}>
        Status
      </Text>

      <Box
        as="select"
        value={currentFilter}
        onChange={(e) => onChangeFilter(e.target.value)}
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
        {FILTERS.map((filter) => (
          <option key={filter} value={filter}>
            {filter}
          </option>
        ))}
      </Box>
    </Box>
  );
}
