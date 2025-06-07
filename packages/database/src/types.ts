/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  url?: string;
}

/**
 * Database connection interface
 */
export interface DatabaseConnection {
  query: <T>(sql: string, params?: unknown[]) => Promise<T[]>;
  connect: () => Promise<void>;
  close: () => Promise<void>;
  transaction: <T>(callback: () => Promise<T>) => Promise<T>;
}
