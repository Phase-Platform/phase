import { z } from 'zod';
import { DatabaseConfig } from '@phase/types';

export const databaseConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});

export const validateDatabaseConfig = (config: unknown): DatabaseConfig => {
  return databaseConfigSchema.parse(config);
};

export const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

export const isDevelopment = () => getEnvironment() === 'development';
export const isProduction = () => getEnvironment() === 'production';
export const isTest = () => getEnvironment() === 'test';
