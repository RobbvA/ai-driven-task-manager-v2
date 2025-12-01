"use client";

import { useState } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import Topbar from "../components/Topbar";
import TaskTable from "../components/TaskTable";
import AddTaskBar from "../components/AddTaskBar";
import TaskFilters from "../components/TaskFilters";
import { initialTasks } from "../data/tasks";

export default function HomePage() {
  // All tasks state
  const [tasks, setTasks] = useState(initialTasks);

  // Current status filter: "All" | "To Do" | "In Progress" | "Done"
  const [filter, setFilter] = useState("All");

  // Add a new task to the list
  const handleAddTask = (title, priority) => {
    if (!title.trim()) return;

    const newTask = {
      id: `t-${Date.now()}`,
      title: title.trim(),
      description: "",
      status: "To Do",
      priority: priority || "Medium",
      dueDate: "2025-12-10", // later we can make this dynamic
      progress: 0,
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle a task between "To Do" and "Done"
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

  // Derive visible tasks based on the active filter
  const visibleTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task.status === filter;
  });

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

        {/* Add Task bar */}
        <AddTaskBar onAddTask={handleAddTask} />

        {/* Filters */}
        <TaskFilters currentFilter={filter} onChangeFilter={setFilter} />

        {/* Task table */}
        <TaskTable
          tasks={visibleTasks}
          onToggleStatus={handleToggleStatus}
          onDeleteTask={handleDeleteTask}
        />
      </Box>
    </Box>
  );
}
