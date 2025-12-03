// app/api/tasks/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// PATCH /api/tasks/:id → status / progress / title / description / priority / dueDate bijwerken
export async function PATCH(request, context) {
  try {
    const { params } = context;
    const { id } = await params; // ⬅️ belangrijk: params is een Promise in Next 15

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, progress, title, description, priority, dueDate } = body;

    const data = {};

    if (status !== undefined) data.status = status;
    if (progress !== undefined) data.progress = progress;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = priority;
    if (dueDate !== undefined) data.dueDate = dueDate;

    console.log("PATCH /api/tasks/:id", { id, data });

    const updatedTask = await prisma.task.update({
      where: { id: String(id) },
      data,
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);

    // Prisma: record not found → nettere 404
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

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

// DELETE /api/tasks/:id → task verwijderen op id
export async function DELETE(request, context) {
  try {
    const { params } = context;
    const { id } = await params; // ⬅️ idem: eerst awaiten

    if (!id) {
      return NextResponse.json(
        { error: "Task id is required" },
        { status: 400 }
      );
    }

    console.log("DELETE /api/tasks/:id", { id });

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

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

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
