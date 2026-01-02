/**
 * Configuration for API endpoints
 * 
 * Note: API_BASE_URL should NOT end with a trailing slash
 * Paths passed to API functions should start with a leading slash (e.g., "/products/")
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api';
export const INSIGHTS_BASE_URL =
  import.meta.env.VITE_INSIGHTS_BASE_URL ?? 'http://localhost:3001';

// Log config on import (only in dev)
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    API_BASE_URL,
    INSIGHTS_BASE_URL,
  });
}

