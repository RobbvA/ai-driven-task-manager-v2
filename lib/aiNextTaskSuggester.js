// lib/aiNextTaskSuggester.js

const MODEL_VERSION = "next_task_rules_v1";

const PRIORITY_RANK = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

function safePriorityRank(priority) {
  return PRIORITY_RANK[priority] ?? 2;
}

function parseDueDate(dueDate) {
  if (!dueDate || typeof dueDate !== "string") return null;

  // Support "YYYY-MM-DD" and other parseable formats
  const d = new Date(dueDate);
  // invalid date check
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function daysFromNow(dateObj) {
  const now = new Date();
  const ms = dateObj.getTime() - now.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * @typedef {Object} NextTaskReason
 * @property {string} ruleId
 * @property {string} rationale
 * @property {number} weight
 */

/**
 * @typedef {Object} NextTaskSuggestion
 * @property {string} modelVersion
 * @property {string|null} taskId
 * @property {number} score
 * @property {NextTaskReason[]} reasons
 * @property {string} summary
 */

/**
 * Detailed explainable next-task suggestion
 * @param {Array} tasks
 * @returns {NextTaskSuggestion|null}
 */
export function suggestNextTaskDetailed(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return null;

  // Consider only tasks that are not Done
  const candidates = tasks.filter((t) => t && t.status !== "Done");
  if (candidates.length === 0) {
    return {
      modelVersion: MODEL_VERSION,
      taskId: null,
      score: 0,
      reasons: [],
      summary: "All tasks are done; no next task suggestion.",
    };
  }

  let best = null;

  for (const t of candidates) {
    let score = 0;
    /** @type {NextTaskReason[]} */
    const reasons = [];

    // Priority weight (dominant)
    const pr = safePriorityRank(t.priority);
    const priorityScore = pr * 20; // 20..80
    score += priorityScore;
    reasons.push({
      ruleId: "PRIORITY_WEIGHT",
      rationale: `Priority (${t.priority || "Medium"}) increases urgency.`,
      weight: priorityScore,
    });

    // Status weight
    if (t.status === "In Progress") {
      score += 15;
      reasons.push({
        ruleId: "IN_PROGRESS_BOOST",
        rationale: "In Progress tasks get a boost to reduce context switching.",
        weight: 15,
      });
    } else if (t.status === "To Do") {
      score += 5;
      reasons.push({
        ruleId: "TODO_BASE",
        rationale: "To Do tasks remain eligible for selection.",
        weight: 5,
      });
    }

    // Progress weight (prefer higher progress = quick win / finishing)
    if (typeof t.progress === "number" && !Number.isNaN(t.progress)) {
      const progressBoost = Math.min(
        20,
        Math.max(0, Math.round(t.progress / 5))
      ); // 0..20
      score += progressBoost;
      reasons.push({
        ruleId: "PROGRESS_FINISH_BONUS",
        rationale: `Higher progress (${t.progress}%) increases likelihood to finish.`,
        weight: progressBoost,
      });
    }

    // Due date weight (if parseable)
    const due = parseDueDate(t.dueDate);
    if (due) {
      const d = daysFromNow(due);

      // Overdue: strong boost
      if (d < 0) {
        score += 25;
        reasons.push({
          ruleId: "DUE_OVERDUE",
          rationale: "Overdue tasks are prioritized.",
          weight: 25,
        });
      } else if (d <= 1) {
        score += 18;
        reasons.push({
          ruleId: "DUE_SOON",
          rationale: "Due very soon (≤ 1 day) increases priority.",
          weight: 18,
        });
      } else if (d <= 7) {
        score += 10;
        reasons.push({
          ruleId: "DUE_WEEK",
          rationale: "Due within a week increases priority.",
          weight: 10,
        });
      } else {
        score += 2;
        reasons.push({
          ruleId: "DUE_LATER",
          rationale: "Due date exists but is not soon.",
          weight: 2,
        });
      }
    }

    // Slight penalty if title missing/empty (quality)
    if (!t.title || typeof t.title !== "string" || !t.title.trim()) {
      score -= 10;
      reasons.push({
        ruleId: "MISSING_TITLE_PENALTY",
        rationale: "Tasks with missing titles are deprioritized.",
        weight: -10,
      });
    }

    // clamp
    score = Math.max(0, Math.min(100, score));

    // pick best
    if (!best || score > best.score) {
      best = {
        taskId: t.id,
        score,
        reasons,
        summary: `Selected based on priority, status, progress, and due date signals.`,
        modelVersion: MODEL_VERSION,
      };
    }
  }

  return best;
}

/**
 * Backwards compatible: returns the chosen task object (or null)
 * @param {Array} tasks
 */
export function suggestNextTask(tasks) {
  const detailed = suggestNextTaskDetailed(tasks);
  if (!detailed || !detailed.taskId) return null;
  return tasks.find((t) => t.id === detailed.taskId) ?? null;
}
