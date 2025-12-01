"use client";

import { HStack, Button, Box, Text, IconButton } from "@chakra-ui/react";

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
  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "No sort";

  const arrow = sortDirection === "asc" ? "↑" : "↓";

  return (
    <Box mb={3}>
      <HStack spacing={3} align="center">
        <Text fontSize="xs" color="#6b708c">
          Sort:
        </Text>

        <HStack spacing={1}>
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortBy === opt.value;
            return (
              <Button
                key={opt.value}
                size="xs"
                variant={isActive ? "solid" : "ghost"}
                bg={isActive ? "#1f2335" : "transparent"}
                color={isActive ? "#ffffff" : "#4a4e62"}
                _hover={{
                  bg: isActive ? "#1b2033" : "rgba(31, 35, 53, 0.06)",
                }}
                onClick={() => onChangeSortBy(opt.value)}
              >
                {opt.label}
              </Button>
            );
          })}
        </HStack>

        {/* Direction toggle (hidden when sortBy = none) */}
        {sortBy !== "none" && (
          <IconButton
            aria-label="Toggle sort direction"
            size="xs"
            variant="ghost"
            onClick={onToggleDirection}
          >
            {arrow}
          </IconButton>
        )}

        <Text fontSize="xs" color="#a1a4c0">
          {sortBy === "none"
            ? "No sorting applied"
            : `${currentLabel} (${sortDirection})`}
        </Text>
      </HStack>
    </Box>
  );
}
