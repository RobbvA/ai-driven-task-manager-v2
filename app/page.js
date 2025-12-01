"use client";

import { useState } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import Topbar from "../components/Topbar";
import TaskTable from "../components/TaskTable";
import { initialTasks } from "../data/tasks";

export default function HomePage() {
  // Local state for all tasks on the dashboard
  const [tasks, setTasks] = useState(initialTasks);

  // Toggle a task between "To Do" and "Done"
  // (simple version for now – we can expand later)
  const handleToggleStatus = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "Done" ? "To Do" : "Done",
              progress: task.status === "Done" ? 0 : 100,
            }
          : task
      )
    );
  };

  // Remove a task from the list
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <Box minH="100vh" bg="#e9ecf5">
      <Topbar />
      <Box as="main" px={6} py={6} maxW="1100px" mx="auto">
        <VStack align="flex-start" spacing={2} mb={6}>
          <Heading size="lg" color="#1f2335">
            Tasks overview
          </Heading>
          <Text fontSize="sm" color="#6b708c">
            Calm, focused overview of what matters most today.
          </Text>
        </VStack>

        <TaskTable
          tasks={tasks}
          onToggleStatus={handleToggleStatus}
          onDeleteTask={handleDeleteTask}
        />
      </Box>
    </Box>
  );
}
