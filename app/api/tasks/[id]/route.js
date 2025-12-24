// app/api/tasks/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// Helper: Next.js route params zijn in Next 16 gewoon een object.
// We tolereren meerdere vormen om build/edge verschillen te overleven.
function getIdFromContext(context) {
  const p = context?.params;
  // Soms komt dit als Promise in oudere snippets; we ondersteunen beide zonder crash.
  if (p && typeof p.then === "function") {
    // Let op: we mogen hier niet async worden in helper, dus caller handelt dit af
    return null;
  }
  return p?.id ?? null;
}

export async function PATCH(request, context) {
  try {
    let id = getIdFromContext(context);

    // Fallback als iemand ooit "params is Promise" code had:
    if (!id && context?.params && typeof context.params.then === "function") {
      const resolved = await context.params;
      id = resolved?.id ?? null;
    }

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, progress, title, description, priority, dueDate } =
      body ?? {};

    const data = {};
    if (status !== undefined) data.status = status;
    if (progress !== undefined) data.progress = progress;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = priority;
    if (dueDate !== undefined) data.dueDate = dueDate;

    const updatedTask = await prisma.task.update({
      where: { id: String(id) },
      data,
    });

    // consistent response shape
    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "Failed to update task",
        details:
          process.env.NODE_ENV === "production" ? undefined : error?.message,
        code: error?.code ?? null,
        meta:
          process.env.NODE_ENV === "production"
            ? undefined
            : error?.meta ?? null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    let id = getIdFromContext(context);

    if (!id && context?.params && typeof context.params.then === "function") {
      const resolved = await context.params;
      id = resolved?.id ?? null;
    }

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 }
      );
    }

    const deletedTask = await prisma.task.delete({
      where: { id: String(id) },
    });

    return NextResponse.json(
      {
        message: "Task deleted",
        task: deletedTask,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: "Failed to delete task",
        details:
          process.env.NODE_ENV === "production" ? undefined : error?.message,
        code: error?.code ?? null,
        meta:
          process.env.NODE_ENV === "production"
            ? undefined
            : error?.meta ?? null,
      },
      { status: 500 }
    );
  }
}
