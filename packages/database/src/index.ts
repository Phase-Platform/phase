import { DatabaseClient } from './client';
import type { DatabaseConfig } from './types';

// Create a singleton instance
let db: DatabaseClient | null = null;

export const getDatabase = (config: DatabaseConfig): DatabaseClient => {
  if (!db) {
    db = new DatabaseClient(config);
  }
  return db;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
  }
};

// Export types and client
export { DatabaseClient } from './client';
export { prisma } from './prisma';
export * from './types';

// Export Prisma types and enums
export {
  BugStatus,
  FeatureStatus,
  Priority,
  type Prisma,
  type PrismaClient,
  ProjectRole,
  ProjectStatus,
  Severity,
  SprintStatus,
  UserRole,
} from '@prisma/client';
