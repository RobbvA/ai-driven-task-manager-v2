"use client";

import { useState } from "react";
import { Box, HStack, VStack, Input, Button } from "@chakra-ui/react";
import { enhanceTaskDescription } from "../lib/aiTaskEnhancer";

export default function AddTaskBar({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("auto"); // "auto" | "Critical" | "High" | "Medium" | "Low"
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    const prioritySource = priority === "auto" ? "ai" : "manual";
    const selectedPriority = priority === "auto" ? "Medium" : priority;

    onAddTask(
      trimmed,
      selectedPriority,
      description,
      prioritySource,
      dueDate || null
    );

    setTitle("");
    setPriority("auto");
    setDescription("");
    setDueDate("");
  };

  const handleEnhance = () => {
    if (!title.trim()) return;
    const enhanced = enhanceTaskDescription(title, description);
    setDescription(enhanced);
  };

  return (
    <Box mb={4}>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={2}>
          <HStack spacing={3} align="center" flexWrap="wrap">
            <Input
              size="sm"
              bg="#ffffff"
              placeholder="Describe your task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Box
              as="select"
              size="sm"
              bg="#ffffff"
              w="160px"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              borderRadius="md"
              border="1px solid #d5d8e4"
              px={2}
              py={1}
            >
              <option value="auto">Auto (AI priority)</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Box>

            {/* NEW: due date */}
            <Input
              size="sm"
              bg="#ffffff"
              type="date"
              w="160px"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <Button type="submit" size="sm">
              Add
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleEnhance}
            >
              Enhance with AI
            </Button>
          </HStack>

          <Box
            as="textarea"
            rows={2}
            bg="#ffffff"
            borderRadius="md"
            border="1px solid #d5d8e4"
            px={3}
            py={2}
            fontSize="sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional: task description (AI can help you write this)…"
          />
        </VStack>
      </form>
    </Box>
  );
}
