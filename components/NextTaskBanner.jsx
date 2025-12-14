"use client";

import { Box, Button, HStack, Text, VStack, Badge } from "@chakra-ui/react";

export default function NextTaskBanner({
  aiState,
  suggestedTask,
  onSuggestNext,
}) {
  // Normalize: suggestedTask must be an object to be "valid"
  const hasTask =
    suggestedTask &&
    typeof suggestedTask === "object" &&
    typeof suggestedTask.title === "string" &&
    suggestedTask.title.trim().length > 0;

  // States where we should not try to render task fields
  const isEmptyState =
    aiState === "no-tasks" || aiState === "no-suggestion" || !hasTask;

  if (aiState === "no-tasks") {
    return (
      <VStack spacing={2} align="flex-start" w="100%">
        <Text fontSize="sm" color="#6b708c">
          No tasks yet. Add a task first, then I can suggest what to do next.
        </Text>
        <Button size="sm" onClick={onSuggestNext}>
          Try again
        </Button>
      </VStack>
    );
  }

  if (aiState === "no-suggestion" || aiState === "no-tasks" || isEmptyState) {
    return (
      <VStack spacing={2} align="flex-start" w="100%">
        <Text fontSize="sm" color="#6b708c">
          AI couldn’t find a next task at the moment.
        </Text>
        <Button size="sm" onClick={onSuggestNext}>
          Re-run suggestion
        </Button>
      </VStack>
    );
  }

  // aiState "ok" (or any future state) + we have a valid task object
  return (
    <VStack spacing={3} align="flex-start" w="100%">
      <HStack spacing={2} align="center">
        <Badge
          px={2}
          py={1}
          borderRadius="md"
          bg="#eef0ff"
          color="#374074"
          fontSize="xs"
          textTransform="none"
        >
          Suggested
        </Badge>

        <Text fontSize="sm" color="#1f2335" fontWeight="600" noOfLines={1}>
          {suggestedTask.title}
        </Text>
      </HStack>

      <Box>
        <Text fontSize="xs" color="#6b708c">
          Priority:{" "}
          <Box as="span" fontWeight="600" color="#1f2335">
            {suggestedTask.priority || "—"}
          </Box>{" "}
          • Progress:{" "}
          <Box as="span" fontWeight="600" color="#1f2335">
            {typeof suggestedTask.progress === "number"
              ? `${suggestedTask.progress}%`
              : "—"}
          </Box>
          {suggestedTask.dueDate ? (
            <>
              {" "}
              • Due:{" "}
              <Box as="span" fontWeight="600" color="#1f2335">
                {suggestedTask.dueDate}
              </Box>
            </>
          ) : null}
        </Text>
      </Box>

      <HStack spacing={2}>
        <Button size="sm" onClick={onSuggestNext}>
          Re-run
        </Button>
      </HStack>
    </VStack>
  );
}
