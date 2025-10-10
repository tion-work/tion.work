// 全局类型声明
declare global {
  var process: {
    env: {
      NODE_ENV?: string;
      LOG_LEVEL?: string;
      npm_package_version?: string;
      DB_HOST?: string;
      DB_PORT?: string;
      DB_NAME?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_SSL?: string;
      REDIS_URL?: string;
      REDIS_HOST?: string;
      REDIS_PORT?: string;
      REDIS_PASSWORD?: string;
      REDIS_DB?: string;
      CORS_ORIGIN?: string;
      API_URL?: string;
      PORT?: string;
      HOST?: string;
      [key: string]: string | undefined;
    };
    uptime(): number;
    exit(code?: number): never;
    on(event: string, listener: (...args: any[]) => void): void;
  };
  
  var console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
  };
  
  var Buffer: {
    from(data: string, encoding?: string): Buffer;
  };
}

export {};
