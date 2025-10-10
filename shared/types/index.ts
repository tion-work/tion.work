export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ToolCategory =
  | "code"
  | "data"
  | "security"
  | "utility"
  | "design"
  | "text";

export type Language = "zh" | "en";

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

export interface ToolOption {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "select";
  defaultValue: any;
  options?: { label: string; value: any }[];
  description?: string;
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  options: ToolOption[];
  processor: (input: string, options?: Record<string, any>) => Promise<string>;
  validator: (input: string) => boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
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

export interface Theme {
  mode: "light" | "dark" | "system";
}

export interface Settings {
  theme: Theme;
  language: string;
  autoSave: boolean;
  notifications: boolean;
}

export interface HistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  input: string;
  output: string;
  timestamp: string;
  options?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: string;
  score: number;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
}

export interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: string | number;
  options?: Record<string, any>;
}

export interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  className?: string;
}

export interface ToolPageProps {
  tool: Tool;
  config: ToolConfig;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface NavigationProps {
  currentPath?: string;
}

export interface FooterProps {
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "url";
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  id?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
