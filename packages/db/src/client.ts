import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma client factory (shared by both apps and tests).
 *
 * Summary:
 * - Prisma needs a DATABASE_URL (SQLite file path in our case).
 * - Tests may provide TEST_DATABASE_URL so we can isolate test DBs.
 * - In dev, we reuse a single PrismaClient instance to avoid "too many connections"
 *   and to make hot reload stable.
 */
export const createClient = () => {
  if (global.prisma) {
    return global.prisma;
  }

  const URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!URL) {
    throw new Error(
      "DATABASE_URL (or TEST_DATABASE_URL) is not set. Set it to something like: file:./dev.db",
    );
  }

  const prisma = new PrismaClient({
    datasourceUrl: URL,
  });

  console.log("Connected to database");
  console.log(URL);

  global.prisma = prisma;
  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};
