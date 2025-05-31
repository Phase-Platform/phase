import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Environment
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Optional configurations
  DATABASE_MAX_CONNECTIONS: z.string().transform(Number).optional(),
  DATABASE_IDLE_TIMEOUT: z.string().transform(Number).optional(),
  DATABASE_CONNECTION_TIMEOUT: z.string().transform(Number).optional(),
});

/**
 * Validate and parse environment variables
 */
export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_MAX_CONNECTIONS: process.env.DATABASE_MAX_CONNECTIONS,
  DATABASE_IDLE_TIMEOUT: process.env.DATABASE_IDLE_TIMEOUT,
  DATABASE_CONNECTION_TIMEOUT: process.env.DATABASE_CONNECTION_TIMEOUT,
});

/**
 * Type for environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * @throws {Error} if environment variables are invalid
 */
export function validateEnv() {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join('.'))
        .join(', ');
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}`
      );
    }
    throw error;
  }
}
