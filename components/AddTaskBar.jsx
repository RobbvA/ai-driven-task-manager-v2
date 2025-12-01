"use client";

import { useState } from "react";
import { Box, HStack, Input, Button } from "@chakra-ui/react";

export default function AddTaskBar({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    onAddTask(trimmed, priority);

    // reset form
    setTitle("");
    setPriority("Medium");
  };

  return (
    <Box mb={4}>
      <form onSubmit={handleSubmit}>
        <HStack spacing={3} align="center">
          <Input
            size="sm"
            bg="#ffffff"
            placeholder="Quick add a task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Native select, gestyled via Box */}
          <Box
            as="select"
            size="sm"
            bg="#ffffff"
            w="140px"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            borderRadius="md"
            border="1px solid #d5d8e4"
            px={2}
            py={1}
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Box>

          <Button type="submit" size="sm">
            Add
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
