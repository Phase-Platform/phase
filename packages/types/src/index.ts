export * from './common';
export * from './api';
export * from './database';

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
}
