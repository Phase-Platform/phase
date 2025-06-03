import { Pool, PoolClient } from 'pg';
import { DatabaseConfig, DatabaseConnection } from '@phase-platform/types';
import { env } from './env';

export class DatabaseClient implements DatabaseConnection {
  private pool: Pool;
  private client: PoolClient | null = null;

  constructor(config?: Partial<DatabaseConfig>) {
    // Parse DATABASE_URL if not provided with config
    const dbUrl = new URL(env.DATABASE_URL);

    this.pool = new Pool({
      host: config?.host || dbUrl.hostname,
      port: config?.port || parseInt(dbUrl.port),
      user: config?.username || dbUrl.username,
      password: config?.password || dbUrl.password,
      database: config?.database || dbUrl.pathname.slice(1),
      max: env.DATABASE_MAX_CONNECTIONS,
      idleTimeoutMillis: env.DATABASE_IDLE_TIMEOUT,
      connectionTimeoutMillis: env.DATABASE_CONNECTION_TIMEOUT,
    });
  }

  async connect(): Promise<void> {
    this.client = await this.pool.connect();
  }

  async close(): Promise<void> {
    if (this.client) {
      this.client.release();
      this.client = null;
    }
    await this.pool.end();
  }

  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const client = this.client || (await this.pool.connect());
    try {
      const result = await client.query(sql, params);
      return result.rows as T[];
    } finally {
      if (!this.client) {
        client.release();
      }
    }
  }

  async transaction<T>(
    callback: (connection: DatabaseConnection) => Promise<T>
  ): Promise<T> {
    const client = this.client || (await this.pool.connect());
    try {
      await client.query('BEGIN');
      const result = await callback(this);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      if (!this.client) {
        client.release();
      }
    }
  }
}
