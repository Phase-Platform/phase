import { Pool } from 'pg';
import { DatabaseConfig, DatabaseConnection } from '@phase/types';
import { DatabaseClient } from './client';

// Create a singleton instance
let db: DatabaseClient | null = null;

export const getDatabase = (config: DatabaseConfig): DatabaseClient => {
  if (!db) {
    db = new DatabaseClient(config);
  }
  return db;
};

// Export types
export type { DatabaseConfig, DatabaseConnection } from '@phase/types';
export { DatabaseClient } from './client';
