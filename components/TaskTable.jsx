// components/TaskTable.jsx
"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Badge,
  IconButton,
  Dialog,
  Flex,
  Button,
} from "@chakra-ui/react";
import { CheckCircle, Pencil, Trash2 } from "lucide-react";

const PRIORITY_STYLES = {
  Critical: {
    bg: "#fff1f2",
    color: "#9f1239",
    border: "#fecdd3",
    dot: "#e11d48",
    bar: "#fb7185",
  },
  High: {
    bg: "#fff7ed",
    color: "#9a3412",
    border: "#fed7aa",
    dot: "#f97316",
    bar: "#fdba74",
  },
  Medium: {
    bg: "#fefce8",
    color: "#854d0e",
    border: "#fde68a",
    dot: "#eab308",
    bar: "#facc15",
  },
  Low: {
    bg: "#f0fdf4",
    color: "#166534",
    border: "#bbf7d0",
    dot: "#22c55e",
    bar: "#86efac",
  },
};

const STATUS_STYLES = {
  "To Do": { bg: "#eef0ff", color: "#3b3f63", border: "#d7dcff" },
  "In Progress": { bg: "#e0e7ff", color: "#2b3a7a", border: "#c7d2fe" },
  Done: { bg: "#ecfdf5", color: "#166534", border: "#bbf7d0" },
};

export default function TaskTable({
  tasks,
  onToggleStatus,
  onDeleteTask,
  highlightedTaskId,
  onEditTask,
}) {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [whyTask, setWhyTask] = useState(null);

  const canExplain = (task) =>
    task?.prioritySource === "ai" &&
    Array.isArray(task?.priorityReasons) &&
    task.priorityReasons.length > 0;

  const reasonsForChosenPriority = useMemo(() => {
    if (!whyTask) return [];
    if (!Array.isArray(whyTask.priorityReasons)) return [];
    return whyTask.priorityReasons.filter(
      (r) => r?.category === whyTask.priority
    );
  }, [whyTask]);

  return (
    <Box
      bg="#ffffff"
      border="1px solid #e3e5f2"
      borderRadius="lg"
      overflow="hidden"
    >
      <VStack spacing={0} align="stretch">
        {tasks.map((task, index) => {
          const pr = PRIORITY_STYLES[task?.priority] || PRIORITY_STYLES.Medium;
          const st = STATUS_STYLES[task?.status] || STATUS_STYLES["To Do"];

          // Guaranteed-unique key for React reconciliation
          const key =
            task?.id ??
            `${task?.title ?? "task"}-${task?.createdAt ?? "no-date"}-${index}`;

          // Stable UI identifier even if id is missing (shouldn't happen, but defensive)
          const taskId = task?.id ?? key;

          const isDone = task?.status === "Done";
          const isHighlighted = highlightedTaskId === taskId;
          const isExpanded = expandedTaskId === taskId;

          const rowAccent = isDone ? "#22c55e" : pr.dot;

          return (
            <Box key={key}>
              <Box
                px={{ base: 4, md: 5 }}
                py={4}
                borderTop={index === 0 ? "none" : "1px solid #eef0ff"}
                position="relative"
                bg={isHighlighted ? "#eef7ff" : "#ffffff"}
                _hover={{ bg: isHighlighted ? "#e4f2ff" : "#f6f7ff" }}
                transition="background-color 0.15s ease-out"
                cursor="pointer"
                onClick={() => setExpandedTaskId(isExpanded ? null : taskId)}
              >
                <Box
                  position="absolute"
                  left="0"
                  top="0"
                  bottom="0"
                  w="4px"
                  bg={rowAccent}
                  opacity={0.6}
                />

                <Flex justify="space-between" align="flex-start" gap={4}>
                  <Box flex="1" minW={0}>
                    <Text
                      fontSize="sm"
                      fontWeight="700"
                      color="#1f2335"
                      as={isDone ? "s" : undefined}
                      opacity={isDone ? 0.6 : 1}
                      noOfLines={1}
                    >
                      {task?.title}
                    </Text>

                    <HStack spacing={2} mt={1} flexWrap="wrap">
                      <Box
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        fontSize="xs"
                        bg={st.bg}
                        color={st.color}
                        border="1px solid"
                        borderColor={st.border}
                      >
                        {task?.status}
                      </Box>

                      <Text fontSize="xs" color="#6b708c">
                        Progress{" "}
                        <Box as="span" fontWeight="700" color="#1f2335">
                          {typeof task?.progress === "number"
                            ? `${task.progress}%`
                            : "—"}
                        </Box>
                      </Text>

                      <Text fontSize="xs" color="#6b708c">
                        Due{" "}
                        <Box as="span" fontWeight="700" color="#1f2335">
                          {task?.dueDate || "—"}
                        </Box>
                      </Text>
                    </HStack>

                    <Box mt={2} maxW="520px">
                      <Box
                        h="6px"
                        bg="#e6e8f5"
                        borderRadius="full"
                        overflow="hidden"
                      >
                        <Box
                          h="100%"
                          w={`${task?.progress ?? 0}%`}
                          bg={isDone ? "#22c55e" : pr.bar}
                          borderRadius="full"
                          transition="width 0.2s ease-out"
                        />
                      </Box>
                    </Box>

                    {isExpanded && task?.description && (
                      <Box
                        mt={3}
                        p={3}
                        bg="#f7f8ff"
                        border="1px solid #e3e5f2"
                        borderRadius="md"
                      >
                        <Text fontSize="xs" color="#9aa0c3" mb={1}>
                          Description
                        </Text>
                        <Text
                          fontSize="sm"
                          color="#4a4e62"
                          whiteSpace="pre-wrap"
                        >
                          {task.description}
                        </Text>
                      </Box>
                    )}
                  </Box>

                  <VStack spacing={2} align="flex-end" flexShrink={0}>
                    <HStack spacing={2}>
                      <Badge
                        px={2.5}
                        py={1}
                        borderRadius="md"
                        bg={pr.bg}
                        color={pr.color}
                        border="1px solid"
                        borderColor={pr.border}
                        fontSize="xs"
                        textTransform="none"
                      >
                        {task?.priority}
                      </Badge>

                      {canExplain(task) && (
                        <Box
                          as="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWhyTask(task);
                          }}
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
                          title="Why this priority?"
                          aria-label="Why this priority?"
                        >
                          ?
                        </Box>
                      )}
                    </HStack>

                    {/* Actions: icon-only, ALWAYS visible (no Tooltip dependency) */}
                    <HStack spacing={1}>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        aria-label="Toggle task"
                        title="Toggle task"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!task?.id) return;
                          onToggleStatus(task.id);
                        }}
                        _hover={{ bg: "#eef0ff" }}
                      >
                        <CheckCircle size={16} />
                      </IconButton>

                      <IconButton
                        size="xs"
                        variant="ghost"
                        aria-label="Edit task"
                        title="Edit task"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!task?.id) return;
                          onEditTask?.(task);
                        }}
                        _hover={{ bg: "#eef0ff" }}
                      >
                        <Pencil size={16} />
                      </IconButton>

                      <IconButton
                        size="xs"
                        variant="ghost"
                        aria-label="Delete task"
                        title="Delete task"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!task?.id) return;
                          onDeleteTask(task.id);
                        }}
                        color="#b3394a"
                        _hover={{ bg: "#fff1f2" }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </HStack>
                  </VStack>
                </Flex>
              </Box>
            </Box>
          );
        })}
      </VStack>

      {/* Priority explainability Dialog (Chakra v3) */}
      <Dialog.Root
        open={!!whyTask}
        onOpenChange={(details) => {
          if (!details.open) setWhyTask(null);
        }}
        size="lg"
        placement="center"
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>AI Priority Explanation</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {whyTask && (
                <VStack align="stretch" spacing={3}>
                  <Box
                    border="1px solid #e3e5f2"
                    borderRadius="md"
                    p={3}
                    bg="#f7f8ff"
                  >
                    <Text fontSize="sm" color="#4a4e62">
                      <strong>Priority:</strong> {whyTask.priority}
                    </Text>
                    <Text fontSize="sm" color="#4a4e62">
                      <strong>Score:</strong>{" "}
                      {typeof whyTask.priorityScore === "number"
                        ? `${whyTask.priorityScore}/100`
                        : "—"}
                    </Text>
                    <Text fontSize="xs" color="#9aa0c3">
                      Model: {whyTask.priorityModelVersion || "—"}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="#9aa0c3" mb={2}>
                      Matched reasons
                    </Text>

                    {reasonsForChosenPriority.length > 0 ? (
                      <VStack align="stretch" spacing={2}>
                        {reasonsForChosenPriority.map((r, idx) => (
                          <Box
                            key={`${r?.ruleId || "rule"}-${idx}`}
                            border="1px solid #e3e5f2"
                            borderRadius="md"
                            p={3}
                            bg="#ffffff"
                          >
                            <Text fontSize="sm" color="#1e2235">
                              {r?.rationale || "Matched rule"}
                            </Text>
                            <Text fontSize="xs" color="#9aa0c3">
                              Rule: {r?.ruleId} • Keyword: {r?.keyword} •
                              Weight: {r?.weight}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Text fontSize="sm" color="#4a4e62">
                        No reasons stored for this priority.
                      </Text>
                    )}
                  </Box>

                  <Text fontSize="xs" color="#9aa0c3">
                    Deterministic rules. You can override priority manually.
                  </Text>
                </VStack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={() => setWhyTask(null)}>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
