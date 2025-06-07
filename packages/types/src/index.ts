/* eslint-disable @typescript-eslint/no-unused-vars */

// Re-export from other modules
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

// Re-export Prisma types (only if @prisma/client is available)
export {
  BugStatus,
  FeatureStatus,
  Priority,
  ProjectRole,
  ProjectStatus,
  Severity,
  SprintStatus,
  UserRole,
} from '@prisma/client';
