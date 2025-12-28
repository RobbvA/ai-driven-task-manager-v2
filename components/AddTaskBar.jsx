"use client";

import { useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Input,
  Button,
  Text,
  IconButton,
  Popover,
} from "@chakra-ui/react";
import { Info } from "lucide-react";
import { enhanceTaskDescription } from "../lib/aiTaskEnhancer";

export default function AddTaskBar({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("auto");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

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
          {/* Title */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="xs" color="muted" fontWeight="600">
              Title
            </Text>

            <Input
              size="md"
              bg="white"
              border="1px solid"
              borderColor="border"
              borderRadius="lg"
              placeholder="e.g. Write the deployment checklist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              _focusVisible={{
                outline: "none",
                boxShadow: "0 0 0 3px var(--chakra-colors-focusRing)",
              }}
            />
          </VStack>

          {/* Controls */}
          <HStack spacing={3} align="center" flexWrap="wrap">
            {/* Priority + info */}
            <HStack spacing={1} align="center">
              <Box
                as="select"
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

              <Popover.Root placement="top-start">
                <Popover.Trigger asChild>
                  <IconButton
                    aria-label="What is auto priority?"
                    size="xs"
                    variant="ghost"
                    borderRadius="full"
                  >
                    <Info size={14} />
                  </IconButton>
                </Popover.Trigger>

                <Popover.Positioner>
                  <Popover.Content maxW="260px">
                    <Popover.Arrow />
                    <Popover.Body>
                      <Text fontSize="sm" fontWeight="600" mb={1}>
                        Auto priority
                      </Text>
                      <Text fontSize="sm" color="muted">
                        The system assigns a priority based on task details like
                        keywords, urgency, and due date. You can always change
                        it later.
                      </Text>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            </HStack>

            {/* Due date */}
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

            {/* Actions */}
            <HStack spacing={2} ml={{ base: 0, md: "auto" }}>
              <Button
                type="submit"
                size="md"
                borderRadius="full"
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
              >
                Add task
              </Button>

              <Button
                type="button"
                size="md"
                variant="ghost"
                borderRadius="full"
                onClick={handleEnhance}
              >
                Enhance
              </Button>
            </HStack>
          </HStack>

          {/* Description */}
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
        </VStack>
      </form>
    </Box>
  );
}
