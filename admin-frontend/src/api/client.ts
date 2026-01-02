/**
 * Base API client with fetch wrapper
 * 
 * This module provides a centralized fetch wrapper that:
 * - Constructs full URLs from API_BASE_URL and paths
 * - Handles HTTP errors with clear status codes
 * - Distinguishes network errors from HTTP errors
 * - Provides consistent error messages
 */
import { API_BASE_URL } from '../config';

/**
 * Custom error for HTTP errors (non-2xx responses)
 */
class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public url: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Custom error for network failures (CORS, connection refused, etc.)
 */
class NetworkError extends Error {
  constructor(message: string, public url: string, public originalError?: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Core request function that handles all HTTP methods
 * 
 * @param path - API path starting with "/" (e.g., "/products/")
 * @param options - Fetch options (method, body, etc.)
 * @returns Parsed JSON response or null for 204 No Content
 * @throws ApiError for HTTP errors (non-2xx)
 * @throws NetworkError for network failures
 */
async function apiRequest<T>(path: string, options?: RequestInit): Promise<T | null> {
  // Ensure path starts with "/"
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_BASE_URL}${normalizedPath}`;

  // Log request in dev mode
  if (import.meta.env.DEV) {
    console.log('API Request:', {
      method: options?.method || 'GET',
      url: fullUrl,
      path: normalizedPath,
    });
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Handle HTTP errors (non-2xx status codes)
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      const errorMessage = `HTTP ${response.status} ${response.statusText} when calling ${fullUrl}: ${errorText}`;
      
      throw new ApiError(
        response.status,
        response.statusText,
        errorMessage,
        fullUrl
      );
    }

    // Handle 204 No Content (no response body)
    if (response.status === 204) {
      return null as T;
    }

    // Parse JSON response
    try {
      return await response.json();
    } catch (jsonError) {
      // If response is not valid JSON, throw an error
      throw new ApiError(
        response.status,
        response.statusText,
        `HTTP ${response.status} ${response.statusText} when calling ${fullUrl}: Response is not valid JSON`,
        fullUrl
      );
    }
  } catch (error) {
    // Re-throw ApiError as-is (HTTP errors)
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors (CORS, connection refused, fetch failures, etc.)
    console.error('Network error calling', fullUrl, error);
    
    throw new NetworkError(
      `NetworkError: Failed to reach backend at ${fullUrl}. Please ensure the backend is running.`,
      fullUrl,
      error
    );
  }
}

/**
 * GET request
 */
export async function apiGet<T>(path: string): Promise<T> {
  const result = await apiRequest<T>(path, {
    method: 'GET',
  });
  // GET requests should always return data (not null)
  if (result === null) {
    throw new Error(`Unexpected null response from GET ${path}`);
  }
  return result;
}

/**
 * POST request
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const jsonBody = body !== undefined ? JSON.stringify(body) : '{}';
  
  const result = await apiRequest<T>(path, {
    method: 'POST',
    body: jsonBody,
  });
  
  // POST requests typically return data, but handle null for 204 responses
  if (result === null) {
    // If we get 204, return empty object as fallback
    return {} as T;
  }
  return result;
}

/**
 * PUT request
 */
export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const jsonBody = body !== undefined ? JSON.stringify(body) : '{}';
  
  const result = await apiRequest<T>(path, {
    method: 'PUT',
    body: jsonBody,
  });
  
  if (result === null) {
    return {} as T;
  }
  return result;
}

/**
 * DELETE request
 */
export async function apiDelete(path: string): Promise<void> {
  await apiRequest(path, {
    method: 'DELETE',
  });
  // DELETE returns void, so we don't need to return the result
}
