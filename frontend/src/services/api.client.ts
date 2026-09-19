import {
  ApiResponseDto,
  AuthResponseDto,
} from "@/dtos/auth.dto";

const API_BASE_URL = "";

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }

    return null;
  }

  private static async refreshAccessToken(): Promise<string | null> {
    if (typeof window === "undefined") {
      return null;
    }

    const refreshToken =
      localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return null;
    }

    try {
      console.log(
        "[AUTH] Token expirado. Solicitando renovación..."
      );

      const response = await fetch(
        `${API_BASE_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `No fue posible renovar el token: ${response.status}`
        );
      }

      const result =
        (await response.json()) as
          ApiResponseDto<AuthResponseDto>;

      localStorage.setItem(
        "token",
        result.data.token
      );

      if (result.data.refreshToken) {
        localStorage.setItem(
          "refreshToken",
          result.data.refreshToken
        );
      }

      console.log(
        "[AUTH] Refresh token exitoso. Nuevo JWT guardado."
      );

      return result.data.token;
    } catch (error) {
      console.error(
        "[AUTH] Error al renovar la sesión:",
        error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      return null;
    }
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<ApiResponseDto<T>> {
    const normalizedEndpoint =
      endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

    const url =
      `${API_BASE_URL}${normalizedEndpoint}`;

    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (
        response.status === 401 &&
        !isRetry &&
        endpoint !== "/api/auth/login" &&
        endpoint !== "/api/auth/refresh"
      ) {
        const newToken =
          await this.refreshAccessToken();

        if (newToken) {
          return this.request<T>(
            endpoint,
            options,
            true
          );
        }
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          `Error HTTP ${response.status}: ${response.statusText}`;

        throw new Error(errorMessage);
      }

      return data as ApiResponseDto<T>;
    } catch (error: any) {
      console.error(
        `[API ERROR] ${options.method || "GET"} ${url}:`,
        error.message
      );

      throw error;
    }
  }

  static get<T>(
    endpoint: string
  ): Promise<ApiResponseDto<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  static post<T>(
    endpoint: string,
    body: any
  ): Promise<ApiResponseDto<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  static put<T>(
    endpoint: string,
    body: any
  ): Promise<ApiResponseDto<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  static delete<T>(
    endpoint: string
  ): Promise<ApiResponseDto<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}
