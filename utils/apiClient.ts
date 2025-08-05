import { Platform } from 'react-native';
import { safeGetItem, safeRemoveItem } from './storage';

// API Configuration
const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:5000' 
    : 'https://api.platefull.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Request/Response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// API Client Class
class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Get auth token from storage
  private async getAuthToken(): Promise<string | null> {
    try {
      return await safeGetItem('userToken');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  // Create request headers
  private async createHeaders(customHeaders?: Record<string, string>): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': `PlateFull/${Platform.OS}`,
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API errors
  private handleApiError(error: any, url: string): ApiError {
    console.error(`API Error for ${url}:`, error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        code: 'NETWORK_ERROR'
      };
    }

    if (error.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      this.handleUnauthorized();
      return {
        message: 'Session expired. Please sign in again.',
        status: 401,
        code: 'UNAUTHORIZED'
      };
    }

    return {
      message: error.message || 'An unexpected error occurred',
      status: error.status || 500,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }

  // Handle unauthorized requests
  private async handleUnauthorized(): Promise<void> {
    try {
      await safeRemoveItem('userToken');
      await safeRemoveItem('userEmail');
      await safeRemoveItem('userName');
      await safeRemoveItem('userId');
      
      // You can add navigation logic here to redirect to login
      console.log('User session cleared due to unauthorized access');
    } catch (error) {
      console.error('Failed to clear user session:', error);
    }
  }

  // Retry mechanism for failed requests
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error: any) {
      if (retries > 0 && (error.status >= 500 || error.status === 0)) {
        console.log(`Retrying request... (${API_CONFIG.RETRY_ATTEMPTS - retries + 1}/${API_CONFIG.RETRY_ATTEMPTS})`);
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  // Generic request method
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.baseURL}${url}`;
    const headers = await this.createHeaders(options.headers as Record<string, string>);

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await this.retryRequest(async () => {
        const res = await fetch(fullUrl, requestOptions);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const error = new Error(errorData.message || `HTTP ${res.status}`);
          (error as any).status = res.status;
          (error as any).code = errorData.code;
          throw error;
        }
        
        return res;
      });

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      const apiError = this.handleApiError(error, fullUrl);
      return {
        success: false,
        error: apiError.message,
      };
    }
  }

  // GET request
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${url}${queryString}`, {
      method: 'GET',
    });
  }

  // POST request
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'DELETE',
    });
  }

  // Upload file
  async uploadFile<T>(
    url: string,
    file: any,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {
      'Authorization': token ? `Bearer ${token}` : '',
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      const apiError = this.handleApiError(error, url);
      return {
        success: false,
        error: apiError.message,
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }
}

// Export singleton instance
const apiClient = ApiClient.getInstance();
export default apiClient;

// Export types for use in other files
export type { ApiResponse, ApiError }; 