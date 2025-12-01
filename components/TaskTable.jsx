"use client";

import { Box, Text, HStack, VStack, Badge, Button } from "@chakra-ui/react";

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

export default function TaskTable({ tasks, onToggleStatus, onDeleteTask }) {
  return (
    <Box
      bg="#ffffff"
      border="1px solid #d5d8e4"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="0 14px 30px rgba(15, 23, 42, 0.08)"
    >
      {/* Header row */}
      <Box px={4} py={3} borderBottom="1px solid #d5d8e4" bg="#f2f4ff">
        <HStack justify="space-between" spacing={6}>
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
          >
            Actions
          </Text>
        </HStack>
      </Box>

      {/* Rows */}
      <VStack spacing={0} w="100%" align="stretch">
        {tasks.map((task, index) => {
          const p = priorityStyles[task.priority] || priorityStyles.Medium;
          const s = statusStyles[task.status] || statusStyles["To Do"];
          const isDone = task.status === "Done";

          return (
            <Box
              key={task.id}
              px={4}
              py={3}
              borderBottom="1px solid #e3e5f2"
              bg={index % 2 === 0 ? "#ffffff" : "#f7f8ff"}
              _hover={{ bg: "#eef0ff" }}
              transition="background-color 0.15s ease-out"
            >
              <HStack justify="space-between" align="flex-start" spacing={6}>
                {/* Task + description + status dot */}
                <HStack spacing={3} minW="260px" align="flex-start">
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
                  />

                  <VStack spacing={1} align="flex-start">
                    <Text
                      fontSize="sm"
                      as={isDone ? "s" : undefined}
                      opacity={isDone ? 0.6 : 1}
                      color="#1e2235"
                    >
                      {task.title}
                    </Text>

                    {task.description && (
                      <Text
                        fontSize="xs"
                        color="#6b708c"
                        opacity={isDone ? 0.6 : 1}
                        noOfLines={2}
                        maxW="360px"
                      >
                        {task.description}
                      </Text>
                    )}

                    <HStack spacing={2}>
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
                    </HStack>
                  </VStack>
                </HStack>

                {/* Progress bar */}
                <Box w="180px" mt={1}>
                  <Box
                    w="100%"
                    h="6px"
                    bg="#e2e4f0"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      h="100%"
                      w={`${task.progress}%`}
                      bg={isDone ? "#3fbf60" : "#b5baff"}
                      borderRadius="full"
                      transition="width 0.2s ease-out"
                    />
                  </Box>
                </Box>

                {/* Priority */}
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

                {/* Due date */}
                <Text
                  opacity={0.85}
                  minW="80px"
                  textAlign="center"
                  fontSize="sm"
                  color="#4a4e62"
                >
                  {task.dueDate}
                </Text>

                {/* Actions */}
                <HStack spacing={2} mt={1}>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="#4a4e62"
                    onClick={() => onToggleStatus(task.id)}
                  >
                    Toggle
                  </Button>

                  <Button
                    size="xs"
                    variant="ghost"
                    color="#b3394a"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
