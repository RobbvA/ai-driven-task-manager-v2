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
  Badge,
} from "@chakra-ui/react";
import { Info, Mic } from "lucide-react";
import { enhanceTaskDescription } from "../lib/aiTaskEnhancer";
import { parseNaturalLanguageTask } from "../lib/nlTaskParser";

export default function AddTaskBar({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("auto");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [nlPreview, setNlPreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const prioritySource = priority === "auto" ? "ai" : "manual";
    const selectedPriority = priority === "auto" ? "Medium" : priority;

    onAddTask(
      title.trim(),
      selectedPriority,
      description,
      prioritySource,
      dueDate || null
    );

    setTitle("");
    setPriority("auto");
    setDescription("");
    setDueDate("");
    setNlPreview(null);
  };

  const handleParse = (input) => {
    if (!input?.trim()) return;
    const parsed = parseNaturalLanguageTask(input);
    if (parsed?.hasSignals) {
      setNlPreview(parsed);
    }
  };

  const applyNlPreview = () => {
    if (!nlPreview) return;

    if (nlPreview.cleanedTitle) {
      setTitle(nlPreview.cleanedTitle);
    }
    if (nlPreview.dueDate) {
      setDueDate(nlPreview.dueDate);
    }
    if (nlPreview.priority) {
      setPriority(nlPreview.priority);
    }
    if (nlPreview.summary) {
      setDescription((prev) =>
        prev ? `${prev}\n\n${nlPreview.summary}` : nlPreview.summary
      );
    }

    setNlPreview(null);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={4}>
          {/* Title */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="md" fontWeight="800" color="text">
              Add new task
            </Text>

            <HStack spacing={2}>
              <Input
                size="md"
                bg="white"
                border="1px solid"
                borderColor="border"
                borderRadius="lg"
                placeholder="e.g. Friday meeting at 14:00 urgent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={(e) => handleParse(e.target.value)}
                _focusVisible={{
                  outline: "none",
                  boxShadow: "0 0 0 3px var(--chakra-colors-focusRing)",
                }}
              />

              <Popover.Root>
                <Popover.Trigger asChild>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Voice input"
                  >
                    <Mic size={16} />
                  </IconButton>
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content maxW="240px">
                    <Popover.Arrow />
                    <Popover.Body>
                      <Text fontSize="sm" fontWeight="600" mb={1}>
                        Voice input
                      </Text>
                      <Text fontSize="sm" color="muted">
                        You can speak a task like “Friday meeting urgent”. It
                        will be parsed the same as typed text.
                      </Text>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            </HStack>

            {nlPreview && (
              <Box
                p={3}
                borderRadius="lg"
                border="1px solid"
                borderColor="border"
                bg="brand.50"
              >
                <Text fontSize="sm" fontWeight="700" mb={1}>
                  I understood:
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  {nlPreview.dueDate && <Badge>Due {nlPreview.dueDate}</Badge>}
                  {nlPreview.priority && (
                    <Badge>Priority {nlPreview.priority}</Badge>
                  )}
                </HStack>

                <HStack spacing={2} mt={2}>
                  <Button size="sm" onClick={applyNlPreview}>
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setNlPreview(null)}
                  >
                    Dismiss
                  </Button>
                </HStack>
              </Box>
            )}
          </VStack>

          {/* Controls */}
          <HStack spacing={3} flexWrap="wrap">
            <HStack spacing={1}>
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
                minW="220px"
              >
                <option value="auto">Auto (AI priority)</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Box>

              <Popover.Root>
                <Popover.Trigger asChild>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    aria-label="What is auto priority?"
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
                        Priority is calculated using deterministic rules
                        (keywords, urgency, due date). You can always override
                        it manually.
                      </Text>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            </HStack>

            <Input
              size="md"
              bg="white"
              border="1px solid"
              borderColor="border"
              borderRadius="lg"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              minW="220px"
            />

            <HStack spacing={2} ml="auto">
              <Button
                type="submit"
                size="md"
                borderRadius="full"
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
              >
                Add
              </Button>

              <Button
                type="button"
                size="md"
                variant="ghost"
                borderRadius="full"
                onClick={() => {
                  if (title.trim()) {
                    setDescription(enhanceTaskDescription(title, description));
                  }
                }}
              >
                Enhance
              </Button>
            </HStack>
          </HStack>

          {/* Description */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="700" color="text">
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
              placeholder="Context, notes, acceptance criteria…"
            />
          </VStack>
        </VStack>
      </form>
    </Box>
  );
}
