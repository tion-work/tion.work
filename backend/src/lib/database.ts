import { Pool, PoolClient } from 'pg';
import { DatabaseConfig } from '../types';

class Database {
  private pool: Pool | null = null;
  private config: DatabaseConfig;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // 使用 DATABASE_URL 环境变量
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      // 解析 DATABASE_URL 来获取数据库名称
      const url = new URL(databaseUrl);
      const databaseName = url.pathname.substring(1); // 移除开头的 '/'

      // 首先尝试连接到默认数据库来检查数据库是否存在
      const adminUrl = databaseUrl.replace(`/${databaseName}`, '/postgres');
      const adminPool = new Pool({
        connectionString: adminUrl,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // 检查目标数据库是否存在
      const adminClient = await adminPool.connect();
      const result = await adminClient.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [databaseName]
      );
      
      if (result.rows.length === 0) {
        console.log(`📦 Database '${databaseName}' does not exist, creating...`);
        await adminClient.query(`CREATE DATABASE "${databaseName}"`);
        console.log(`✅ Database '${databaseName}' created successfully`);
      }
      
      adminClient.release();
      await adminPool.end();

      // 现在连接到目标数据库
      this.pool = new Pool({
        connectionString: databaseUrl,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // 测试连接
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('🔌 Database disconnected');
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Query executed:', { text, duration, rows: result.rowCount });
      }
      
      return result;
    } catch (error) {
      console.error('❌ Database query failed:', { text, error });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }
    return this.pool.connect();
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}

// 创建数据库实例（使用 DATABASE_URL）
export const database = new Database({
  host: 'localhost', // 这些值不再使用，但保持接口兼容
  port: 5432,
  database: 'tion_work',
  username: 'postgres',
  password: 'password',
  ssl: false,
});
export default database;
