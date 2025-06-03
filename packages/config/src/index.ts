import { z } from "zod";

// Define DatabaseConfig locally instead of importing from '@phase/types'
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const databaseConfigSchema = z.object({
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});

export const validateDatabaseConfig = (config: unknown): DatabaseConfig =>
  databaseConfigSchema.parse(config);

export const getEnvironment = () => process.env.NODE_ENV ?? "development";

export const isDevelopment = () => getEnvironment() === "development";
export const isProduction = () => getEnvironment() === "production";
export const isTest = () => getEnvironment() === "test";
