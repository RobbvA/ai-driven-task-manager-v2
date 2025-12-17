"use client";

import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { ArrowUp, ArrowDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "none", label: "No sort" },
  { value: "priority", label: "Priority" },
  { value: "dueDate", label: "Due date" },
  { value: "progress", label: "Progress" },
];

export default function TaskSortBar({
  sortBy,
  sortDirection,
  onChangeSortBy,
  onToggleDirection,
}) {
  const isSorting = sortBy !== "none";

  return (
    <Box>
      <Text fontSize="xs" color="#6b708c" mb={1}>
        Sort
      </Text>

      <HStack spacing={2} align="center">
        <Box
          as="select"
          value={sortBy}
          onChange={(e) => onChangeSortBy(e.target.value)}
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
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Box>

        {/* Direction toggle only when sorting is active */}
        <IconButton
          aria-label="Toggle sort direction"
          size="sm"
          variant="ghost"
          onClick={onToggleDirection}
          isDisabled={!isSorting}
          _hover={{ bg: isSorting ? "#eef0ff" : "transparent" }}
        >
          {sortDirection === "asc" ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}
        </IconButton>
      </HStack>

      <Text fontSize="xs" color="#9aa0c3" mt={1}>
        {sortBy === "none" ? "No sorting applied" : `Sorting: ${sortDirection}`}
      </Text>
    </Box>
  );
}
