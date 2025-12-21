# AI Driven Task Manager (v2)

A modern task manager built with Next.js that demonstrates **deterministic AI logic**, clean UI architecture, and explainable decision-making — without relying on external AI APIs.

This project focuses on **clarity, control, and transparency** instead of black-box automation.

---

## ✨ Core Idea

Most “AI-powered” apps simply forward decisions to an external model.
This project takes a different approach.

**AI Driven Task Manager** implements a **rule-based decision engine** that:

- Assigns task priority using deterministic logic
- Explains _why_ a task received a certain priority
- Allows full manual override by the user

The result is an application that behaves intelligently **and remains predictable and debuggable**.

---

## 🧠 AI Logic (No External AI APIs)

> ⚠️ Important:  
> This project does **not** call OpenAI, GPT, or any other external AI service.

Instead, it uses **custom-written AI logic** based on:

- Deterministic rules
- Scoring heuristics
- Contextual task metadata

### How priority is determined

Each task is evaluated on factors such as:

- Urgency (due date proximity)
- Keywords in title / description
- Task complexity signals
- Manual user intent

These factors are combined into:

- A **priority score**
- A **priority label** (Low / Medium / High / Critical)
- A list of **matched rules**

### Explainability

When a task is assigned an AI priority, the UI shows:

- The calculated score
- The matched rules
- Why those rules led to the final priority

This makes the system:

- Transparent
- Testable
- Suitable for real-world production use

---

## 🛠 Tech Stack

### Frontend

- **Next.js (App Router)**
- **React**
- **Chakra UI v3**
- **Lucide Icons**

### Backend

- **Next.js API Routes**
- REST-style endpoints
- Server-side task persistence

### Architecture

- Component-driven UI
- Clear separation between:
  - UI
  - business logic
  - AI decision engine
- No global state libraries — local state where appropriate

---

## 📦 Key Features

- Create, edit, and delete tasks
- Status flow:
  - To Do → In Progress → Done
- Progress tracking (realistic, not binary)
- Due dates
- Filtering by status and priority
- Sorting by:
  - priority
  - progress
  - due date
- AI-powered next task suggestion
- Priority explainability UI
- Fully responsive layout

---

## 🎯 Design Philosophy

This project intentionally prioritizes:

- Readability over cleverness
- Explicit logic over abstraction
- UX clarity over feature overload

Every decision is meant to answer:

> “Would another developer immediately understand this?”

---

## 🚀 Getting Started

````bash
git clone https://github.com/RobbvA/ai-driven-task-manager-v2.git
cd ai-driven-task-manager-v2
npm install
npm run dev

# AI Driven Task Manager (v2)

A modern task manager built with Next.js that demonstrates **deterministic AI logic**, clean UI architecture, and explainable decision-making — without relying on external AI APIs.

This project focuses on **clarity, control, and transparency** instead of black-box automation.

---

## ✨ Core Idea

Most “AI-powered” apps simply forward decisions to an external model.
This project takes a different approach.

**AI Driven Task Manager** implements a **rule-based decision engine** that:
- Assigns task priority using deterministic logic
- Explains *why* a task received a certain priority
- Allows full manual override by the user

The result is an application that behaves intelligently **and remains predictable and debuggable**.

---

## 🧠 AI Logic (No External AI APIs)

> ⚠️ Important:
> This project does **not** call OpenAI, GPT, or any other external AI service.

Instead, it uses **custom-written AI logic** based on:

- Deterministic rules
- Scoring heuristics
- Contextual task metadata

### How priority is determined
Each task is evaluated on factors such as:
- Urgency (due date proximity)
- Keywords in title / description
- Task complexity signals
- Manual user intent

These factors are combined into:
- A **priority score**
- A **priority label** (Low / Medium / High / Critical)
- A list of **matched rules**

### Explainability
When a task is assigned an AI priority, the UI shows:
- The calculated score
- The matched rules
- Why those rules led to the final priority

This makes the system:
- Transparent
- Testable
- Suitable for real-world production use

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **Chakra UI v3**
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- REST-style endpoints
- Server-side task persistence

### Architecture
- Component-driven UI
- Clear separation between:
  - UI
  - business logic
  - AI decision engine
- No global state libraries — local state where appropriate

---

## 📦 Key Features

- Create, edit, and delete tasks
- Status flow:
  - To Do → In Progress → Done
- Progress tracking (realistic, not binary)
- Due dates
- Filtering by status and priority
- Sorting by:
  - priority
  - progress
  - due date
- AI-powered next task suggestion
- Priority explainability UI
- Fully responsive layout

---

## 🎯 Design Philosophy

This project intentionally prioritizes:
- Readability over cleverness
- Explicit logic over abstraction
- UX clarity over feature overload

Every decision is meant to answer:
> “Would another developer immediately understand this?”

---

## 🚀 Getting Started

```bash
git clone https://github.com/RobbvA/ai-driven-task-manager-v2.git
cd ai-driven-task-manager-v2
npm install
npm run dev

Then open:

http://localhost:3000

Project Structure (simplified)
/app
  /api
    /tasks
  layout.js
  page.js

/components
  TaskTable.jsx
  AddTaskBar.jsx
  TaskFilters.jsx
  TaskPriorityFilters.jsx
  TaskSortBar.jsx
  NextTaskBanner.jsx
  TaskEditModal.jsx
  Topbar.jsx

/lib
  aiNextTaskSuggester.js

📌 Why This Project Exists

This project exists to demonstrate:

Architectural thinking before feature building

AI logic that can be explained and reasoned about

Professional UI/UX decisions

Clean, maintainable React code

It is designed as a portfolio-grade application, not a demo toy.

👤 Author

Built by dev.robb
GitHub: https://github.com/RobbvA

````
