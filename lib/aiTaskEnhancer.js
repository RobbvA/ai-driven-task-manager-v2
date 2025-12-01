// lib/aiTaskEnhancer.js

// Rule-based "AI" task description enhancer.
// Works with both English and Dutch titles,
// so later you can swap this for a real LLM call without changing the UI.
export function enhanceTaskDescription(title, existingDescription = "") {
  if (!title || !title.trim()) return existingDescription || "";

  const trimmedTitle = title.trim();
  const text = trimmedTitle.toLowerCase();

  // If the user already wrote a decent description, don't overwrite it.
  if (existingDescription && existingDescription.length > 40) {
    return existingDescription;
  }

  // BUG / ERROR TASKS
  if (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("fout") ||
    text.includes("fix") ||
    text.includes("werkt niet") ||
    text.includes("crash") ||
    text.includes("broken")
  ) {
    return (
      "Investigate and fix: " +
      trimmedTitle +
      ". Reproduce the issue, identify the root cause, apply a fix and add a regression test to prevent it from happening again."
    );
  }

  // AUTH / LOGIN TASKS
  if (
    text.includes("login") ||
    text.includes("log in") ||
    text.includes("inloggen") ||
    text.includes("auth") ||
    text.includes("token") ||
    text.includes("session") ||
    text.includes("wachtwoord")
  ) {
    return (
      "Improve authentication flow for: " +
      trimmedTitle +
      ". Check validation, error feedback, session handling and security to make logging in reliable and user-friendly."
    );
  }

  // UI / UX / LAYOUT / DESIGN TASKS
  if (
    text.includes("layout") ||
    text.includes("design") ||
    text.includes("ontwerp") ||
    text.includes("ui") ||
    text.includes("ux") ||
    text.includes("styling") ||
    text.includes("interface")
  ) {
    return (
      "Refine the user experience for: " +
      trimmedTitle +
      ". Clarify spacing, typography and interactions so the screen feels clean, calm and easy to scan."
    );
  }

  // PERFORMANCE / OPTIMISATION TASKS
  if (
    text.includes("performance") ||
    text.includes("snelheid") ||
    text.includes("optimize") ||
    text.includes("optimaliseer") ||
    text.includes("caching") ||
    text.includes("lazy load")
  ) {
    return (
      "Improve performance for: " +
      trimmedTitle +
      ". Measure the current bottlenecks, apply targeted optimizations and verify the impact with before/after metrics."
    );
  }

  // REFACTOR / CLEANUP TASKS
  if (
    text.includes("refactor") ||
    text.includes("cleanup") ||
    text.includes("opschonen") ||
    text.includes("herstructureren") ||
    text.includes("tech debt")
  ) {
    return (
      "Refactor the code related to: " +
      trimmedTitle +
      ". Simplify the structure, remove duplication and make the logic easier to read, test and extend."
    );
  }

  // DEFAULT: GENERIC TASK TEMPLATE
  return (
    "Clarify and complete the task: " +
    trimmedTitle +
    ". Define the goal, break it down into small steps and capture any acceptance criteria so it’s easy to start and finish."
  );
}
