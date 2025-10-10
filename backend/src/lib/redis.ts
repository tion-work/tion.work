import { createClient } from "redis";
import { RedisConfig } from "../types";
import logger from "./logger";

class Redis {
  private client: any = null;
  private config: RedisConfig;

  constructor(config: RedisConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // 优先使用 REDIS_URL 环境变量
      const redisUrl = process.env["REDIS_URL"];
      if (redisUrl) {
        this.client = createClient({
          url: redisUrl,
        });
      } else {
        const options: any = {
          socket: {
            host: this.config.host,
            port: this.config.port,
          },
          database: this.config.db || 0,
        };

        if (this.config.password) {
          options.password = this.config.password;
        }

        this.client = createClient(options);
      }

      this.client.on("error", (err: Error) => {
        logger.error("Redis Client Error:", err);
      });

      this.client.on("connect", () => {
        logger.info("Redis Client Connected");
      });

      this.client.on("ready", () => {
        logger.info("Redis Client Ready");
      });

      this.client.on("end", () => {
        logger.info("Redis Client Disconnected");
      });

      await this.client.connect();
      console.log("✅ Redis connected successfully");
    } catch (error) {
      console.error("❌ Redis connection failed:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      console.log("🔌 Redis disconnected");
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }

    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.exists(key);
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.ttl(key);
  }

  async incr(key: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.incr(key);
  }

  async decr(key: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.decr(key);
  }

  async hget(key: string, field: string): Promise<string | undefined> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.hGet(key, field);
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.hSet(key, field, value);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.hGetAll(key);
  }

  async hdel(key: string, field: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.hDel(key, field);
  }

  async sadd(key: string, member: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.sAdd(key, member);
  }

  async smembers(key: string): Promise<string[]> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.sMembers(key);
  }

  async srem(key: string, member: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.sRem(key, member);
  }

  async lpush(key: string, value: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.lPush(key, value);
  }

  async rpop(key: string): Promise<string | null> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.rPop(key);
  }

  async llen(key: string): Promise<number> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.lLen(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.lRange(key, start, stop);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.ping();
      return true;
    } catch {
      return false;
    }
  }

  async ping(): Promise<string> {
    if (!this.client) {
      throw new Error("Redis not connected");
    }
    return this.client.ping();
  }
}

// 创建 Redis 实例
const redisConfig: RedisConfig = {
  host: process.env["REDIS_HOST"] || "localhost",
  port: parseInt(process.env["REDIS_PORT"] || "6379"),
  password: process.env["REDIS_PASSWORD"] || "",
  db: parseInt(process.env["REDIS_DB"] || "0"),
};

export const redis = new Redis(redisConfig);
export default redis;
