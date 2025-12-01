"use client";

import { Box, HStack, VStack, Text, Badge, Button } from "@chakra-ui/react";

export default function NextTaskBanner({ suggestedTask, onSuggestNext }) {
  return (
    <Box mb={4} p={3} borderRadius="lg" border="1px solid #d5d8e4" bg="#f5f7ff">
      <HStack justify="space-between" align="flex-start" spacing={4}>
        <VStack align="flex-start" spacing={1}>
          <Text
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="0.12em"
            color="#8589ab"
          >
            AI Suggestion
          </Text>

          {suggestedTask ? (
            <>
              <Text fontSize="sm" fontWeight="semibold" color="#1f2335">
                {suggestedTask.title}
              </Text>

              {suggestedTask.description && (
                <Text fontSize="xs" color="#6b708c" noOfLines={2} maxW="420px">
                  {suggestedTask.description}
                </Text>
              )}

              <HStack spacing={2}>
                <Badge
                  bg="#e8eafc"
                  color="#4a4e62"
                  fontSize="xs"
                  textTransform="none"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                >
                  {suggestedTask.status}
                </Badge>
                <Badge
                  bg="#fff5cf"
                  color="#887626"
                  fontSize="xs"
                  textTransform="none"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                >
                  {suggestedTask.priority}
                </Badge>
              </HStack>
            </>
          ) : (
            <Text fontSize="sm" color="#6b708c">
              Let AI pick the next best task to focus on.
            </Text>
          )}
        </VStack>

        <Button size="sm" onClick={onSuggestNext}>
          Suggest next task
        </Button>
      </HStack>
    </Box>
  );
}
