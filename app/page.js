"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Flex,
  Stack,
  Button,
} from "@chakra-ui/react";
import Topbar from "../components/Topbar";
import TaskTable from "../components/TaskTable";
import AddTaskBar from "../components/AddTaskBar";
import TaskFilters from "../components/TaskFilters";
import TaskPriorityFilters from "../components/TaskPriorityFilters";
import TaskSortBar from "../components/TaskSortBar";
import NextTaskBanner from "../components/NextTaskBanner";
import { suggestPriorityForTitle } from "../lib/aiPriorityEngine";
import { suggestNextTask } from "../lib/aiNextTaskSuggester";

export default function HomePage() {
  // All tasks state
  const [tasks, setTasks] = useState([]);

  // Loading/error state (simpel gehouden)
  const [isLoading, setIsLoading] = useState(true);

  // Status filter: "All" | "To Do" | "In Progress" | "Done"
  const [filter, setFilter] = useState("All");

  // Priority filter: "All" | "Critical" | "High" | "Medium" | "Low"
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Sorting: "none" | "priority" | "dueDate" | "progress"
  const [sortBy, setSortBy] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" | "desc"

  // AI: which task is currently suggested as "next"
  const [suggestedTaskId, setSuggestedTaskId] = useState(null);

  // UI: is de AI Next Task panel open?
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  // Load tasks from API on mount
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) {
          console.error("Failed to load tasks:", await res.text());
          return;
        }
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  // Add a new task to the list (and DB)
  const handleAddTask = async (title, priorityFromUI, descriptionFromUI) => {
    if (!title.trim()) return;

    let finalPriority;

    if (!priorityFromUI || priorityFromUI === "auto") {
      finalPriority = suggestPriorityForTitle(title);
    } else {
      finalPriority = priorityFromUI;
    }

    const payload = {
      title: title.trim(),
      description: descriptionFromUI?.trim() || "",
      status: "To Do",
      priority: finalPriority,
      progress: 0,
      dueDate: null,
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Failed to create task:", await res.text());
        return;
      }

      const created = await res.json();
      setTasks((prev) => [created, ...prev]);
      setSuggestedTaskId(null);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Toggle a task between "To Do" and "Done" (and update DB)
  const handleToggleStatus = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const newStatus = target.status === "Done" ? "To Do" : "Done";
    const newProgress = newStatus === "Done" ? 100 : 0;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          progress: newProgress,
        }),
      });

      if (!res.ok) {
        console.error("Failed to update task:", await res.text());
        return;
      }

      const updated = await res.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updated : task))
      );
      setSuggestedTaskId(null);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Remove a task from the list (and DB) – met optimistic update + rollback
  const handleDeleteTask = async (taskId) => {
    const previousTasks = tasks;
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setSuggestedTaskId(null);

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete task:", await res.text());
        setTasks(previousTasks);
        return;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setTasks(previousTasks);
    }
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
      result = aRank - bRank;
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

  // AI: suggest next task (kijkt naar ALLE tasks, niet alleen gefilterde)
  const next = suggestNextTask(tasks);

  if (!tasks.length) {
    setSuggestedTaskId(null); // geen tasks
    return;
  }

  if (!next) {
    setSuggestedTaskId(false); // AI kon niets vinden
    return;
  }

  setSuggestedTaskId(next.id);

  const suggestedTask =
    suggestedTaskId != null
      ? tasks.find((t) => t.id === suggestedTaskId) || null
      : null;

  return (
    <Box minH="100vh" bg="#e9ecf5">
      <Topbar />

      <Box
        as="main"
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6 }}
        maxW="1200px"
        mx="auto"
      >
        {/* Page header */}
        <VStack align="flex-start" spacing={1} mb={{ base: 4, md: 6 }}>
          <Heading size={{ base: "md", md: "lg" }} color="#1f2335">
            Tasks overview
          </Heading>
          <Text fontSize={{ base: "xs", md: "sm" }} color="#6b708c">
            Calm, focused overview of what matters most today.
          </Text>
        </VStack>

        {/* Top: Add Task card met AI-knop eronder */}
        <Stack spacing={4} mb={{ base: 4, md: 6 }}>
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            p={{ base: 3, md: 4 }}
            border="1px solid"
            borderColor="#dde2f2"
          >
            <Heading size="sm" mb={2} color="#1f2335">
              Add a new task
            </Heading>
            <Text fontSize="xs" color="#8a8fad" mb={3}>
              Capture what&apos;s on your mind — AI will help you prioritize.
            </Text>

            <AddTaskBar onAddTask={handleAddTask} />

            {/* Galaxy / rainbow AI pill onder de balk */}
            <Box mt={3} display="flex" justifyContent="center">
              <Button
                onClick={() => {
                  setIsAiPanelOpen((prev) => !prev);
                  if (!isAiPanelOpen) {
                    handleSuggestNextTask();
                  }
                }}
                size="sm"
                height="2.3rem"
                px={6}
                borderRadius="full"
                bgGradient="linear(to-r, #4c6fff, #a855f7, #ec4899, #22d3ee)"
                bgSize="200% 200%"
                color="white"
                boxShadow="0 0 24px rgba(88, 101, 242, 0.75)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                fontSize="xs"
                _hover={{
                  boxShadow: "0 0 32px rgba(88, 101, 242, 0.95)",
                  transform: "translateY(-1px)",
                }}
                _active={{
                  transform: "translateY(0px) scale(0.98)",
                }}
              >
                <Box
                  w="18px"
                  h="18px"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.2)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  +
                </Box>

                <Text fontSize="xs">AI Next Task</Text>
              </Button>
            </Box>

            {isAiPanelOpen && (
              <Box
                mt={3}
                borderRadius="lg"
                bg="#f5f6ff"
                border="1px solid #dde2f2"
                p={3}
              >
                <NextTaskBanner
                  suggestedTask={suggestedTask}
                  onSuggestNext={handleSuggestNextTask}
                />
              </Box>
            )}
          </Box>
        </Stack>

        {/* Main content: filters + table */}
        <Flex
          gap={6}
          align="flex-start"
          direction={{ base: "column", lg: "row" }}
        >
          {/* Left column: filters & sorting */}
          <Box
            w={{ base: "100%", lg: "30%" }}
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            p={{ base: 3, md: 4 }}
            border="1px solid"
            borderColor="#dde2f2"
          >
            <Heading size="sm" mb={2} color="#1f2335">
              Filters & sorting
            </Heading>
            <Text fontSize="xs" color="#8a8fad" mb={3}>
              Narrow down your view and focus on what matters.
            </Text>

            <Stack spacing={4}>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                  color="#9aa0c3"
                  mb={2}
                >
                  Status
                </Text>
                <TaskFilters
                  currentFilter={filter}
                  onChangeFilter={setFilter}
                />
              </Box>

              <Box borderBottom="1px solid #eceff7" my={1} />

              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                  color="#9aa0c3"
                  mb={2}
                >
                  Priority
                </Text>
                <TaskPriorityFilters
                  currentPriorityFilter={priorityFilter}
                  onChangePriorityFilter={setPriorityFilter}
                />
              </Box>

              <Box borderBottom="1px solid #eceff7" my={1} />

              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                  color="#9aa0c3"
                  mb={2}
                >
                  Sort
                </Text>
                <TaskSortBar
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onChangeSortBy={handleChangeSortBy}
                  onToggleDirection={handleToggleSortDirection}
                />
              </Box>
            </Stack>
          </Box>

          {/* Right column: task list */}
          <Box
            flex="1"
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            p={{ base: 3, md: 4 }}
            border="1px solid"
            borderColor="#dde2f2"
          >
            <Heading size="sm" mb={2} color="#1f2335">
              Task list
            </Heading>
            <Text fontSize="xs" color="#8a8fad" mb={3}>
              All tasks in one calm overview. Toggle status or delete when
              finished.
            </Text>

            {isLoading ? (
              <Text fontSize="sm" color="#6b708c" mt={2}>
                Loading tasks…
              </Text>
            ) : (
              <TaskTable
                tasks={sortedTasks}
                onToggleStatus={handleToggleStatus}
                onDeleteTask={handleDeleteTask}
                highlightedTaskId={suggestedTaskId}
              />
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
