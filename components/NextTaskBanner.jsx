"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Badge,
  Dialog,
} from "@chakra-ui/react";

export default function NextTaskBanner({
  aiState,
  suggestedTask,
  onSuggestNext,
  nextExplainability,
}) {
  const [isWhyOpen, setIsWhyOpen] = useState(false);

  const hasTask =
    suggestedTask &&
    typeof suggestedTask === "object" &&
    typeof suggestedTask.title === "string" &&
    suggestedTask.title.trim().length > 0;

  const reasons = useMemo(() => {
    if (!nextExplainability || !Array.isArray(nextExplainability.reasons))
      return [];
    return [...nextExplainability.reasons].sort(
      (a, b) => Math.abs(b.weight ?? 0) - Math.abs(a.weight ?? 0)
    );
  }, [nextExplainability]);

  const canExplain = hasTask && reasons.length > 0;
  const topReasons = useMemo(() => reasons.slice(0, 3), [reasons]);

  if (isWhyOpen && !canExplain) setIsWhyOpen(false);

  if (aiState === "no-tasks") {
    return (
      <VStack spacing={2} align="flex-start" w="100%">
        <Text fontSize="sm" color="#6b708c">
          No tasks yet. Add a task first, then I can suggest what to do next.
        </Text>
        <Button size="sm" onClick={onSuggestNext} borderRadius="full">
          Try again
        </Button>
      </VStack>
    );
  }

  if (aiState === "no-suggestion" || !hasTask) {
    return (
      <VStack spacing={2} align="flex-start" w="100%">
        <Text fontSize="sm" color="#6b708c">
          AI couldn’t find a strong next task right now.
        </Text>
        <Button size="sm" onClick={onSuggestNext} borderRadius="full">
          Re-run suggestion
        </Button>
      </VStack>
    );
  }

  return (
    <VStack spacing={3} align="flex-start" w="100%">
      <HStack spacing={2} align="center" w="100%" justify="space-between">
        <HStack spacing={2} align="center" minW={0}>
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

          <Text fontSize="md" color="#1f2335" fontWeight="700" noOfLines={1}>
            {suggestedTask.title}
          </Text>
        </HStack>

        <HStack spacing={2}>
          {typeof nextExplainability?.score === "number" && (
            <Text fontSize="xs" color="#6b708c" whiteSpace="nowrap">
              Score{" "}
              <Box as="span" fontWeight="700" color="#1f2335">
                {nextExplainability.score}/100
              </Box>
            </Text>
          )}

          {canExplain && (
            <Box
              as="button"
              onClick={() => setIsWhyOpen(true)}
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w="24px"
              h="24px"
              borderRadius="full"
              border="1px solid #dde2f2"
              bg="#ffffff"
              color="#4a4e62"
              fontSize="xs"
              fontWeight="bold"
              cursor="pointer"
              _hover={{ bg: "#eef0ff", color: "#374074" }}
              _active={{ transform: "scale(0.96)" }}
              title="Why this task?"
              aria-label="Why this task?"
            >
              ?
            </Box>
          )}
        </HStack>
      </HStack>

      <Text fontSize="sm" color="#6b708c">
        Priority{" "}
        <Box as="span" fontWeight="700" color="#1f2335">
          {suggestedTask.priority || "—"}
        </Box>{" "}
        • Progress{" "}
        <Box as="span" fontWeight="700" color="#1f2335">
          {typeof suggestedTask.progress === "number"
            ? `${suggestedTask.progress}%`
            : "—"}
        </Box>
        {suggestedTask.dueDate ? (
          <>
            {" "}
            • Due{" "}
            <Box as="span" fontWeight="700" color="#1f2335">
              {suggestedTask.dueDate}
            </Box>
          </>
        ) : null}
      </Text>

      {topReasons.length > 0 && (
        <HStack spacing={2} flexWrap="wrap">
          {topReasons.map((r, idx) => (
            <Box
              key={`${r.ruleId || "rule"}-${idx}`}
              border="1px solid #e3e5f2"
              bg="#ffffff"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              color="#4a4e62"
              maxW="100%"
            >
              {r.rationale}
            </Box>
          ))}
        </HStack>
      )}

      <HStack spacing={2}>
        <Button size="sm" borderRadius="full" onClick={onSuggestNext}>
          Re-run
        </Button>
      </HStack>

      <Dialog.Root
        open={isWhyOpen}
        onOpenChange={(details) => {
          if (!details.open) setIsWhyOpen(false);
        }}
        size="lg"
        placement="center"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Why this task?</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack align="stretch" spacing={3}>
                <Box
                  border="1px solid #e3e5f2"
                  borderRadius="md"
                  p={3}
                  bg="#f7f8ff"
                >
                  <Text fontSize="sm" color="#4a4e62">
                    <strong>Selected task:</strong> {suggestedTask.title}
                  </Text>
                  <Text fontSize="xs" color="#9aa0c3" mt={1}>
                    Model: {nextExplainability?.modelVersion || "—"} • Score:{" "}
                    {typeof nextExplainability?.score === "number"
                      ? `${nextExplainability.score}/100`
                      : "—"}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="#9aa0c3" mb={2}>
                    Matched signals
                  </Text>

                  {reasons.length > 0 ? (
                    <VStack align="stretch" spacing={2}>
                      {reasons.map((r, idx) => (
                        <Box
                          key={`${r.ruleId || "rule"}-${idx}`}
                          border="1px solid #e3e5f2"
                          borderRadius="md"
                          p={3}
                          bg="#ffffff"
                        >
                          <Text fontSize="sm" color="#1e2235">
                            {r.rationale}
                          </Text>
                          <Text fontSize="xs" color="#9aa0c3">
                            Rule: {r.ruleId} • Weight: {r.weight}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="sm" color="#4a4e62">
                      No reasons available.
                    </Text>
                  )}
                </Box>

                {nextExplainability?.summary ? (
                  <Text fontSize="xs" color="#9aa0c3">
                    {nextExplainability.summary}
                  </Text>
                ) : null}

                <Text fontSize="xs" color="#9aa0c3">
                  Deterministic rules. You can re-run or override by updating
                  task fields.
                </Text>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={() => setIsWhyOpen(false)}>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </VStack>
  );
}
