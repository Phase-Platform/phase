import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_MAX_CONNECTIONS: z.coerce.number().int().positive().default(10),
  DATABASE_IDLE_TIMEOUT: z.coerce.number().int().positive().default(30000),
  DATABASE_CONNECTION_TIMEOUT: z.coerce.number().int().positive().default(5000),
  DATABASE_SSL_ENABLED: z.coerce.boolean().default(false),
});

/**
 * Validate and parse environment variables
 */
export const env = envSchema.parse(process.env);

/**
 * Validate required environment variables
 */
export function validateEnv(): void {
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
