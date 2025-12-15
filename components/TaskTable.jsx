"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Dialog,
} from "@chakra-ui/react";

// Subtle accent palette (soft, non-screamy)
const PRIORITY_STYLES = {
  Critical: {
    bg: "#fff1f2", // rose-50
    color: "#9f1239", // rose-800
    border: "#fecdd3", // rose-200
    dot: "#e11d48", // rose-600
    bar: "#fb7185", // rose-400
  },
  High: {
    bg: "#fff7ed", // orange-50
    color: "#9a3412", // orange-800
    border: "#fed7aa", // orange-200
    dot: "#f97316", // orange-500
    bar: "#fdba74", // orange-300/400-ish
  },
  Medium: {
    bg: "#fefce8", // yellow-50
    color: "#854d0e", // yellow-800
    border: "#fde68a", // yellow-200
    dot: "#eab308", // yellow-500
    bar: "#facc15", // yellow-400/500
  },
  Low: {
    bg: "#f0fdf4", // green-50
    color: "#166534", // green-800
    border: "#bbf7d0", // green-200
    dot: "#22c55e", // green-500
    bar: "#86efac", // green-300/400
  },
};

// Status colors stay calm, but slightly clearer
const STATUS_STYLES = {
  "To Do": { bg: "#eef0ff", color: "#3b3f63", border: "#d7dcff" },
  "In Progress": { bg: "#e0e7ff", color: "#2b3a7a", border: "#c7d2fe" },
  Done: { bg: "#ecfdf5", color: "#166534", border: "#bbf7d0" },
};

// Shared grid template
const GRID_TEMPLATE = {
  base: "minmax(0, 3fr) minmax(0, 2fr) minmax(0, 1.6fr) minmax(0, 1.4fr) minmax(0, 1.8fr)",
  md: "minmax(0, 3fr) minmax(0, 2fr) minmax(0, 1.6fr) minmax(0, 1.4fr) minmax(0, 1.8fr)",
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

  const handleRowClick = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const canExplain = (task) =>
    task?.prioritySource === "ai" &&
    Array.isArray(task?.priorityReasons) &&
    task.priorityReasons.length > 0;

  // Only show reasons that match the chosen priority (prevents confusing mixed buckets)
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
      border="1px solid #d5d8e4"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="0 14px 30px rgba(15, 23, 42, 0.08)"
    >
      {/* Header row */}
      <Box
        px={4}
        py={3}
        borderBottom="1px solid #d5d8e4"
        bg="#f2f4ff"
        display="grid"
        gridTemplateColumns={GRID_TEMPLATE}
        columnGap={6}
        alignItems="center"
      >
        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.12em"
          color="#8589ab"
        >
          Task
        </Text>

        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.12em"
          color="#a1a4c0"
        >
          Progress
        </Text>

        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.12em"
          color="#a1a4c0"
        >
          Priority
        </Text>

        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.12em"
          color="#a1a4c0"
        >
          Due
        </Text>

        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.12em"
          color="#a1a4c0"
          textAlign="right"
        >
          Actions
        </Text>
      </Box>

      {/* Rows */}
      <Box as="div">
        {tasks.map((task, index) => {
          const pr = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
          const st = STATUS_STYLES[task.status] || STATUS_STYLES["To Do"];

          const isDone = task.status === "Done";
          const isHighlighted = highlightedTaskId === task.id;
          const isExpanded = expandedTaskId === task.id;

          // Row accent: subtle left strip ties to priority
          const rowAccent = isDone ? "#22c55e" : pr.dot;

          return (
            <Box key={task.id}>
              {/* main row */}
              <Box
                px={4}
                py={3}
                borderBottom="1px solid #e3e5f2"
                position="relative"
                bg={
                  isHighlighted
                    ? "#eef7ff"
                    : index % 2 === 0
                    ? "#ffffff"
                    : "#f7f8ff"
                }
                _hover={{ bg: isHighlighted ? "#e4f2ff" : "#eef0ff" }}
                transition="background-color 0.15s ease-out, box-shadow 0.15s ease-out"
                boxShadow={isHighlighted ? "0 0 0 1px #93c5fd" : "none"}
                display="grid"
                gridTemplateColumns={GRID_TEMPLATE}
                columnGap={6}
                alignItems="flex-start"
                cursor="pointer"
                onClick={() => handleRowClick(task.id)}
              >
                {/* Left accent strip */}
                <Box
                  position="absolute"
                  left="0"
                  top="0"
                  bottom="0"
                  w="4px"
                  bg={rowAccent}
                  opacity={isHighlighted ? 0.9 : 0.55}
                />

                {/* Task column */}
                <HStack spacing={3} align="flex-start" minW={0}>
                  {/* status dot */}
                  <Box
                    w="10px"
                    h="10px"
                    borderRadius="full"
                    mt={1}
                    bg={
                      isDone
                        ? "#22c55e"
                        : task.status === "In Progress"
                        ? "#6366f1"
                        : "#f59e0b"
                    }
                    flexShrink={0}
                  />

                  <VStack spacing={1} align="flex-start" minW={0}>
                    <Text
                      fontSize="sm"
                      as={isDone ? "s" : undefined}
                      opacity={isDone ? 0.6 : 1}
                      color="#1e2235"
                      noOfLines={1}
                    >
                      {task.title}
                    </Text>

                    {/* Status pill (now with border for clarity) */}
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
                      {task.status}
                    </Box>

                    {task.description && (
                      <Text fontSize="xs" color="#a1a4c0" mt={0.5}>
                        {isExpanded
                          ? "Click to hide details"
                          : "Click to view full description"}
                      </Text>
                    )}
                  </VStack>
                </HStack>

                {/* Progress column */}
                <Box mt={1} minW={0}>
                  <Box
                    w="100%"
                    h="7px"
                    bg="#e2e4f0"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      h="100%"
                      w={`${task.progress ?? 0}%`}
                      bg={isDone ? "#22c55e" : pr.bar}
                      borderRadius="full"
                      transition="width 0.2s ease-out"
                    />
                  </Box>
                </Box>

                {/* Priority column */}
                <Box mt={1}>
                  <HStack spacing={2}>
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="md"
                      bg={pr.bg}
                      color={pr.color}
                      border="1px solid"
                      borderColor={pr.border}
                      fontSize="xs"
                      textTransform="none"
                    >
                      {task.priority}
                    </Badge>

                    {/* compact "?" icon — consistent with next task */}
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
                        w="22px"
                        h="22px"
                        borderRadius="full"
                        border="1px solid #dde2f2"
                        bg="#ffffff"
                        color="#4a4e62"
                        fontSize="xs"
                        fontWeight="bold"
                        cursor="pointer"
                        _hover={{ bg: "#eef0ff", color: "#374074" }}
                        _active={{ transform: "scale(0.95)" }}
                        title="Why this priority?"
                        aria-label="Why this priority?"
                      >
                        ?
                      </Box>
                    )}
                  </HStack>
                </Box>

                {/* Due column */}
                <Box mt={1}>
                  <Text opacity={0.9} minW="80px" fontSize="sm" color="#4a4e62">
                    {task.dueDate || "—"}
                  </Text>
                </Box>

                {/* Actions column */}
                <HStack spacing={2} mt={1} justify="flex-end" align="center">
                  <Button
                    size="xs"
                    variant="ghost"
                    color="#4a4e62"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(task.id);
                    }}
                  >
                    Toggle
                  </Button>

                  <Button
                    size="xs"
                    variant="ghost"
                    color="#4a4e62"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEditTask) onEditTask(task);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="xs"
                    variant="ghost"
                    color="#b3394a"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                  >
                    Delete
                  </Button>
                </HStack>
              </Box>

              {/* detail block */}
              {isExpanded && task.description && (
                <Box
                  px={4}
                  pb={3}
                  bg="#f5f6ff"
                  borderBottom="1px solid #e3e5f2"
                >
                  <Text fontSize="xs" color="#9aa0c3" mb={1}>
                    Description
                  </Text>
                  <Text fontSize="sm" color="#4a4e62" whiteSpace="pre-wrap">
                    {task.description}
                  </Text>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

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
                            key={`${r.ruleId || "rule"}-${idx}`}
                            border="1px solid #e3e5f2"
                            borderRadius="md"
                            p={3}
                            bg="#ffffff"
                          >
                            <Text fontSize="sm" color="#1e2235">
                              {r.rationale || "Matched rule"}
                            </Text>
                            <Text fontSize="xs" color="#9aa0c3">
                              Rule: {r.ruleId} • Keyword: {r.keyword} • Weight:{" "}
                              {r.weight}
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
