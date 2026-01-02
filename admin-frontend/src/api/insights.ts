/**
 * Insights API (TypeScript microservice)
 * 
 * This module handles communication with the TypeScript insights microservice.
 * It uses INSIGHTS_BASE_URL instead of API_BASE_URL.
 */
import { INSIGHTS_BASE_URL } from '../config';
import { Product, InsightResponse } from '../types';

export async function fetchInsights(products: Product[]): Promise<InsightResponse> {
  // Map Product objects to the structure expected by the TS service
  const requestBody = {
    products: products.map((p) => ({
      name: p.name,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      rating: p.rating,
      stock: p.stock,
    })),
  };

  const url = `${INSIGHTS_BASE_URL}/insights`;

  // Log request in dev mode
  if (import.meta.env.DEV) {
    console.log('Insights API Request:', { url, productCount: products.length });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Handle HTTP errors (non-2xx status codes)
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      const errorMessage = `HTTP ${response.status} ${response.statusText} when calling ${url}: ${errorText}`;
      throw new Error(errorMessage);
    }

    // Parse JSON response
    try {
      return await response.json();
    } catch (jsonError) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText} when calling ${url}: Response is not valid JSON`
      );
    }
  } catch (error) {
    // Re-throw HTTP errors as-is (they already have status codes)
    if (error instanceof Error && error.message.includes('HTTP')) {
      throw error;
    }
    
    // Handle network errors (CORS, connection refused, etc.)
    console.error('Network error in fetchInsights:', {
      url,
      error,
      message: error instanceof Error ? error.message : String(error),
    });
    
    throw new Error(
      `NetworkError: Failed to reach insights service at ${url}. Please ensure the service is running.`
    );
  }
}

