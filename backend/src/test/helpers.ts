import type { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "../infrastructure/database/prisma";
import { app } from "../app";
type TableName = { tablename: string };
export async function cleanDatabase() {
  const tablenames = await prisma.$queryRawUnsafe<TableName[]>(
    `SELECT tablename FROM pg_tables WHERE schemaname='public'`,
  );
  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
    }
  }
}
export { app, prisma };
export type { PrismaClient };