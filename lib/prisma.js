// lib/prisma.js
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis;

function createClient() {
  const hasTurso =
    process.env.NODE_ENV === "production" &&
    process.env.TURSO_DATABASE_URL &&
    process.env.TURSO_AUTH_TOKEN;

  if (hasTurso) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // Local fallback: uses DATABASE_URL from .env.local (file:./prisma/dev.db)
  return new PrismaClient();
}

const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
