"use client";

import { useState } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import Topbar from "../components/Topbar";
import TaskTable from "../components/TaskTable";
import AddTaskBar from "../components/AddTaskBar";
import TaskFilters from "../components/TaskFilters";
import TaskPriorityFilters from "../components/TaskPriorityFilters";
import TaskSortBar from "../components/TaskSortBar";
import { initialTasks } from "../data/tasks";
import { suggestPriorityForTitle } from "../lib/aiPriorityEngine";

export default function HomePage() {
  // All tasks state
  const [tasks, setTasks] = useState(initialTasks);

  // Status filter: "All" | "To Do" | "In Progress" | "Done"
  const [filter, setFilter] = useState("All");

  // Priority filter: "All" | "Critical" | "High" | "Medium" | "Low"
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Sorting: "none" | "priority" | "dueDate" | "progress"
  const [sortBy, setSortBy] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" | "desc"

  // Add a new task to the list
  const handleAddTask = (title, priorityFromUI) => {
    if (!title.trim()) return;

    // Decide final priority:
    // - if user chose "auto" → ask AI engine
    // - otherwise use the selected priority
    let finalPriority;

    if (!priorityFromUI || priorityFromUI === "auto") {
      finalPriority = suggestPriorityForTitle(title);
    } else {
      finalPriority = priorityFromUI;
    }

    const newTask = {
      id: `t-${Date.now()}`,
      title: title.trim(),
      description: "",
      status: "To Do",
      priority: finalPriority,
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

  // Change sort option
  const handleChangeSortBy = (value) => {
    setSortBy(value);

    if (value === "priority" || value === "progress") {
      setSortDirection("desc");
    } else if (value === "dueDate") {
      setSortDirection("asc");
    }
  };

  // Toggle direction
  const handleToggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Priority ranking for sorting
  const priorityRank = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // 1) Filteren op status + priority
  const filteredTasks = tasks.filter((task) => {
    if (filter !== "All" && task.status !== filter) return false;
    if (priorityFilter !== "All" && task.priority !== priorityFilter)
      return false;
    return true;
  });

  // 2) Sorteren op basis van sortBy + richting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "none") return 0;

    let result = 0;

    if (sortBy === "priority") {
      const aRank = priorityRank[a.priority] || 0;
      const bRank = priorityRank[b.priority] || 0;
      result = aRank - bRank; // laag -> hoog
    }

    if (sortBy === "dueDate") {
      const aDate = a.dueDate || "";
      const bDate = b.dueDate || "";
      if (aDate < bDate) result = -1;
      else if (aDate > bDate) result = 1;
      else result = 0;
    }

    if (sortBy === "progress") {
      result = (a.progress || 0) - (b.progress || 0);
    }

    if (sortDirection === "desc") {
      result = result * -1;
    }

    return result;
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

        {/* Add Task bar (with AI priority) */}
        <AddTaskBar onAddTask={handleAddTask} />

        {/* Status filters */}
        <TaskFilters currentFilter={filter} onChangeFilter={setFilter} />

        {/* Priority filters */}
        <TaskPriorityFilters
          currentPriorityFilter={priorityFilter}
          onChangePriorityFilter={setPriorityFilter}
        />

        {/* Sort bar */}
        <TaskSortBar
          sortBy={sortBy}
          sortDirection={sortDirection}
          onChangeSortBy={handleChangeSortBy}
          onToggleDirection={handleToggleSortDirection}
        />

        {/* Task table */}
        <TaskTable
          tasks={sortedTasks}
          onToggleStatus={handleToggleStatus}
          onDeleteTask={handleDeleteTask}
        />
      </Box>
    </Box>
  );
}
