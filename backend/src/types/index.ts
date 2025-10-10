export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ToolCategory = "code" | "data" | "security" | "utility" | "design" | "text";

export interface ToolProcessRequest {
  toolId: string;
  input: string;
  options?: Record<string, any>;
}

export interface ToolProcessResponse {
  success: boolean;
  result?: string;
  error?: string;
  processingTime: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UsageStats {
  id: string;
  toolId: string;
  userId?: string;
  userIp: string;
  processingTime: number;
  success: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  type: "bug" | "feature" | "general";
  subject: string;
  message: string;
  email?: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export interface LogLevel {
  level: "error" | "warn" | "info" | "debug";
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

export interface SecurityConfig {
  corsOrigin: string | string[];
  rateLimit: RateLimitConfig;
  helmet: {
    contentSecurityPolicy: {
      directives: Record<string, string[]>;
    };
  };
}
