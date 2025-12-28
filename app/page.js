// app/page.js
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
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("none");
  const [sortDirection, setSortDirection] = useState("asc");

  const [suggestedTaskId, setSuggestedTaskId] = useState(null);
  const [aiState, setAiState] = useState("idle");
  const [nextExplainability, setNextExplainability] = useState(null);

  const [activeTab, setActiveTab] = useState("plan");
  const [isAiCardOpen, setIsAiCardOpen] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();

        const nextTasks = Array.isArray(data)
          ? data
          : Array.isArray(data?.tasks)
          ? data.tasks
          : [];

        setTasks(nextTasks);
      } catch {
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  const handleAddTask = async (
    title,
    priorityFromUI,
    descriptionFromUI,
    prioritySource,
    dueDateFromUI
  ) => {
    if (!title?.trim()) return;

    const payload = {
      title: title.trim(),
      description: descriptionFromUI?.trim() || "",
      status: "To Do",
      priority: priorityFromUI || "Medium",
      prioritySource: prioritySource === "ai" ? "ai" : "manual",
      progress: 0,
      dueDate: dueDateFromUI || null,
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const created = data?.task ?? data;

      if (created?.id) {
        setTasks((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
        setAiState("idle");
      }
    } catch {}
  };

  const handleToggleStatus = async (taskId) => {
    const target = safeTasks.find((t) => t.id === taskId);
    if (!target) return;

    let newStatus = "To Do";
    let newProgress = 0;

    if (target.status === "To Do") {
      newStatus = "In Progress";
      newProgress = target.progress > 0 ? target.progress : 25;
    } else if (target.status === "In Progress") {
      newStatus = "Done";
      newProgress = 100;
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, progress: newProgress }),
      });

      const data = await res.json();
      const updated = data?.task ?? data;

      if (updated?.id) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        setAiState("idle");
      }
    } catch {}
  };

  const handleDeleteTask = async (taskId) => {
    const oldTasks = safeTasks;
    setTasks(oldTasks.filter((t) => t.id !== taskId));

    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    } catch {
      setTasks(oldTasks);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      const updated = data?.task ?? data;

      if (updated?.id) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
        setAiState("idle");
      }
    } catch {}
  };

  const filteredTasks = useMemo(
    () =>
      safeTasks.filter((t) => {
        if (filter !== "All" && t.status !== filter) return false;
        if (priorityFilter !== "All" && t.priority !== priorityFilter)
          return false;
        return true;
      }),
    [safeTasks, filter, priorityFilter]
  );

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

  const handleSuggestNextTask = () => {
    if (!safeTasks.length) {
      setSuggestedTaskId(null);
      setNextExplainability(null);
      setAiState("no-tasks");
      return;
    }

    const detailed = suggestNextTaskDetailed(safeTasks);
    if (!detailed?.taskId) {
      setAiState("no-suggestion");
      return;
    }

    setSuggestedTaskId(detailed.taskId);
    setNextExplainability(detailed);
    setAiState("ok");
  };

  const suggestedTask =
    suggestedTaskId != null
      ? safeTasks.find((t) => t.id === suggestedTaskId)
      : null;

  return (
    <Box minH="100vh" bg="appBg">
      <Topbar />
      <RotateHint />

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        <Box mb={6}>
          <Flex bg="cardBg" borderRadius="full" p="4px" maxW="280px">
            <Button
              flex="1"
              size="sm"
              borderRadius="full"
              bg={activeTab === "plan" ? "brand.500" : "transparent"}
              color={activeTab === "plan" ? "white" : "muted"}
              onClick={() => setActiveTab("plan")}
            >
              Plan
            </Button>
            <Button
              flex="1"
              size="sm"
              borderRadius="full"
              bg={activeTab === "tasks" ? "brand.500" : "transparent"}
              color={activeTab === "tasks" ? "white" : "muted"}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </Button>
          </Flex>
        </Box>

        {activeTab === "plan" && (
          <Box
            bg="cardBg"
            borderRadius="xl"
            p={5}
            boxShadow="md" // 👈 iets sterker dan de rest
          >
            <Heading size="sm" mb={2}>
              Add a new task
            </Heading>
            <AddTaskBar onAddTask={handleAddTask} />
          </Box>
        )}

        {activeTab === "tasks" && (
          <Stack spacing={6}>
            <Box bg="cardBg" borderRadius="lg" p={4}>
              <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                <TaskFilters
                  currentFilter={filter}
                  onChangeFilter={setFilter}
                />
                <TaskPriorityFilters
                  currentPriorityFilter={priorityFilter}
                  onChangePriorityFilter={setPriorityFilter}
                />
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
              </Stack>
            </Box>

            <Box bg="brand.50" borderRadius="lg" p={4}>
              <Flex justify="space-between" align="center">
                <Heading size="sm">AI Next Task</Heading>
                <Button size="sm" onClick={handleSuggestNextTask}>
                  Suggest
                </Button>
              </Flex>

              {aiState !== "idle" && (
                <Box mt={3}>
                  <NextTaskBanner
                    aiState={aiState}
                    suggestedTask={suggestedTask}
                    onSuggestNext={handleSuggestNextTask}
                    nextExplainability={nextExplainability}
                  />
                </Box>
              )}
            </Box>

            <Box bg="cardBg" borderRadius="xl" p={4}>
              <Heading size="md" mb={3}>
                Task list
              </Heading>

              {isLoading ? (
                <Text color="muted">Loading tasks…</Text>
              ) : sortedTasks.length === 0 ? (
                <Text color="muted">No tasks match your filters.</Text>
              ) : (
                <TaskTable
                  tasks={sortedTasks}
                  onToggleStatus={handleToggleStatus}
                  onDeleteTask={handleDeleteTask}
                  highlightedTaskId={suggestedTaskId}
                  onEditTask={setEditingTask}
                />
              )}
            </Box>
          </Stack>
        )}

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
