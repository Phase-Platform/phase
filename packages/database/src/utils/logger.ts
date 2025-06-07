import { type Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logger = {
  error: async (message: string, error?: unknown) => {
    // Log to database
    await prisma.activityLog.create({
      data: {
        type: 'ERROR',
        description: message,
        metadata: error ? { error: String(error) } : undefined,
        userId: 'system',
        projectId: 'system',
      },
    });
  },
  warn: async (message: string, metadata?: Prisma.InputJsonValue) => {
    await prisma.activityLog.create({
      data: {
        type: 'WARN',
        description: message,
        metadata,
        userId: 'system',
        projectId: 'system',
      },
    });
  },
  info: async (message: string, metadata?: Prisma.InputJsonValue) => {
    await prisma.activityLog.create({
      data: {
        type: 'INFO',
        description: message,
        metadata,
        userId: 'system',
        projectId: 'system',
      },
    });
  },
};
