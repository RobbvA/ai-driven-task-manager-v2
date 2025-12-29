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
  // NLP input + preview
  const [nlText, setNlText] = useState("");
  const [parsedDraft, setParsedDraft] = useState(null);
  const [confirmRisky, setConfirmRisky] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("auto");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Speech-to-text (Web Speech API)
  const recognitionRef = useRef(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");

  useEffect(() => {
    // Initialize SpeechRecognition only on client
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

      // Put transcript into NL input; keep user control: they still click "Parse".
      setNlText(transcript);
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

    const topReasons = Array.isArray(parsedDraft.reasons)
      ? parsedDraft.reasons.slice(0, 3)
      : [];

    const warnings = Array.isArray(parsedDraft.warnings)
      ? parsedDraft.warnings
      : [];
    const errors = Array.isArray(parsedDraft.errors) ? parsedDraft.errors : [];

    const riskyPastDate = warnings.some((w) =>
      String(w).toLowerCase().includes("past")
    );

    return {
      title: parsedDraft.title || "—",
      dueDate: parsedDraft.dueDate || "—",
      dueTime: parsedDraft.dueTime || "—",
      priority: parsedDraft.priority || "Auto",
      confidence: parsedDraft.confidence || "low",
      topReasons,
      warnings,
      errors,
      riskyPastDate,
    };
  }, [parsedDraft]);

  const canApply =
    !!preview &&
    preview.errors.length === 0 &&
    (!preview.riskyPastDate || confirmRisky);

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

    setNlText("");
    setParsedDraft(null);
    setConfirmRisky(false);
    setSpeechError("");

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

  const handleParseNl = () => {
    const parsed = parseNlTask(nlText);
    setParsedDraft(parsed);
    setConfirmRisky(false);
  };

  const handleApplyParsed = () => {
    if (!parsedDraft) return;

    if (parsedDraft.title) setTitle(parsedDraft.title);
    if (parsedDraft.dueDate) setDueDate(parsedDraft.dueDate);

    // If parser found priority keyword, set manual priority; else keep Auto.
    if (parsedDraft.priority) setPriority(parsedDraft.priority);

    // Store time in description (v1: no DB field)
    if (parsedDraft.dueTime) {
      const timeLine = `Time: ${parsedDraft.dueTime}`;
      setDescription((prev) => {
        const p = (prev || "").trim();
        if (!p) return timeLine;
        if (p.toLowerCase().includes("time:")) return p;
        return `${p}\n\n${timeLine}`;
      });
    }

    // Compact explainability snippet
    if (Array.isArray(parsedDraft.reasons) && parsedDraft.reasons.length > 0) {
      const lines = parsedDraft.reasons
        .slice(0, 2)
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

    setParsedDraft(null);
    setNlText("");
    setConfirmRisky(false);
  };

  const handleCancelParsed = () => {
    setParsedDraft(null);
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
    } catch (e) {
      setIsListening(false);
      setSpeechError("Speech could not start (permission or browser issue).");
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={4}>
          {/* Natural language input (EN-only, deterministic) */}
          <Box
            p={4}
            borderRadius="xl"
            bg="brand.50"
            border="1px solid"
            borderColor="border"
          >
            <HStack justify="space-between" align="flex-start" gap={3}>
              <Box>
                <Text fontSize="sm" color="text" fontWeight="800">
                  Natural language
                </Text>
                <Text fontSize="xs" color="muted" mt={1}>
                  Type or speak one sentence. You’ll get a preview + confirm
                  before it fills the form.
                </Text>
              </Box>

              <HStack spacing={2}>
                <IconButton
                  aria-label={
                    isListening ? "Stop recording" : "Start recording"
                  }
                  title={
                    speechSupported
                      ? isListening
                        ? "Stop recording"
                        : "Start recording"
                      : "Speech not supported"
                  }
                  size="sm"
                  variant="ghost"
                  borderRadius="full"
                  onClick={toggleListening}
                  isDisabled={!speechSupported}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </IconButton>

                <Button
                  type="button"
                  size="sm"
                  borderRadius="full"
                  bg="white"
                  border="1px solid"
                  borderColor="border"
                  onClick={handleParseNl}
                  isDisabled={!nlText.trim()}
                >
                  Parse
                </Button>
              </HStack>
            </HStack>

            <Input
              mt={3}
              size="md"
              bg="white"
              border="1px solid"
              borderColor="border"
              borderRadius="lg"
              placeholder='Example: "next Friday meeting at 1400 urgent"'
              value={nlText}
              onChange={(e) => setNlText(e.target.value)}
            />

            <Text fontSize="xs" color="muted" mt={2}>
              Understands: today/tomorrow, weekdays, “next weekday”, “in N
              days/weeks”, ISO dates (YYYY-MM-DD), times (14:00 / 1400 / 2pm),
              and urgency keywords (urgent/asap/critical/low prio).
              {speechSupported
                ? " Speech works best in Chrome/Edge."
                : " Speech is not supported in this browser."}
            </Text>

            {speechError ? (
              <Text fontSize="xs" color="muted" mt={2}>
                {speechError}
              </Text>
            ) : null}

            {/* Inline preview + confirm */}
            {preview && (
              <Box
                mt={4}
                p={4}
                borderRadius="lg"
                bg="white"
                border="1px solid"
                borderColor="border"
              >
                <HStack justify="space-between" align="flex-start" gap={3}>
                  <Box>
                    <Text fontSize="sm" fontWeight="800" color="text">
                      Preview
                    </Text>
                    <Text fontSize="xs" color="muted" mt={1}>
                      Confidence:{" "}
                      <Box as="span" fontWeight="800" color="text">
                        {preview.confidence}
                      </Box>
                    </Text>
                  </Box>

                  <HStack spacing={2}>
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
                      onClick={handleCancelParsed}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </HStack>

                <VStack align="stretch" spacing={2} mt={3}>
                  <Text fontSize="sm" color="text" fontWeight="700">
                    Title:{" "}
                    <Box as="span" fontWeight="600">
                      {preview.title}
                    </Box>
                  </Text>

                  <HStack spacing={3} flexWrap="wrap">
                    <Text fontSize="sm" color="muted">
                      Due:{" "}
                      <Box as="span" fontWeight="700" color="text">
                        {preview.dueDate}
                      </Box>
                    </Text>

                    <Text fontSize="sm" color="muted">
                      Time:{" "}
                      <Box as="span" fontWeight="700" color="text">
                        {preview.dueTime}
                      </Box>
                    </Text>

                    <Text fontSize="sm" color="muted">
                      Priority:{" "}
                      <Box as="span" fontWeight="700" color="text">
                        {preview.priority}
                      </Box>
                    </Text>
                  </HStack>

                  {preview.topReasons.length > 0 && (
                    <Box>
                      <Text fontSize="xs" color="muted" mb={2}>
                        Matched signals
                      </Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {preview.topReasons.map((r, idx) => (
                          <Box
                            key={`${r.ruleId || "rule"}-${idx}`}
                            px={3}
                            py={1}
                            borderRadius="full"
                            bg="brand.50"
                            border="1px solid"
                            borderColor="border"
                            fontSize="xs"
                            color="text"
                            maxW="100%"
                          >
                            {r.rationale}
                          </Box>
                        ))}
                      </HStack>
                    </Box>
                  )}

                  {preview.warnings.length > 0 && (
                    <Box mt={2}>
                      <Text fontSize="xs" color="muted" mb={1}>
                        Notes
                      </Text>
                      <VStack align="stretch" spacing={1}>
                        {preview.warnings.slice(0, 3).map((w, i) => (
                          <Text key={`warn-${i}`} fontSize="sm" color="muted">
                            • {w}
                          </Text>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {preview.riskyPastDate && (
                    <Box
                      mt={2}
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="border"
                      bg="brand.50"
                    >
                      <Text fontSize="sm" color="text" fontWeight="700">
                        Confirm
                      </Text>
                      <Text fontSize="sm" color="muted" mt={1}>
                        The parsed due date is in the past. Check the box to
                        confirm before applying.
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
                  )}
                </VStack>
              </Box>
            )}
          </Box>

          {/* Title */}
          <VStack align="stretch" spacing={2}>
            <Text
              fontSize="sm"
              color="text"
              fontWeight="800"
              letterSpacing="0.2px"
            >
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
            Tip: If it takes more than one sentence to explain, put it in the
            description.
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
