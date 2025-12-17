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
    <Box>
      <HStack spacing={3} align="center" flexWrap="wrap">
        <Text fontSize="xs" color="muted">
          Sort
        </Text>

        <HStack spacing={2} flexWrap="wrap">
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortBy === opt.value;

            return (
              <Button
                key={opt.value}
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
                onClick={() => onChangeSortBy(opt.value)}
              >
                {opt.label}
              </Button>
            );
          })}
        </HStack>

        {sortBy !== "none" && (
          <IconButton
            aria-label="Toggle sort direction"
            size="xs"
            variant="solid"
            borderRadius="full"
            bg="brand.50"
            color="text"
            border="1px solid"
            borderColor="border"
            _hover={{ bg: "brand.100" }}
            _active={{ transform: "scale(0.98)" }}
            _focusVisible={{
              boxShadow: "0 0 0 3px var(--chakra-colors-brand-200)",
            }}
            onClick={onToggleDirection}
          >
            {arrow}
          </IconButton>
        )}

        <Text fontSize="xs" color="muted">
          {sortBy === "none"
            ? "No sorting"
            : `${currentLabel} (${sortDirection})`}
        </Text>
      </HStack>
    </Box>
  );
}
