export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  url?: string;
}

export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  transaction<T>(
    callback: (connection: DatabaseConnection) => Promise<T>,
  ): Promise<T>;
}

export interface DatabaseMigration {
  version: number;
  name: string;
  up: string;
  down: string;
}
