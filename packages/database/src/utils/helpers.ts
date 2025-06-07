/* eslint-disable no-unused-vars */
import console from 'console';

import type { Prisma, PrismaClient } from '@prisma/client';

export const helpers = {
  // Add your database helper functions here
  async withTransaction<T>(
    prisma: PrismaClient,
    callback: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tx: Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >
    ) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(async (tx) => callback(tx));
  },

  async handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
    // Add your error handling logic here
    console.error('Database error:', error);
    throw error;
  },
};
