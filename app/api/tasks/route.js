import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { suggestPriorityDetailed } from "../../../lib/aiPriorityEngine";

/**
 * NOTE:
 * - We need actionable debug in Vercel to fix this fast.
 * - Vercel “Production” runs with NODE_ENV=production, so your previous logic hid debug.
 * - This implementation exposes debug only when explicitly enabled via env:
 *     API_DEBUG=1
 *   (safe: you control it in Vercel env vars, and you can remove it after)
 */

function serializeError(error) {
  return {
    message: error?.message ?? String(error),
    name: error?.name,
    code: error?.code,
    // stack only if explicitly enabled
    stack: process.env.API_DEBUG === "1" ? error?.stack : undefined,
  };
}

function withDebug(base, error) {
  const enableDebug = process.env.API_DEBUG === "1";
  if (!enableDebug) return base;
  return {
    ...base,
    debug: serializeError(error),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.split("://")[0]
        : null,
    },
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

    const body = withDebug(
      {
        tasks: [],
        error: "Failed to fetch tasks",
      },
      error
    );

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
    } = body ?? {};

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
        description: typeof description === "string" ? description : "",
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

    const body = withDebug(
      {
        error: "Failed to create task",
      },
      error
    );

    return NextResponse.json(body, { status: 500 });
  }
}
