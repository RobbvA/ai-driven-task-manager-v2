import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { suggestPriorityDetailed } from "../../../lib/aiPriorityEngine";

function serializeError(error) {
  return {
    message: error?.message ?? String(error),
    name: error?.name,
    code: error?.code,
    // stack niet lekken naar clients in production
    stack: process.env.NODE_ENV === "production" ? undefined : error?.stack,
  };
}

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    const body = {
      tasks: [],
      error: "Failed to fetch tasks",
    };

    // alleen debug buiten production
    if (process.env.NODE_ENV !== "production") {
      body.debug = serializeError(error);
    }

    return NextResponse.json(body, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      status,
      priority,
      progress,
      dueDate,
      prioritySource, // "ai" | "manual"
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const source = prioritySource === "ai" ? "ai" : "manual";

    let finalPriority = priority ?? "Medium";
    let priorityScore = null;
    let priorityReasons = null;
    let priorityModelVersion = null;

    if (source === "ai") {
      const detailed = suggestPriorityDetailed(title);
      finalPriority = detailed.priority;
      priorityScore = detailed.score;
      priorityReasons = detailed.reasons; // JSON
      priorityModelVersion = detailed.modelVersion;
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ?? "",
        status: status ?? "To Do",
        priority: finalPriority,
        prioritySource: source,
        priorityScore,
        priorityReasons,
        priorityModelVersion,
        progress:
          typeof progress === "number" && !Number.isNaN(progress)
            ? progress
            : 0,
        dueDate: dueDate ?? null,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);

    const body = {
      error: "Failed to create task",
    };

    if (process.env.NODE_ENV !== "production") {
      body.debug = serializeError(error);
    }

    return NextResponse.json(body, { status: 500 });
  }
}
