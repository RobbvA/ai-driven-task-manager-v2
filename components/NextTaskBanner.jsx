"use client";

import { Box, Text, HStack, Button, VStack } from "@chakra-ui/react";

export default function NextTaskBanner({ suggestedTask, onSuggestNext }) {
  // 1. Geen taken in de app:
  if (suggestedTask === null) {
    return (
      <VStack spacing={2} align="flex-start" w="100%">
        <Text fontSize="sm" color="#6b708c">
          No tasks available yet.
        </Text>
        <Button size="sm" onClick={onSuggestNext}>
          Try again
        </Button>
      </VStack>
    );
  }

  // 2. AI vindt geen geschikte task maar er bestaan wel tasks
  if (suggestedTask === false) {
    return (
      <VStack spacing={2} align="flex-start" w="100%">
        <Text fontSize="sm" color="#6b708c">
          AI couldn’t find a next task at the moment.
        </Text>
        <Button size="sm" onClick={onSuggestNext}>
          Try again
        </Button>
      </VStack>
    );
  }

  // 3. Normale manier: AI heeft een task gevonden
  return (
    <HStack w="100%" spacing={4} justify="space-between" align="center" p={2}>
      <VStack align="flex-start" spacing={0}>
        <Text fontSize="xs" color="#6b708c">
          Next suggested task:
        </Text>
        <Text fontSize="sm" fontWeight="semibold" color="#1f2335">
          {suggestedTask.title}
        </Text>
      </VStack>

      <Button size="sm" onClick={onSuggestNext}>
        Suggest again
      </Button>
    </HStack>
  );
}
