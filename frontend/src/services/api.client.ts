import { ApiResponseDto } from "@/dtos/auth.dto";

const API_BASE_URL = "";

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponseDto<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.message || `Error HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      return data as ApiResponseDto<T>;
    } catch (error: any) {
      console.error(`[API ERROR] ${options.method || "GET"} ${url}:`, error.message);
      throw error;
    }
  }

  static get<T>(endpoint: string): Promise<ApiResponseDto<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  static post<T>(endpoint: string, body: any): Promise<ApiResponseDto<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  static put<T>(endpoint: string, body: any): Promise<ApiResponseDto<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  static delete<T>(endpoint: string): Promise<ApiResponseDto<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}
