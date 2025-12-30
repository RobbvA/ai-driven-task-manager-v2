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

AI Driven Task Manager (v2)

A portfolio-grade task management application built with Next.js, demonstrating deterministic AI logic, explainable decision-making, and clean UI architecture — without relying on external AI APIs or black-box models.

This project focuses on clarity, control, and predictability rather than opaque automation.

🎯 Project Intent

Most “AI-powered” task managers delegate decisions to external LLMs and present the output as truth.

This project deliberately takes a different approach.

AI Driven Task Manager is designed to show how intelligent behavior can be achieved using:

deterministic logic

transparent scoring

explicit architectural choices

The goal is to demonstrate product thinking and system design, not feature density.

🧠 Deterministic AI (No External APIs)

⚠️ This project does not call OpenAI, GPT, or any other external AI service.

Instead, all “AI” behavior is implemented through a custom, rule-based decision engine.

How task priority is determined

Each task is evaluated using deterministic heuristics such as:

due date proximity (urgency)

semantic signals in title and description

task complexity indicators

explicit user intent

These inputs are combined into:

a numeric priority score

a final priority label (Low / Medium / High / Critical)

a list of matched decision rules

Explainability as a core feature

Whenever AI priority is applied, the UI exposes:

the calculated score

the contributing rules

the reasoning behind the final outcome

This makes the system:

predictable

debuggable

testable

suitable for real-world production use

Manual override is always possible.

🤔 Why No LLMs?

Large language models are powerful, but not always appropriate.

For task prioritization, this project prioritizes:

determinism over probabilistic output

explainability over plausibility

control over automation

The same input will always produce the same output.

This trade-off is intentional and central to the project’s design.

🛠 Tech Stack
Frontend

Next.js 16 (App Router)

React

Chakra UI v3

Token-based design system

Fully responsive, mobile-first layout

Backend

Next.js Route Handlers

Prisma ORM

PostgreSQL (remote, Vercel-compatible)

Deployment

Vercel

Production-ready build pipeline

🧱 Architecture Overview

Key architectural decisions:

State and data-flow live in app/page.js

UI components are intentionally dumb

Business logic and AI logic are isolated in /lib

Explainability is treated as a first-class concern

This structure keeps the system understandable and easy to reason about.

📦 Key Features

Create, edit, and delete tasks

Status flow:

To Do → In Progress → Done

Realistic progress tracking (not binary)

Due dates

Filtering by status and priority

Sorting by:

priority

progress

due date

AI-powered “Next Task” suggestion

Full priority explainability UI

Responsive layout with accessible interactions

🎨 Design Philosophy

This project intentionally favors:

readability over clever abstractions

explicit logic over hidden behavior

UX clarity over visual noise

Every decision is guided by the question:

“Would another developer immediately understand what is happening here?”

🚀 Getting Started (Local Development)
git clone https://github.com/RobbvA/ai-driven-task-manager-v2.git
cd ai-driven-task-manager-v2
npm install
npm run dev

Then open:

http://localhost:3000

Note: a PostgreSQL database is required.
See .env.example for required environment variables.

📁 Project Structure (Simplified)
/app
/api
/tasks
layout.js
page.js

/components
AddTaskBar.jsx
TaskTable.jsx
TaskFilters.jsx
TaskPriorityFilters.jsx
TaskSortBar.jsx
NextTaskBanner.jsx
TaskEditModal.jsx
Topbar.jsx
Footer.jsx

/lib
aiNextTaskSuggester.js
prisma.js

📌 Why This Project Exists

This project exists to demonstrate:

architectural thinking before feature building

deterministic, explainable AI logic

professional UI/UX decision-making

clean, maintainable React and Next.js code

It is intentionally built as a portfolio-quality application, not a demo toy.

👤 Author

Built by dev.robb
GitHub: https://github.com/RobbvA
