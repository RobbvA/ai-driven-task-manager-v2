"use client";

import { Box, Text, HStack, VStack, Badge } from "@chakra-ui/react";

export default function TaskTable() {
  const tasks = [
    {
      id: 1,
      name: "Design login page",
      assigned: "R",
      status: "In Progress",
      progress: 45,
      priority: "High",
      due: "Tomorrow",
    },
    {
      id: 2,
      name: "Implement authentication",
      assigned: "A",
      status: "To Do",
      progress: 0,
      priority: "Medium",
      due: "Dec 3",
    },
    {
      id: 3,
      name: "Fix API errors",
      assigned: "D",
      status: "Done",
      progress: 100,
      priority: "Critical",
      due: "Today",
    },
  ];

  return (
    <VStack spacing={0} w="100%" align="stretch">
      {tasks.map((task) => (
        <Box
          key={task.id}
          px={4}
          py={3}
          borderBottom="1px solid #1B1D23"
          _hover={{ bg: "#0F1117" }}
        >
          <HStack justify="space-between" align="center" spacing={6}>
            {/* Task name + assigned circle */}
            <HStack spacing={3} minW="260px">
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg={task.status === "Done" ? "green.400" : "yellow.400"}
              />
              <Text>{task.name}</Text>
              <Box
                w="26px"
                h="26px"
                borderRadius="full"
                bg="#2A2D36"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="sm"
              >
                {task.assigned}
              </Box>
            </HStack>

            {/* Progress bar (zelfgemaakt i.p.v. <Progress />) */}
            <Box w="150px">
              <Box
                w="100%"
                h="6px"
                bg="#1B1D23"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  h="100%"
                  w={`${task.progress}%`}
                  bg={task.progress === 100 ? "green.400" : "blue.400"}
                  borderRadius="full"
                  transition="width 0.2s ease-out"
                />
              </Box>
            </Box>

            {/* Priority badge */}
            <Badge
              px={3}
              py={1}
              borderRadius="md"
              colorPalette={
                task.priority === "Critical"
                  ? "red"
                  : task.priority === "High"
                  ? "orange"
                  : "yellow"
              }
            >
              {task.priority}
            </Badge>

            {/* Due date */}
            <Text opacity={0.8} minW="80px" textAlign="right">
              {task.due}
            </Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
