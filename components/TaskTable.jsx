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

// Priority colors
const priorityStyles = {
  Critical: { bg: "#ffe5ea", color: "#b3394a" },
  High: { bg: "#ffe9d6", color: "#b97228" },
  Medium: { bg: "#fff5cf", color: "#887626" },
  Low: { bg: "#eef1f5", color: "#4a4e62" },
};

// Status colors
const statusStyles = {
  "To Do": { bg: "#e8eafc", color: "#4a4e62" },
  "In Progress": { bg: "#dde3ff", color: "#374074" },
  Done: { bg: "#e3f5e7", color: "#2a7a3a" },
};

// Eén bron voor kolombreedtes → header & rows delen dit
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
  // welke task is "uitgeklapt"?
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // explainability dialog
  const [whyTask, setWhyTask] = useState(null);

  const handleRowClick = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const canExplain = (task) =>
    task?.prioritySource === "ai" &&
    task?.priorityReasons &&
    Array.isArray(task.priorityReasons);

  // Only show reasons that match the chosen priority category (coherent explainability)
  const reasonsForChosenPriority = useMemo(() => {
    if (!whyTask) return [];
    if (!Array.isArray(whyTask.priorityReasons)) return [];
    return whyTask.priorityReasons.filter(
      (r) => r?.category === whyTask.priority
    );
  }, [whyTask]);

  const scoreLabel =
    whyTask && typeof whyTask.priorityScore === "number"
      ? `${whyTask.priorityScore}/100`
      : "—";

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
          const p = priorityStyles[task.priority] || priorityStyles.Medium;
          const s = statusStyles[task.status] || statusStyles["To Do"];
          const isDone = task.status === "Done";
          const isHighlighted = highlightedTaskId === task.id;
          const isExpanded = expandedTaskId === task.id;

          return (
            <Box key={task.id}>
              {/* hoofd-rij */}
              <Box
                px={4}
                py={3}
                borderBottom="1px solid #e3e5f2"
                bg={
                  isHighlighted
                    ? "#e4f3ff"
                    : index % 2 === 0
                    ? "#ffffff"
                    : "#f7f8ff"
                }
                _hover={{ bg: isHighlighted ? "#d9ecff" : "#eef0ff" }}
                transition="background-color 0.15s ease-out, box-shadow 0.15s ease-out"
                boxShadow={isHighlighted ? "0 0 0 1px #4b9cff" : "none"}
                display="grid"
                gridTemplateColumns={GRID_TEMPLATE}
                columnGap={6}
                alignItems="flex-start"
                cursor="pointer"
                onClick={() => handleRowClick(task.id)}
              >
                {/* Task column */}
                <HStack spacing={3} align="flex-start" minW={0}>
                  <Box
                    w="10px"
                    h="10px"
                    borderRadius="full"
                    mt={1}
                    bg={
                      isDone
                        ? "#3fbf60"
                        : task.status === "In Progress"
                        ? "#b5baff"
                        : "#f4b000"
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

                    <Box
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      fontSize="xs"
                      bg={s.bg}
                      color={s.color}
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
                    h="6px"
                    bg="#e2e4f0"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      h="100%"
                      w={`${task.progress ?? 0}%`}
                      bg={isDone ? "#3fbf60" : "#b5baff"}
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
                      bg={p.bg}
                      color={p.color}
                      fontSize="xs"
                      textTransform="none"
                    >
                      {task.priority}
                    </Badge>
                    {task.prioritySource === "ai" && (
                      <Badge
                        px={2}
                        py={1}
                        borderRadius="md"
                        bg="#eef0ff"
                        color="#374074"
                        fontSize="xs"
                        textTransform="none"
                      >
                        AI
                      </Badge>
                    )}
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
                        _hover={{
                          bg: "#eef0ff",
                          color: "#374074",
                        }}
                        _active={{
                          transform: "scale(0.95)",
                        }}
                        title="Why did AI choose this?"
                      >
                        ?
                      </Box>
                    )}
                  </HStack>
                </Box>

                {/* Due column */}
                <Box mt={1}>
                  <Text
                    opacity={0.85}
                    minW="80px"
                    fontSize="sm"
                    color="#4a4e62"
                  >
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
                      e.stopPropagation(); // voorkom uitklappen
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
                      e.stopPropagation(); // voorkom uitklappen
                      onDeleteTask(task.id);
                    }}
                  >
                    Delete
                  </Button>
                </HStack>
              </Box>

              {/* detailblok onder de rij */}
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

      {/* Chakra v3 Dialog (replaces Modal) */}
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
                  {/* Top summary */}
                  <Box
                    border="1px solid #e3e5f2"
                    borderRadius="md"
                    p={3}
                    bg="#f7f8ff"
                  >
                    <HStack justify="space-between" align="flex-start">
                      <Box>
                        <Text fontSize="sm" color="#4a4e62">
                          <strong>Priority:</strong> {whyTask.priority}
                        </Text>
                        <Text fontSize="xs" color="#9aa0c3" mt={1}>
                          Model: {whyTask.priorityModelVersion || "—"}
                        </Text>
                      </Box>

                      <Badge
                        px={2}
                        py={1}
                        borderRadius="md"
                        bg="#eef0ff"
                        color="#374074"
                        fontSize="xs"
                        textTransform="none"
                      >
                        Score {scoreLabel}
                      </Badge>
                    </HStack>
                  </Box>

                  {/* Reasons (only the chosen category) */}
                  <Box>
                    <Text fontSize="xs" color="#9aa0c3" mb={2}>
                      Matched reasons (for {whyTask.priority})
                    </Text>

                    {reasonsForChosenPriority.length > 0 ? (
                      <VStack align="stretch" spacing={2}>
                        {reasonsForChosenPriority.map((r, idx) => (
                          <Box
                            key={`${r.ruleId || "rule"}-${idx}`}
                            border="1px solid #e3e5f2"
                            borderRadius="md"
                            p={3}
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
                        No reasons available for the chosen priority.
                      </Text>
                    )}
                  </Box>

                  <Text fontSize="xs" color="#9aa0c3">
                    Deterministic, rule-based suggestion. You can override
                    manually.
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
