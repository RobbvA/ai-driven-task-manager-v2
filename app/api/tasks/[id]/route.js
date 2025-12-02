// app/api/tasks/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// PATCH /api/tasks/:id  → status / progress / title / description / priority / dueDate bijwerken
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { status, progress, title, description, priority, dueDate } = body;

    const data = {};

    if (status !== undefined) data.status = status;
    if (progress !== undefined) data.progress = progress;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = priority;
    if (dueDate !== undefined) data.dueDate = dueDate;

    console.log("PATCH /api/tasks (by title)", { title, data });

    // Praktische workaround: update op basis van title
    const result = await prisma.task.updateMany({
      where: { title: title },
      data,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Haal de geüpdatete task op (nieuwste met deze title)
    const updated = await prisma.task.findFirst({
      where: { title: title },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating task:", error);

    return NextResponse.json(
      {
        error: "Failed to update task",
        details: error.message,
        code: error.code ?? null,
        meta: error.meta ?? null,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id  → task verwijderen (nog wel op id)
export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    console.log("DELETE /api/tasks/:id", { id });

    await prisma.task.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);

    return NextResponse.json(
      {
        error: "Failed to delete task",
        details: error.message,
        code: error.code ?? null,
        meta: error.meta ?? null,
      },
      { status: 500 }
    );
  }
}
