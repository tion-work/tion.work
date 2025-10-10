import {
  ApiResponse,
  PaginatedResponse,
  Tool,
  ToolProcessRequest,
  ToolProcessResponse,
} from "../../../../shared/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.tion.work";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
  }> {
    return this.request("/health");
  }

  // Tools
  async getTools(): Promise<{ tools: Tool[] }> {
    return this.request("/tools");
  }

  async getTool(id: string): Promise<Tool> {
    return this.request(`/tools/${id}`);
  }

  async processTool(request: ToolProcessRequest): Promise<ToolProcessResponse> {
    return this.request(`/tools/${request.toolId}/process`, {
      method: "POST",
      body: JSON.stringify({
        input: request.input,
        options: request.options,
      }),
    });
  }

  // Usage stats
  async getUsageStats(
    toolId?: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (toolId) {
      params.append("toolId", toolId);
    }

    return this.request(`/usage-stats?${params}`);
  }

  // Feedback
  async submitFeedback(data: {
    type: "bug" | "feature" | "general";
    subject: string;
    message: string;
    email?: string;
  }): Promise<ApiResponse> {
    return this.request("/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Search
  async searchTools(query: string): Promise<{ results: Tool[] }> {
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  }

  // Categories
  async getCategories(): Promise<{ categories: string[] }> {
    return this.request("/categories");
  }

  // Popular tools
  async getPopularTools(limit = 10): Promise<{ tools: Tool[] }> {
    return this.request(`/tools/popular?limit=${limit}`);
  }

  // Recent tools
  async getRecentTools(limit = 10): Promise<{ tools: Tool[] }> {
    return this.request(`/tools/recent?limit=${limit}`);
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Convenience functions
export const api = {
  // Health
  health: () => apiClient.healthCheck(),

  // Tools
  tools: {
    list: () => apiClient.getTools(),
    get: (id: string) => apiClient.getTool(id),
    process: (request: ToolProcessRequest) => apiClient.processTool(request),
    search: (query: string) => apiClient.searchTools(query),
    popular: (limit?: number) => apiClient.getPopularTools(limit),
    recent: (limit?: number) => apiClient.getRecentTools(limit),
  },

  // Stats
  stats: {
    usage: (toolId?: string, page?: number, limit?: number) =>
      apiClient.getUsageStats(toolId, page, limit),
  },

  // Feedback
  feedback: (data: Parameters<typeof apiClient.submitFeedback>[0]) =>
    apiClient.submitFeedback(data),

  // Categories
  categories: () => apiClient.getCategories(),
};

// Error handling utilities
export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("An unknown error occurred");
};

// Request interceptor for adding auth tokens, etc.
export const withAuth = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Response interceptor for handling common responses
export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData.code
    );
  }

  return response.json();
};

export default apiClient;
