"use client";

import { useState, useEffect, useMemo } from "react";
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

const PRIORITY_RANK = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export default function HomePage() {
  // All tasks state
  const [tasks, setTasks] = useState([]);

  // Loading
  const [isLoading, setIsLoading] = useState(true);

  // Filters & sorting
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");

  // AI state
  const [suggestedTaskId, setSuggestedTaskId] = useState(null);
  const [aiState, setAiState] = useState("idle");

  // Tabs
  const [activeTab, setActiveTab] = useState("plan");

  // UI: is de AI Next Task card open/closed?
  const [isAiCardOpen, setIsAiCardOpen] = useState(false);

  // Load tasks
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  // Add task
  const handleAddTask = async (title, priorityFromUI, descriptionFromUI) => {
    if (!title.trim()) return;

    let finalPriority =
      !priorityFromUI || priorityFromUI === "auto"
        ? suggestPriorityForTitle(title)
        : priorityFromUI;

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
      const created = await res.json();
      setTasks((prev) => [created, ...prev]);
      setAiState("idle");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  // Toggle task
  const handleToggleStatus = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const newStatus = target.status === "Done" ? "To Do" : "Done";
    const newProgress = newStatus === "Done" ? 100 : 0;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, progress: newProgress }),
      });

      const updated = await res.json();

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setAiState("idle");
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const oldTasks = tasks;
    setTasks(tasks.filter((t) => t.id !== taskId));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed delete");
    } catch (err) {
      setTasks(oldTasks);
      console.error(err);
    }
  };

  // 🧠 Filtered → Sorted tasks
  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) => {
        if (filter !== "All" && t.status !== filter) return false;
        if (priorityFilter !== "All" && t.priority !== priorityFilter)
          return false;
        return true;
      }),
    [tasks, filter, priorityFilter]
  );

  const sortedTasks = useMemo(() => {
    const list = [...filteredTasks];
    if (sortBy === "none") return list;

    return list.sort((a, b) => {
      let val = 0;

      if (sortBy === "priority") {
        val = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      } else if (sortBy === "progress") {
        val = a.progress - b.progress;
      } else if (sortBy === "dueDate") {
        val = (a.dueDate || "").localeCompare(b.dueDate || "");
      }

      return sortDirection === "asc" ? val : -val;
    });
  }, [filteredTasks, sortBy, sortDirection]);

  // ⭐ AI Next Task
  const handleSuggestNextTask = () => {
    if (!tasks.length) {
      setSuggestedTaskId(null);
      setAiState("no-tasks");
      return;
    }

    const next = suggestNextTask(tasks);

    if (!next) {
      setSuggestedTaskId(null);
      setAiState("no-suggestion");
      return;
    }

    setSuggestedTaskId(next.id);
    setAiState("ok");
  };

  const suggestedTask =
    suggestedTaskId != null
      ? tasks.find((t) => t.id === suggestedTaskId)
      : null;

  return (
    <Box minH="100vh" bg="#e9ecf5">
      <Topbar />

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        {/* Header */}
        <VStack align="flex-start" spacing={1} mb={4}>
          <Heading size="lg" color="#1f2335">
            Today&apos;s tasks
          </Heading>
          <Text fontSize="sm" color="#6b708c">
            Plan, focus, and let AI highlight what matters most.
          </Text>
        </VStack>

        {/* Tabs */}
        <Box mb={6}>
          <Flex
            bg="white"
            borderRadius="full"
            p="4px"
            border="1px solid #dde2f2"
            maxW="260px"
            boxShadow="sm"
          >
            <Button
              onClick={() => setActiveTab("plan")}
              flex="1"
              size="sm"
              borderRadius="full"
              fontSize="xs"
              bg={activeTab === "plan" ? "#1f2335" : "transparent"}
              color={activeTab === "plan" ? "white" : "#6b708c"}
            >
              Plan
            </Button>

            <Button
              onClick={() => setActiveTab("tasks")}
              flex="1"
              size="sm"
              borderRadius="full"
              fontSize="xs"
              bg={activeTab === "tasks" ? "#1f2335" : "transparent"}
              color={activeTab === "tasks" ? "white" : "#6b708c"}
            >
              Tasks
            </Button>
          </Flex>
        </Box>

        {/* TAB 1: PLAN */}
        {activeTab === "plan" && (
          <Box
            bg="white"
            borderRadius="xl"
            p={4}
            boxShadow="sm"
            border="1px solid #dde2f2"
          >
            <Heading size="sm" mb={2} color="#1f2335">
              Add a new task
            </Heading>

            <AddTaskBar onAddTask={handleAddTask} />
          </Box>
        )}

        {/* TAB 2: TASKS */}
        {activeTab === "tasks" && (
          <Stack spacing={4}>
            {/* Filters */}
            <Box
              bg="white"
              borderRadius="lg"
              p={4}
              boxShadow="sm"
              border="1px solid #dde2f2"
            >
              <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                <Box flex="1">
                  <Text fontSize="xs" color="#b0b4d0" mb={1}>
                    Status
                  </Text>
                  <TaskFilters
                    currentFilter={filter}
                    onChangeFilter={setFilter}
                  />
                </Box>

                <Box flex="1">
                  <Text fontSize="xs" color="#b0b4d0" mb={1}>
                    Priority
                  </Text>
                  <TaskPriorityFilters
                    currentPriorityFilter={priorityFilter}
                    onChangePriorityFilter={setPriorityFilter}
                  />
                </Box>

                <Box flex="1">
                  <Text fontSize="xs" color="#b0b4d0" mb={1}>
                    Sort
                  </Text>
                  <TaskSortBar
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onChangeSortBy={setSortBy}
                    onToggleDirection={() =>
                      setSortDirection((prev) =>
                        prev === "asc" ? "desc" : "asc"
                      )
                    }
                  />
                </Box>
              </Stack>
            </Box>

            {/* AI Next Task – collapsible card */}
            <Box
              bg="white"
              borderRadius="lg"
              p={4}
              border="1px solid #dde2f2"
              boxShadow="sm"
            >
              {/* Header: titel + galaxy toggle button */}
              <Flex justify="space-between" align="center">
                <Heading size="sm" color="#1f2335">
                  AI Next Task
                </Heading>

                <Button
                  onClick={() => {
                    setIsAiCardOpen((prev) => {
                      const next = !prev;
                      // wanneer hij open gaat → direct een suggestie proberen
                      if (!prev) {
                        handleSuggestNextTask();
                      }
                      return next;
                    });
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
                    {isAiCardOpen ? "–" : "+"}
                  </Box>

                  <Text fontSize="xs">AI Next Task</Text>
                </Button>
              </Flex>

              {/* Collapsible content */}
              {isAiCardOpen && (
                <Box
                  mt={3}
                  borderRadius="lg"
                  bg="#f5f6ff"
                  border="1px solid #dde2f2"
                  p={3}
                  animation="fadeIn 0.25s ease"
                  sx={{
                    "@keyframes fadeIn": {
                      from: { opacity: 0, transform: "translateY(-4px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <NextTaskBanner
                    aiState={aiState}
                    suggestedTask={suggestedTask}
                    onSuggestNext={handleSuggestNextTask}
                  />
                </Box>
              )}
            </Box>

            {/* Task list */}
            <Box
              bg="white"
              borderRadius="xl"
              p={4}
              boxShadow="sm"
              border="1px solid #dde2f2"
            >
              <Heading size="sm" mb={2}>
                Task list
              </Heading>

              {isLoading ? (
                <Text color="#6b708c">Loading tasks…</Text>
              ) : sortedTasks.length === 0 ? (
                <Text color="#9aa0c3">No tasks match your filters.</Text>
              ) : (
                <TaskTable
                  tasks={sortedTasks}
                  onToggleStatus={handleToggleStatus}
                  onDeleteTask={handleDeleteTask}
                  highlightedTaskId={suggestedTaskId}
                />
              )}
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
