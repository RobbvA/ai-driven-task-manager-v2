// data/tasks.js

// This is the initial mock data for the dashboard.
// Later we can replace this with real data from a database or API.
export const initialTasks = [
  {
    id: "t-1",
    title: "Refactor dashboard layout",
    description:
      "Clean up the layout and improve spacing for better readability.",
    status: "In Progress", // "To Do" | "In Progress" | "Done"
    priority: "High", // "Low" | "Medium" | "High" | "Critical"
    dueDate: "2025-12-05",
    progress: 40, // 0–100
  },
  {
    id: "t-2",
    title: "Fix login bug",
    description:
      "Users occasionally get logged out after refresh. Investigate session handling.",
    status: "To Do",
    priority: "Critical",
    dueDate: "2025-12-03",
    progress: 0,
  },
  {
    id: "t-3",
    title: "Write unit tests for task API",
    description: "Cover create/update/delete endpoints with basic tests.",
    status: "To Do",
    priority: "Medium",
    dueDate: "2025-12-10",
    progress: 10,
  },
  {
    id: "t-4",
    title: "Improve loading states",
    description:
      "Add skeletons and subtle spinners for slow network connections.",
    status: "Done",
    priority: "Low",
    dueDate: "2025-11-30",
    progress: 100,
  },
];
