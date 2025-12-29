"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { Info, Mic, MicOff } from "lucide-react";
import { enhanceTaskDescription } from "../lib/aiTaskEnhancer";
import { parseNlTask } from "../lib/nlTaskParser";

export default function AddTaskBar({ onAddTask }) {
  // Form fields
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("auto");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Parsed preview from title (NLP)
  const [parsedDraft, setParsedDraft] = useState(null);
  const [confirmRisky, setConfirmRisky] = useState(false);

  // Speech-to-text (Web Speech API)
  const recognitionRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const rec = new SpeechRecognition();
    rec.lang = "en-US"; // EN-only as requested
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setSpeechError("");
      setIsListening(true);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.onerror = (event) => {
      setIsListening(false);
      setSpeechError(
        event?.error ? `Speech error: ${event.error}` : "Speech error"
      );
    };

    rec.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript?.trim?.() || "";
      if (!transcript) return;

      // Put transcript into title, then parse deterministically for preview
      setTitle(transcript);
      const parsed = parseNlTask(transcript);
      setParsedDraft(parsed);
      setConfirmRisky(false);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.abort?.();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const preview = useMemo(() => {
    if (!parsedDraft) return null;

    const warnings = Array.isArray(parsedDraft.warnings)
      ? parsedDraft.warnings
      : [];
    const errors = Array.isArray(parsedDraft.errors) ? parsedDraft.errors : [];
    const reasons = Array.isArray(parsedDraft.reasons)
      ? parsedDraft.reasons
      : [];

    const riskyPastDate = warnings.some((w) =>
      String(w).toLowerCase().includes("past")
    );

    // Keep preview compact: only show what matters
    return {
      title: parsedDraft.title || "",
      dueDate: parsedDraft.dueDate || null,
      dueTime: parsedDraft.dueTime || null,
      priority: parsedDraft.priority || null,
      confidence: parsedDraft.confidence || "low",
      topReasons: reasons.slice(0, 2),
      warnings,
      errors,
      riskyPastDate,
    };
  }, [parsedDraft]);

  const showPreview =
    !!preview &&
    preview.errors.length === 0 &&
    // Only show if we actually detected something useful
    (Boolean(preview.dueDate) ||
      Boolean(preview.priority) ||
      Boolean(preview.dueTime)) &&
    // Avoid noise: if confidence is low and no meaningful signals, don’t show
    (preview.confidence === "high" ||
      preview.confidence === "medium" ||
      preview.riskyPastDate);

  const canApply = showPreview && (!preview.riskyPastDate || confirmRisky);

  const parseFromTitle = (value) => {
    const txt = String(value || "").trim();
    if (!txt) {
      setParsedDraft(null);
      setConfirmRisky(false);
      return;
    }

    const parsed = parseNlTask(txt);
    setParsedDraft(parsed);
    setConfirmRisky(false);
  };

  const toggleListening = () => {
    setSpeechError("");

    const rec = recognitionRef.current;
    if (!rec) return;

    try {
      if (isListening) {
        rec.stop?.();
        return;
      }
      rec.start?.();
    } catch {
      setIsListening(false);
      setSpeechError("Speech could not start (permission or browser issue).");
    }
  };

  const handleApplyParsed = () => {
    if (!preview) return;

    // Apply extracted fields
    if (preview.dueDate) setDueDate(preview.dueDate);

    // If parser found a priority keyword, switch to manual priority; else keep Auto.
    if (preview.priority) setPriority(preview.priority);

    // Store time + signals in description (v1: no DB field for time)
    if (preview.dueTime) {
      const timeLine = `Time: ${preview.dueTime}`;
      setDescription((prev) => {
        const p = (prev || "").trim();
        if (!p) return timeLine;
        if (p.toLowerCase().includes("time:")) return p;
        return `${p}\n\n${timeLine}`;
      });
    }

    if (preview.topReasons.length > 0) {
      const lines = preview.topReasons
        .map((r) => `• ${r.rationale}`)
        .join("\n");
      const snippet = `Parsed signals:\n${lines}`;
      setDescription((prev) => {
        const p = (prev || "").trim();
        if (!p) return snippet;
        if (p.toLowerCase().includes("parsed signals:")) return p;
        return `${p}\n\n${snippet}`;
      });
    }

    // Replace title with the cleaned-up parsed title (if present)
    if (preview.title) setTitle(preview.title);

    setParsedDraft(null);
    setConfirmRisky(false);
  };

  const handleDismissParsed = () => {
    setParsedDraft(null);
    setConfirmRisky(false);
  };

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

    setParsedDraft(null);
    setConfirmRisky(false);
    setSpeechError("");
  };

  const handleEnhance = () => {
    if (!title.trim()) return;
    const enhanced = enhanceTaskDescription(title, description);
    setDescription(enhanced);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={4}>
          {/* Title */}
          <VStack align="stretch" spacing={2}>
            <HStack justify="space-between" align="center">
              <Text
                fontSize="sm"
                color="text"
                fontWeight="800"
                letterSpacing="0.2px"
              >
                Title
              </Text>

              <HStack spacing={1}>
                {/* Mic */}
                <IconButton
                  aria-label={
                    isListening ? "Stop recording" : "Start recording"
                  }
                  title={
                    speechSupported
                      ? isListening
                        ? "Stop recording"
                        : "Start recording"
                      : "Speech not supported in this browser"
                  }
                  size="sm"
                  variant="ghost"
                  borderRadius="full"
                  onClick={toggleListening}
                  isDisabled={!speechSupported}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </IconButton>

                {/* Mic help */}
                <Popover.Root placement="bottom-end">
                  <Popover.Trigger asChild>
                    <IconButton
                      aria-label="How voice input works"
                      title="How voice input works"
                      size="sm"
                      variant="ghost"
                      borderRadius="full"
                    >
                      <Info size={16} />
                    </IconButton>
                  </Popover.Trigger>

                  <Popover.Positioner>
                    <Popover.Content maxW="320px">
                      <Popover.Arrow />
                      <Popover.Body>
                        <Text fontSize="sm" fontWeight="700" mb={1}>
                          Voice input (EN)
                        </Text>
                        <Text fontSize="sm" color="muted" lineHeight="1.6">
                          Speak a single sentence like{" "}
                          <Box as="span" fontWeight="700" color="text">
                            “Friday meeting at 2pm urgent”
                          </Box>
                          . The app will extract date, time, and urgency using
                          deterministic rules. You’ll always confirm before it
                          changes fields.
                        </Text>
                        <Text fontSize="xs" color="muted" mt={2}>
                          Works best in Chrome/Edge. If unsupported, just type.
                        </Text>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover.Root>
              </HStack>
            </HStack>

            <Input
              size="md"
              bg="white"
              border="1px solid"
              borderColor="border"
              borderRadius="lg"
              placeholder='e.g. "next Friday meeting at 1400 urgent"'
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // do NOT parse on every keystroke (noise + annoying)
              }}
              onBlur={() => parseFromTitle(title)}
              _focusVisible={{
                outline: "none",
                boxShadow: "0 0 0 3px var(--chakra-colors-focusRing)",
              }}
            />

            {speechError ? (
              <Text fontSize="xs" color="muted">
                {speechError}
              </Text>
            ) : null}

            {/* Inline preview (compact) */}
            {showPreview && (
              <Box
                mt={1}
                p={3}
                borderRadius="lg"
                bg="brand.50"
                border="1px solid"
                borderColor="border"
              >
                <HStack justify="space-between" align="flex-start" gap={3}>
                  <Box>
                    <Text fontSize="xs" color="muted" fontWeight="700" mb={1}>
                      Detected from your title
                    </Text>

                    <HStack spacing={3} flexWrap="wrap">
                      {preview.dueDate ? (
                        <Text fontSize="sm" color="text">
                          Due{" "}
                          <Box as="span" fontWeight="800">
                            {preview.dueDate}
                          </Box>
                        </Text>
                      ) : null}

                      {preview.dueTime ? (
                        <Text fontSize="sm" color="text">
                          Time{" "}
                          <Box as="span" fontWeight="800">
                            {preview.dueTime}
                          </Box>
                        </Text>
                      ) : null}

                      {preview.priority ? (
                        <Text fontSize="sm" color="text">
                          Priority{" "}
                          <Box as="span" fontWeight="800">
                            {preview.priority}
                          </Box>
                        </Text>
                      ) : null}
                    </HStack>

                    {preview.riskyPastDate ? (
                      <Box mt={2}>
                        <Text fontSize="xs" color="muted">
                          The detected date is in the past. Confirm to apply.
                        </Text>

                        <Box
                          as="label"
                          display="flex"
                          alignItems="center"
                          gap={2}
                          mt={2}
                          cursor="pointer"
                        >
                          <input
                            type="checkbox"
                            checked={confirmRisky}
                            onChange={(e) => setConfirmRisky(e.target.checked)}
                          />
                          <Text fontSize="sm" color="text">
                            I confirm this is correct
                          </Text>
                        </Box>
                      </Box>
                    ) : null}
                  </Box>

                  <HStack spacing={2} flexShrink={0}>
                    <Button
                      type="button"
                      size="sm"
                      borderRadius="full"
                      bg="brand.500"
                      color="white"
                      _hover={{ bg: "brand.600" }}
                      onClick={handleApplyParsed}
                      isDisabled={!canApply}
                    >
                      Apply
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      borderRadius="full"
                      variant="ghost"
                      onClick={handleDismissParsed}
                    >
                      Dismiss
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            )}
          </VStack>

          {/* Controls */}
          <HStack spacing={3} align="center" flexWrap="wrap">
            <HStack spacing={1} align="center" w={{ base: "100%", md: "auto" }}>
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
                    title="What is auto priority?"
                    size="xs"
                    variant="ghost"
                    borderRadius="full"
                  >
                    <Info size={14} />
                  </IconButton>
                </Popover.Trigger>

                <Popover.Positioner>
                  <Popover.Content maxW="280px">
                    <Popover.Arrow />
                    <Popover.Body>
                      <Text fontSize="sm" fontWeight="700" mb={1}>
                        Auto priority
                      </Text>
                      <Text fontSize="sm" color="muted" lineHeight="1.6">
                        Priority is assigned using deterministic rules based on
                        keywords, urgency, and due date. You can always override
                        it later.
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
              minW={{ base: "100%", md: "220px" }}
            />

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
            <Text
              fontSize="sm"
              color="text"
              fontWeight="800"
              letterSpacing="0.2px"
            >
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
            Tip: Keep the title action-oriented. Put details, constraints, and
            acceptance criteria in the description.
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
