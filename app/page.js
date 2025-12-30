"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Stack,
  Button,
  HStack,
  Badge,
  Collapsible,
} from "@chakra-ui/react";

import Topbar from "../components/Topbar";
import AddTaskBar from "../components/AddTaskBar";
import TaskTable from "../components/TaskTable";
import TaskEditModal from "../components/TaskEditModal";
import RotateHint from "../components/RotateHint";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [isRecentOpen, setIsRecentOpen] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
      setIsLoading(false);
    }
    loadTasks();
  }, []);

  const handleAddTask = async (
    title,
    priority,
    description,
    prioritySource,
    dueDate
  ) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        priority,
        description,
        prioritySource,
        dueDate,
        status: "To Do",
        progress: 0,
      }),
    });

    const created = await res.json();
    setTasks((prev) => [created, ...prev]);
    setIsRecentOpen(true);
  };

  const recentTasks = useMemo(() => tasks.slice(0, 5), [tasks]);

  return (
    <Box minH="100vh" bg="appBg">
      <Topbar />
      <RotateHint />

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        <Box
          bg="cardBg"
          borderRadius="2xl"
          p={{ base: 5, md: 6 }}
          border="1px solid"
          borderColor="border"
          boxShadow="sm"
        >
          <Heading size="lg" mb={2}>
            Plan your next task
          </Heading>
          <Text fontSize="sm" color="muted" mb={5} maxW="560px">
            Quickly add tasks in plain English. The system extracts dates and
            priorities and keeps everything explainable.
          </Text>

          <AddTaskBar onAddTask={handleAddTask} />

          {/* Recently added dropdown */}
          <Box mt={6} pt={4} borderTop="1px solid" borderColor="border">
            <Collapsible.Root
              open={isRecentOpen}
              onOpenChange={(d) => setIsRecentOpen(d.open)}
            >
              <Flex justify="space-between" align="center">
                <HStack spacing={2}>
                  <Heading size="sm">Recently added</Heading>
                  <Badge>{recentTasks.length}</Badge>
                </HStack>

                <Collapsible.Trigger asChild>
                  <Button size="sm" variant="ghost">
                    {isRecentOpen ? "Hide" : "Show"}
                  </Button>
                </Collapsible.Trigger>
              </Flex>

              <Collapsible.Content>
                <Stack spacing={2} mt={3}>
                  {isLoading ? (
                    <Text color="muted">Loading…</Text>
                  ) : recentTasks.length === 0 ? (
                    <Text color="muted">No tasks yet.</Text>
                  ) : (
                    recentTasks.map((t) => (
                      <Flex
                        key={t.id}
                        justify="space-between"
                        align="center"
                        p={3}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="border"
                        bg="cardBgSecondary"
                      >
                        <Box minW={0}>
                          <Text fontWeight="800" noOfLines={1}>
                            {t.title}
                          </Text>
                          <Text fontSize="xs" color="muted">
                            Priority {t.priority} • Due {t.dueDate || "—"}
                          </Text>
                        </Box>

                        <Button size="sm" onClick={() => setEditingTask(t)}>
                          Edit
                        </Button>
                      </Flex>
                    ))
                  )}
                </Stack>
              </Collapsible.Content>
            </Collapsible.Root>
          </Box>
        </Box>

        <TaskEditModal
          isOpen={!!editingTask}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={() => setEditingTask(null)}
        />

        {/* Tasks tab blijft ongewijzigd */}
        <Box mt={8}>
          <TaskTable tasks={tasks} onEditTask={setEditingTask} />
        </Box>
      </Box>
    </Box>
  );
}
