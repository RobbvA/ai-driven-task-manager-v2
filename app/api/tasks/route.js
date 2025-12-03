// app/api/tasks/route.js
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/tasks → lijst met alle tasks (laatste eerst)
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks → nieuwe task aanmaken
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, status, priority, progress, dueDate } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ?? "",
        status: status ?? "To Do",
        priority: priority ?? "Medium",
        progress:
          typeof progress === "number" && !Number.isNaN(progress)
            ? progress
            : 0,
        // dueDate is String? in schema → we laten dat zo
        dueDate: dueDate ?? null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);

    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
