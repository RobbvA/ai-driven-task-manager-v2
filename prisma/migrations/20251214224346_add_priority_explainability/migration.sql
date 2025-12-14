-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'To Do',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "prioritySource" TEXT NOT NULL DEFAULT 'manual',
    "priorityScore" INTEGER,
    "priorityReasons" JSONB,
    "priorityModelVersion" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Task" ("createdAt", "description", "dueDate", "id", "priority", "progress", "status", "title") SELECT "createdAt", "description", "dueDate", "id", "priority", "progress", "status", "title" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
