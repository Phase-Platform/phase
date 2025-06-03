import { PrismaClient, Prisma } from "@prisma/client";

export const helpers = {
  // Add your database helper functions here
  async withTransaction<T>(
    prisma: PrismaClient,
    callback: (
      tx: Omit<
        PrismaClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction(async (tx) => {
      return callback(tx);
    });
  },

  async handlePrismaError(error: any) {
    // Add your error handling logic here
    console.error("Database error:", error);
    throw error;
  },
};
