"use client";

import { useState } from "react";
import { Box, HStack, Input, Button, Text } from "@chakra-ui/react";

export default function AddTaskBar({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("auto"); // "auto" | "Critical" | "High" | "Medium" | "Low"

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    onAddTask(trimmed, priority);

    // reset form
    setTitle("");
    setPriority("auto");
  };

  return (
    <Box mb={4}>
      <form onSubmit={handleSubmit}>
        <HStack spacing={3} align="center">
          <Input
            size="sm"
            bg="#ffffff"
            placeholder="Describe your task, let AI choose the priority..."
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
            <option value="auto">Auto (AI)</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Box>

          <Button type="submit" size="sm">
            Add
          </Button>
        </HStack>

        <Text fontSize="xs" mt={1} color="#9aa0b8">
          When set to Auto (AI), the app will suggest a priority based on the
          task title.
        </Text>
      </form>
    </Box>
  );
}
