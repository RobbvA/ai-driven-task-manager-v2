// scripts/test-nl-parser.mjs
import { parseNlTask } from "../lib/nlTaskParser.js";

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(
      `[FAIL] ${label}\n  expected: ${expected}\n  actual:   ${actual}`
    );
  }
}

function assertIncludes(haystack, needle, label) {
  if (!String(haystack).includes(String(needle))) {
    throw new Error(
      `[FAIL] ${label}\n  expected to include: ${needle}\n  actual: ${haystack}`
    );
  }
}

function run() {
  const NOW = new Date("2025-01-06T10:00:00Z"); // fixed for stable tests

  const cases = [
    {
      input: "Friday meeting at 1400 urgent",
      expect: { dueDate: "2025-01-10", dueTime: "14:00", priority: "High" },
      titleIncludes: "friday meeting",
    },
    {
      input: "next friday submit invoice asap",
      expect: { dueDate: "2025-01-10", priority: "High" },
      titleIncludes: "submit invoice",
    },
    {
      input: "in 2 days pay rent low prio",
      expect: { dueDate: "2025-01-08", priority: "Low" },
      titleIncludes: "pay rent",
    },
    {
      input: "tomorrow 2pm call dentist important",
      expect: { dueDate: "2025-01-07", dueTime: "14:00", priority: "High" },
      titleIncludes: "call dentist",
    },
    {
      input: "2025-12-31 year review critical",
      expect: { dueDate: "2025-12-31", priority: "Critical" },
      titleIncludes: "year review",
    },
  ];

  for (const c of cases) {
    const out = parseNlTask(c.input, NOW);

    if (c.expect.dueDate)
      assertEqual(out.dueDate, c.expect.dueDate, `${c.input} -> dueDate`);
    if (c.expect.dueTime)
      assertEqual(out.dueTime, c.expect.dueTime, `${c.input} -> dueTime`);
    if (c.expect.priority)
      assertEqual(out.priority, c.expect.priority, `${c.input} -> priority`);

    if (c.titleIncludes)
      assertIncludes(
        out.title.toLowerCase(),
        c.titleIncludes,
        `${c.input} -> title`
      );
    if (!out.confidence)
      throw new Error(`[FAIL] ${c.input} -> missing confidence`);
    if (!Array.isArray(out.reasons))
      throw new Error(`[FAIL] ${c.input} -> reasons must be array`);
  }

  console.log(`[OK] ${cases.length} NLP parser tests passed.`);
}

run();
