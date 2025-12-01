// lib/aiNextTaskSuggester.js

// Simple "AI" that suggests the next best task to work on.
//
// Idee:
// - we negeren 'Done' taken
// - Critical en High krijgen hogere score dan Medium/Low
// - To Do én lage progress krijgen een plusje
// - Vroegere dueDate = hogere score
//
// Later kun je dit vervangen door een echte LLM-call,
// maar de UI hoeft dan niet te veranderen.

const priorityScore = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const statusBonus = {
  "To Do": 2,
  "In Progress": 1,
  Done: -10, // we willen hier nooit op uitkomen
};

export function suggestNextTask(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return null;

  let bestTask = null;
  let bestScore = -Infinity;

  for (const task of tasks) {
    // Sla "Done" taken expliciet over
    if (task.status === "Done") continue;

    const pScore = priorityScore[task.priority] ?? 1;
    const sBonus = statusBonus[task.status] ?? 0;

    // progress: hoe lager, hoe belangrijker om op te pakken
    const progress = typeof task.progress === "number" ? task.progress : 0;
    const progressScore = (100 - progress) / 25; // 0–4 range ongeveer

    // dueDate: hoe eerder de datum, hoe hoger de score
    let dueScore = 0;
    if (task.dueDate) {
      const now = new Date();
      const due = new Date(task.dueDate);
      const diffDays = (due - now) / (1000 * 60 * 60 * 24);

      if (!Number.isNaN(diffDays)) {
        if (diffDays < 0) {
          // overdue
          dueScore = 4;
        } else if (diffDays <= 1) {
          dueScore = 3;
        } else if (diffDays <= 3) {
          dueScore = 2;
        } else if (diffDays <= 7) {
          dueScore = 1;
        }
      }
    }

    // Totale score
    const totalScore =
      pScore * 3 + // priority weegt zwaar
      sBonus * 2 +
      progressScore +
      dueScore;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestTask = task;
    }
  }

  return bestTask;
}
