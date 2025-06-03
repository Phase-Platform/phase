/* eslint-disable @typescript-eslint/no-unused-vars */
export * from './api';
export * from './common';

// Common types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  url?: string;
}

export interface DatabaseConnection {
  query: <T>(sql: string, params?: unknown[]) => Promise<T[]>;
  connect: () => Promise<void>;
  close: () => Promise<void>;
}
