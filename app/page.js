"use client";

import { useState, useEffect } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
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

    // Decide final priority:
    // - if user chose "auto" → ask AI engine
    // - otherwise use the selected priority
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
      // Later kun je dueDate dynamisch maken, nu gewoon leeg of een vaste datum:
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
          // belangrijk: title meesturen zodat backend weet welke task
          title: target.title,
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

  // Remove a task from the list (and DB)
  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete task:", await res.text());
        return;
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setSuggestedTaskId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
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

  // AI: suggest next task (kijkt naar ALLE tasks, niet alleen gefilterde)
  const handleSuggestNextTask = () => {
    const next = suggestNextTask(tasks);
    setSuggestedTaskId(next ? next.id : null);
  };

  const suggestedTask =
    suggestedTaskId != null
      ? tasks.find((t) => t.id === suggestedTaskId) || null
      : null;

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

        {/* Add Task bar (with AI priority + AI description) */}
        <AddTaskBar onAddTask={handleAddTask} />

        {/* AI Suggestion banner */}
        <NextTaskBanner
          suggestedTask={suggestedTask}
          onSuggestNext={handleSuggestNextTask}
        />

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
        {isLoading ? (
          <Text fontSize="sm" color="#6b708c" mt={4}>
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
    </Box>
  );
}
