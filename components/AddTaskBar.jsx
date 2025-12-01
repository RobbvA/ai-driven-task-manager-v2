"use client";

import { useState } from "react";
import { Box, HStack, VStack, Input, Button, Text } from "@chakra-ui/react";
import { enhanceTaskDescription } from "../lib/aiTaskEnhancer";

export default function AddTaskBar({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("auto"); // "auto" | "Critical" | "High" | "Medium" | "Low"
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    onAddTask(trimmed, priority, description);

    // reset form
    setTitle("");
    setPriority("auto");
    setDescription("");
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
          <HStack spacing={3} align="center">
            <Input
              size="sm"
              bg="#ffffff"
              placeholder="Describe your task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Native select, styled via Box */}
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

          {/* Description textarea (native, via Box) */}
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

          <Text fontSize="xs" mt={0.5} color="#9aa0b8">
            Use Auto (AI priority) to let the app pick a priority, and Enhance
            with AI to generate a clear description.
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
