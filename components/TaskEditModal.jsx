"use client";

import { useEffect, useState } from "react";
import { Box, Text, Button, Stack, Input, Dialog } from "@chakra-ui/react";

const PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];

export default function TaskEditModal({ isOpen, task, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setPriority(task.priority || "Medium");
      setDescription(task.description || "");
    }
  }, [task]);

  if (!task) return null;

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
    <Dialog.Root
      open={!!isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      size="lg"
      placement="center"
    >
      <Dialog.Backdrop bg="rgba(15, 23, 42, 0.55)" />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="xl"
          boxShadow="0 18px 45px rgba(15, 23, 42, 0.35)"
        >
          <Dialog.CloseTrigger />

          <Dialog.Header>
            <Dialog.Title>Edit task</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Box as="form" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Box>
                  <Text fontSize="sm" mb={1} color="#4a4e62">
                    Title
                  </Text>
                  <Input
                    size="md"
                    borderRadius="lg"
                    border="1px solid #dde2f2"
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
                    w="100%"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    borderRadius="lg"
                    border="1px solid #dde2f2"
                    px={3}
                    py={2}
                    fontSize="sm"
                    bg="#ffffff"
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
                    rows={5}
                    w="100%"
                    borderRadius="lg"
                    border="1px solid #dde2f2"
                    px={3}
                    py={2}
                    fontSize="sm"
                    bg="#ffffff"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Box>

                <Box display="flex" justifyContent="flex-end" gap={2} pt={2}>
                  <Button
                    variant="ghost"
                    borderRadius="full"
                    onClick={onClose}
                    isDisabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    borderRadius="full"
                    bg="#1f2335"
                    color="white"
                    _hover={{ bg: "#161a28" }}
                    isLoading={isSaving}
                  >
                    Save changes
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
