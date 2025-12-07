"use client";

import { useEffect, useState } from "react";
import { Box, Text, Button, Stack, Input } from "@chakra-ui/react";

const PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];

export default function TaskEditModal({ isOpen, task, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // state vullen wanneer een nieuwe task wordt geselecteerd
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setPriority(task.priority || "Medium");
      setDescription(task.description || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      await onSave(task.id, {
        title: title.trim(),
        priority,
        description: description.trim(),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      position="fixed"
      inset="0"
      bg="rgba(15, 23, 42, 0.55)" // donkere overlay
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
    >
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        borderRadius="lg"
        p={5}
        w="100%"
        maxW="480px"
        boxShadow="0 18px 45px rgba(15, 23, 42, 0.35)"
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Text fontSize="lg" fontWeight="semibold" color="#1f2335">
            Edit task
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            isDisabled={isSaving}
          >
            ✕
          </Button>
        </Box>

        {/* Body */}
        <Stack spacing={3} mb={4}>
          <Box>
            <Text fontSize="sm" mb={1} color="#4a4e62">
              Title
            </Text>
            <Input
              size="sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>

          <Box>
            <Text fontSize="sm" mb={1} color="#4a4e62">
              Priority
            </Text>
            <Box
              as="select"
              size="sm"
              w="100%"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              borderRadius="md"
              border="1px solid #d5d8e4"
              px={2}
              py={1}
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Box>
          </Box>

          <Box>
            <Text fontSize="sm" mb={1} color="#4a4e62">
              Description
            </Text>
            <Box
              as="textarea"
              rows={4}
              w="100%"
              borderRadius="md"
              border="1px solid #d5d8e4"
              px={3}
              py={2}
              fontSize="sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
        </Stack>

        {/* Footer */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            isDisabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            colorScheme="blue"
            isLoading={isSaving}
          >
            Save changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
