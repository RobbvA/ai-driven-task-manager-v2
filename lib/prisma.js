import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = new PrismaClient());

export default prisma;
