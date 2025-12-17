"use client";

import { useState, useEffect, useMemo } from "react";
import { Box, Heading, Text, Flex, Stack, Button } from "@chakra-ui/react";

import Topbar from "../components/Topbar";
import TaskTable from "../components/TaskTable";
import AddTaskBar from "../components/AddTaskBar";
import TaskFilters from "../components/TaskFilters";
import TaskPriorityFilters from "../components/TaskPriorityFilters";
import TaskSortBar from "../components/TaskSortBar";
import NextTaskBanner from "../components/NextTaskBanner";
import TaskEditModal from "../components/TaskEditModal";
import { suggestNextTaskDetailed } from "../lib/aiNextTaskSuggester";
import RotateHint from "../components/RotateHint";

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
  const [nextExplainability, setNextExplainability] = useState(null);

  // Tabs
  const [activeTab, setActiveTab] = useState("plan");

  // UI: is de AI Next Task card open/closed?
  const [isAiCardOpen, setIsAiCardOpen] = useState(false);

  // Edit task state
  const [editingTask, setEditingTask] = useState(null);

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

  /**
   * Add task (with dueDate)
   * - If prioritySource === "ai": server computes priority + explainability and persists it
   * - If prioritySource === "manual": server stores provided priority
   */
  const handleAddTask = async (
    title,
    priorityFromUI,
    descriptionFromUI,
    prioritySource,
    dueDateFromUI
  ) => {
    if (!title?.trim()) return;

    const source = prioritySource === "ai" ? "ai" : "manual";

    const payload = {
      title: title.trim(),
      description: descriptionFromUI?.trim() || "",
      status: "To Do",

      // Always send a priority value; server will override when source === "ai"
      priority: priorityFromUI || "Medium",
      prioritySource: source,

      progress: 0,

      // due date from UI (YYYY-MM-DD) or null
      dueDate: dueDateFromUI || null,
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const created = await res.json();

      if (!res.ok) {
        console.error("Failed to create task:", created);
        return;
      }

      setTasks((prev) => [created, ...prev]);
      setAiState("idle");
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  // Toggle task status (cyclic, UX-correct)
  const handleToggleStatus = async (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    let newStatus = target.status;
    let newProgress = target.progress ?? 0;

    if (target.status === "To Do") {
      newStatus = "In Progress";
      newProgress = newProgress > 0 ? newProgress : 25;
    } else if (target.status === "In Progress") {
      newStatus = "Done";
      newProgress = 100;
    } else if (target.status === "Done") {
      newStatus = "To Do";
      newProgress = 0;
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          progress: newProgress,
        }),
      });

      const updated = await res.json();

      if (!res.ok) {
        console.error("Failed to toggle status:", updated);
        return;
      }

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setAiState("idle");
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Delete task (optimistic)
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

  // Update task
  const handleUpdateTask = async (taskId, updates) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const updated = await res.json();

      if (!res.ok) {
        console.error("Failed to update task:", updated);
        throw new Error("Failed to update task");
      }

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setAiState("idle");
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleStartEditTask = (task) => {
    setEditingTask(task);
  };

  // Filtered tasks
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

  // Sorted tasks
  const sortedTasks = useMemo(() => {
    const list = [...filteredTasks];
    if (sortBy === "none") return list;

    return list.sort((a, b) => {
      let val = 0;

      if (sortBy === "priority") {
        val = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      } else if (sortBy === "progress") {
        val = (a.progress ?? 0) - (b.progress ?? 0);
      } else if (sortBy === "dueDate") {
        val = (a.dueDate || "").localeCompare(b.dueDate || "");
      }

      return sortDirection === "asc" ? val : -val;
    });
  }, [filteredTasks, sortBy, sortDirection]);

  // AI Next Task
  const handleSuggestNextTask = () => {
    if (!tasks.length) {
      setSuggestedTaskId(null);
      setNextExplainability(null);
      setAiState("no-tasks");
      return;
    }

    const detailed = suggestNextTaskDetailed(tasks);

    if (!detailed || !detailed.taskId) {
      setSuggestedTaskId(null);
      setNextExplainability(null);
      setAiState("no-suggestion");
      return;
    }

    setSuggestedTaskId(detailed.taskId);
    setNextExplainability(detailed);
    setAiState("ok");
  };

  const suggestedTask =
    suggestedTaskId != null
      ? tasks.find((t) => t.id === suggestedTaskId)
      : null;

  return (
    <Box minH="100vh" bg="#e9ecf5">
      <Topbar />
      <RotateHint />

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
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
                  <TaskFilters
                    currentFilter={filter}
                    onChangeFilter={setFilter}
                  />
                </Box>

                <Box flex="1">
                  <TaskPriorityFilters
                    currentPriorityFilter={priorityFilter}
                    onChangePriorityFilter={setPriorityFilter}
                  />
                </Box>

                <Box flex="1">
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

            {/* AI Next Task */}
            <Box
              bg="white"
              borderRadius="lg"
              p={4}
              border="1px solid #dde2f2"
              boxShadow="sm"
            >
              <Flex justify="space-between" align="center">
                <Heading size="sm" color="#1f2335">
                  AI Next Task
                </Heading>

                <Button
                  onClick={() => {
                    setIsAiCardOpen((prev) => {
                      const next = !prev;
                      if (!prev) handleSuggestNextTask();
                      return next;
                    });
                  }}
                  size="sm"
                  height="2.3rem"
                  px={6}
                  borderRadius="full"
                  bg="#1f2335"
                  color="white"
                  fontSize="xs"
                  _hover={{ transform: "translateY(-1px)" }}
                  _active={{ transform: "scale(0.98)" }}
                >
                  {isAiCardOpen ? "Hide" : "Show"}
                </Button>
              </Flex>

              {isAiCardOpen && (
                <Box
                  mt={3}
                  borderRadius="lg"
                  bg="#f5f6ff"
                  border="1px solid #dde2f2"
                  p={3}
                >
                  <NextTaskBanner
                    aiState={aiState}
                    suggestedTask={suggestedTask}
                    onSuggestNext={handleSuggestNextTask}
                    nextExplainability={nextExplainability}
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
              <Heading
                size="md"
                mb={3}
                color="#1f2335"
                fontWeight="semibold"
                letterSpacing="-0.01em"
              >
                Task list
              </Heading>

              <Box
                h="1px"
                bg="linear-gradient(to right, #dde2f2, transparent)"
                mb={4}
              />

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
                  onEditTask={handleStartEditTask}
                />
              )}
            </Box>
          </Stack>
        )}

        {/* Edit modal */}
        <TaskEditModal
          isOpen={!!editingTask}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      </Box>
    </Box>
  );
}
