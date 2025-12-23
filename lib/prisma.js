// lib/prisma.js
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) throw new Error("Missing TURSO_DATABASE_URL (or DATABASE_URL).");
  if (!authToken) throw new Error("Missing TURSO_AUTH_TOKEN.");

  const libsql = createClient({ url, authToken });
  const adapter = new PrismaLibSql(libsql);

  return new PrismaClient({ adapter });
}

const prisma =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());

export default prisma;
