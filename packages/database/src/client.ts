import { logger } from './utils/logger';
import { env } from './env';
import type { DatabaseConfig, DatabaseConnection } from './types';
import { PrismaClient } from '@prisma/client';

class PrismaSingleton {
  private static instance: PrismaClient | null = null;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        datasources: {
          db: {
            url: env.DATABASE_URL,
          },
        },
        log: ['error', 'warn'],
      });

      // Handle connection lifecycle
      process.on('beforeExit', async () => {
        if (PrismaSingleton.instance) {
          await PrismaSingleton.instance.$disconnect();
          PrismaSingleton.instance = null;
        }
      });
    }
    return PrismaSingleton.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaSingleton.instance) {
      await PrismaSingleton.instance.$disconnect();
      PrismaSingleton.instance = null;
    }
  }
}

export const prisma = PrismaSingleton.getInstance();

export class DatabaseClient implements DatabaseConnection {
  private isConnected: boolean = false;

  constructor(config?: Partial<DatabaseConfig>) {
    // Parse DATABASE_URL if not provided with config
    const dbUrl = new URL(env.DATABASE_URL);

    // Handle connection lifecycle
    process.on('beforeExit', async () => {
      await this.close();
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await prisma.$connect();
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
      throw new Error(
        `Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async close(): Promise<void> {
    await prisma.$disconnect();
    this.isConnected = false;
  }

  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const result = await prisma.$queryRawUnsafe<T[]>(sql, ...(params || []));
      return result;
    } catch (error) {
      throw new Error(
        `Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      return await prisma.$transaction(callback);
    } catch (error) {
      throw new Error(
        `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
