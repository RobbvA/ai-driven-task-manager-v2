"use client";

import { useState } from "react";
import { Box, HStack, VStack, Input, Button, Text } from "@chakra-ui/react";
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
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={3}>
          {/* Row 1: primary input + controls */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="xs" color="muted" fontWeight="600">
              Title
            </Text>

            <HStack spacing={3} align="center" flexWrap="wrap">
              <Input
                size="md"
                bg="white"
                border="1px solid"
                borderColor="border"
                borderRadius="lg"
                placeholder="e.g. Write the deployment checklist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                flex="1"
                minW={{ base: "100%", md: "320px" }}
                _focusVisible={{
                  outline: "none",
                  boxShadow: "0 0 0 3px var(--chakra-colors-focusRing)",
                }}
              />

              <Box
                as="select"
                aria-label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ appearance: "none" }}
              >
                {/* options are rendered below; styling applied via wrapper */}
              </Box>
            </HStack>

            {/* Controls row (priority + date + buttons) */}
            <HStack spacing={3} align="center" flexWrap="wrap">
              <Box
                as="select"
                size="md"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                borderRadius="lg"
                border="1px solid"
                borderColor="border"
                bg="white"
                px={3}
                py={2}
                fontSize="sm"
                minW={{ base: "100%", md: "220px" }}
              >
                <option value="auto">Auto (AI priority)</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Box>

              <Input
                size="md"
                bg="white"
                border="1px solid"
                borderColor="border"
                borderRadius="lg"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                minW={{ base: "100%", md: "220px" }}
              />

              <HStack
                spacing={2}
                ml={{ base: 0, md: "auto" }}
                w={{ base: "100%", md: "auto" }}
              >
                <Button
                  type="submit"
                  size="md"
                  borderRadius="full"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  w={{ base: "100%", md: "auto" }}
                >
                  Add task
                </Button>

                <Button
                  type="button"
                  size="md"
                  variant="ghost"
                  borderRadius="full"
                  onClick={handleEnhance}
                  w={{ base: "100%", md: "auto" }}
                >
                  Enhance
                </Button>
              </HStack>
            </HStack>
          </VStack>

          {/* Row 2: description */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="xs" color="muted" fontWeight="600">
              Description (optional)
            </Text>

            <Box
              as="textarea"
              rows={3}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="border"
              px={3}
              py={2}
              fontSize="sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context, acceptance criteria, or notes…"
            />
          </VStack>

          <Text fontSize="xs" color="muted">
            Tip: Use short, specific titles. Add details in the description.
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
